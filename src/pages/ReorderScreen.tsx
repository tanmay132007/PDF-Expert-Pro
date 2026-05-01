import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretLeft, CheckCircle, ArrowsDownUp } from '@phosphor-icons/react';
import { useFiles } from '../lib/FileContext';
import { motion } from 'framer-motion';
import { useToast } from '../lib/ToastContext';
import AnimatedButton from '../components/AnimatedButton';
import { PDFDocument } from 'pdf-lib';

const ReorderScreen: React.FC = () => {
  const navigate = useNavigate();
  const { files, addFile } = useFiles();
  const { showToast } = useToast();
  
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const [pages, setPages] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const selectedFile = files.find(f => f.id === selectedFileId);

  useEffect(() => {
    if (selectedFile) {
      setPages(Array.from({ length: selectedFile.pages }, (_, i) => i));
    }
  }, [selectedFile]);

  const movePage = (index: number, direction: 'up' | 'down') => {
    const newPages = [...pages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pages.length) return;
    
    [newPages[index], newPages[targetIndex]] = [newPages[targetIndex], newPages[index]];
    setPages(newPages);
  };

  const handleReorder = async () => {
    if (!selectedFile || !selectedFile.blob) return;
    setIsProcessing(true);
    try {
      const pdfBytes = await selectedFile.blob.arrayBuffer();
      const sourcePdf = await PDFDocument.load(pdfBytes);
      const newPdf = await PDFDocument.create();
      
      const copiedPages = await newPdf.copyPages(sourcePdf, pages);
      copiedPages.forEach(p => newPdf.addPage(p));
      
      const newPdfBytes = await newPdf.save();
      setResultBlob(new Blob([newPdfBytes as any], { type: 'application/pdf' }));
      showToast('Pages reordered!', 'success');
    } catch (error) {
      console.error('Reorder failed', error);
      showToast('Reorder failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const saveToLibrary = async () => {
    if (resultBlob) {
      const file = new File([resultBlob], `reordered_${selectedFile?.name}`, { type: 'application/pdf' });
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
          <h1 className="heading-h1">Reorder Complete!</h1>
          <p className="body-md" style={{ color: 'var(--text-muted)', marginTop: 8 }}>Pages have been rearranged successfully.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 24 }}>
          <AnimatedButton onClick={saveToLibrary}>Save to Library</AnimatedButton>
          <AnimatedButton variant="secondary" onClick={() => navigate(-1)}>Done</AnimatedButton>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid var(--border-default)' }}>
        <CaretLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <span className="heading-h2" style={{ marginLeft: 16 }}>Reorder Pages</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        <label className="label-lg" style={{ color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>Select File</label>
        
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
          <select 
            className="input-field" 
            value={selectedFileId} 
            onChange={e => setSelectedFileId(e.target.value)}
            style={{ appearance: 'none', flex: 1, marginBottom: 0 }}
          >
            <option value="">Choose from library...</option>
            {files.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
          <div style={{ color: 'var(--text-muted)' }}>or</div>
          <button 
            className="btn-secondary" 
            style={{ height: 56, padding: '0 16px', flexShrink: 0, width: 'auto' }}
            onClick={() => document.getElementById('direct-upload')?.click()}
          >
            Upload
          </button>
          <input 
            type="file" 
            id="direct-upload" 
            hidden 
            accept=".pdf" 
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const newId = await addFile(file);
                if (newId) setSelectedFileId(newId);
              }
            }} 
          />
        </div>

        {selectedFile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="title-md" style={{ marginBottom: 16 }}>Rearrange Pages</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
               {pages.map((pIndex, i) => (
                 <motion.div 
                   key={pIndex} 
                   layout
                   style={{ 
                     height: 56, backgroundColor: 'var(--surface-card)', borderRadius: 12, border: '1px solid var(--border-default)',
                     display: 'flex', alignItems: 'center', padding: '0 16px', gap: 16
                   }}
                 >
                    <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{i + 1}</div>
                    <div style={{ flex: 1 }} className="body-md">Page {pIndex + 1}</div>
                    <div style={{ display: 'flex', gap: 12 }}>
                       <ArrowsDownUp size={20} color="var(--text-muted)" style={{ cursor: 'grab' }} />
                       <div onClick={() => movePage(i, 'up')} style={{ opacity: i === 0 ? 0.3 : 1, cursor: 'pointer' }}>↑</div>
                       <div onClick={() => movePage(i, 'down')} style={{ opacity: i === pages.length - 1 ? 0.3 : 1, cursor: 'pointer' }}>↓</div>
                    </div>
                 </motion.div>
               ))}
            </div>
            
          </motion.div>
        )}
      </div>

      <div style={{ padding: 20 }}>
        <AnimatedButton 
          disabled={!selectedFile || isProcessing}
          onClick={handleReorder}
        >
          {isProcessing ? 'Processing...' : 'Save New Order →'}
        </AnimatedButton>
      </div>
    </div>
  );
};

export default ReorderScreen;
