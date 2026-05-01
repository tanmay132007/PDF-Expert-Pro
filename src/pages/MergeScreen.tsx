import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { CaretLeft, Plus, Trash, GitMerge, CheckCircle, ShareNetwork, Eye } from '@phosphor-icons/react';
import { PDFService } from '../lib/PDFService';
import { useFiles } from '../lib/FileContext';
import { motion, AnimatePresence } from 'framer-motion';

const MergeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { addFile } = useFiles();
  const [selectedFiles, setSelectedFiles] = useState<{ id: string, file: File, pages: number }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = await Promise.all(acceptedFiles.map(async f => ({
      id: Math.random().toString(36).substr(2, 9),
      file: f,
      pages: await PDFService.getPageCount(f)
    })));
    setSelectedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'application/pdf': ['.pdf'] } 
  });

  const handleMerge = async () => {
    if (selectedFiles.length < 2) return;
    setIsProcessing(true);
    try {
      const mergedBlob = await PDFService.mergePDFs(selectedFiles.map(f => f.file));
      setResultBlob(mergedBlob);
    } catch (error) {
      console.error('Merge failed', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveToLibrary = async () => {
    if (resultBlob) {
      const file = new File([resultBlob], 'merged_output.pdf', { type: 'application/pdf' });
      await addFile(file);
      navigate('/dashboard/files');
    }
  };

  if (resultBlob) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 20 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', backgroundColor: 'var(--semantic-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <CheckCircle size={64} color="#FFF" weight="fill" />
          </div>
          <h1 className="heading-h1">Merge Complete!</h1>
          <p className="body-md" style={{ color: 'var(--text-muted)', marginTop: 8 }}>Your files have been combined successfully.</p>
          
          <div style={{ marginTop: 32, width: '100%', backgroundColor: 'var(--surface-card)', borderRadius: 16, padding: 16, boxShadow: 'var(--shadow-level-1)', display: 'flex', alignItems: 'center' }}>
             <div style={{ width: 48, height: 60, backgroundColor: 'var(--primary-100)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GitMerge size={24} color="var(--primary-500)" />
             </div>
             <div style={{ flex: 1, marginLeft: 16 }}>
                <div className="title-md">merged_output.pdf</div>
                <div className="caption" style={{ color: 'var(--text-muted)' }}>{(resultBlob.size / (1024*1024)).toFixed(2)} MB · {selectedFiles.reduce((acc, f) => acc + f.pages, 0)} pages</div>
             </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 24 }}>
          <button className="btn-primary" onClick={saveToLibrary}>Save to Library</button>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-secondary" style={{ flex: 1, display: 'flex', gap: 8 }}>
              <Eye size={20} /> Open
            </button>
            <button className="btn-secondary" style={{ flex: 1, display: 'flex', gap: 8 }}>
              <ShareNetwork size={20} /> Share
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid var(--border-default)' }}>
        <CaretLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <span className="heading-h2" style={{ marginLeft: 16 }}>Merge PDFs</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {/* Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 32 }}>
          {['Add Files', 'Arrange', 'Merge'].map((step, i) => (
            <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
               <div style={{ 
                 width: 24, height: 24, borderRadius: '50%', 
                 backgroundColor: i === 0 ? 'var(--primary-500)' : '#E2E8E0', 
                 color: i === 0 ? '#FFF' : 'var(--text-muted)',
                 display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700
               }}>
                 {i + 1}
               </div>
               <span className="caption" style={{ fontWeight: i === 0 ? 600 : 400 }}>{step}</span>
            </div>
          ))}
        </div>

        {/* Dropzone */}
        <div {...getRootProps()} style={{ 
          height: 140, border: '2px dashed #CBD5E0', borderRadius: 16, backgroundColor: isDragActive ? 'var(--primary-100)' : 'var(--surface-bg)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease'
        }}>
          <input {...getInputProps()} />
          <Plus size={40} color="#CBD5E0" />
          <span className="title-md" style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Tap to add PDFs</span>
          <span className="caption" style={{ color: 'var(--text-muted)' }}>or drag files here</span>
        </div>

        {/* Files List */}
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AnimatePresence>
            {selectedFiles.map((f, i) => (
              <motion.div 
                key={f.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ 
                  height: 64, backgroundColor: 'var(--surface-card)', borderRadius: 12, padding: '0 12px',
                  display: 'flex', alignItems: 'center', boxShadow: 'var(--shadow-level-1)'
                }}
              >
                <div style={{ width: 24, height: 24, color: 'var(--text-muted)' }}>{i + 1}</div>
                <div style={{ width: 40, height: 48, backgroundColor: 'var(--primary-100)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
                  <GitMerge size={20} color="var(--primary-500)" />
                </div>
                <div style={{ flex: 1, marginLeft: 12, overflow: 'hidden' }}>
                  <div className="title-md" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.file.name}</div>
                  <div className="caption" style={{ color: 'var(--text-muted)' }}>{f.pages} pages</div>
                </div>
                <div 
                  onClick={() => setSelectedFiles(prev => prev.filter(item => item.id !== f.id))}
                  style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Trash size={18} color="var(--semantic-error)" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div style={{ padding: 20, borderTop: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ textAlign: 'center' }} className="body-md">
          {selectedFiles.length} files · {selectedFiles.reduce((acc, f) => acc + f.pages, 0)} pages total
        </div>
        <button 
          className="btn-primary" 
          disabled={selectedFiles.length < 2 || isProcessing}
          onClick={handleMerge}
        >
          {isProcessing ? 'Merging...' : 'Merge PDFs →'}
        </button>
      </div>
    </div>
  );
};

export default MergeScreen;
