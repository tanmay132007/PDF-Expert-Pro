import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretLeft, CheckCircle, FilePdf } from '@phosphor-icons/react';
import { PDFService } from '../lib/PDFService';
import { useFiles } from '../lib/FileContext';
import { motion } from 'framer-motion';
import AnimatedButton from '../components/AnimatedButton';

const SplitScreen: React.FC = () => {
  const navigate = useNavigate();
  const { files, addFile } = useFiles();
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const [fromPage, setFromPage] = useState(1);
  const [toPage, setToPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlobs, setResultBlobs] = useState<Blob[] | null>(null);

  const selectedFile = files.find(f => f.id === selectedFileId);

  const handleSplit = async () => {
    if (!selectedFile || !selectedFile.blob) return;
    setIsProcessing(true);
    try {
      const results = await PDFService.splitPDF(selectedFile.blob, [{ from: fromPage, to: toPage }]);
      setResultBlobs(results);
    } catch (error) {
      console.error('Split failed', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveToLibrary = async () => {
    if (resultBlobs) {
      for (let i = 0; i < resultBlobs.length; i++) {
        const file = new File([resultBlobs[i]], `split_${i+1}_${selectedFile?.name}`, { type: 'application/pdf' });
        await addFile(file);
      }
      navigate('/dashboard/files');
    }
  };

  if (resultBlobs) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 20 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', backgroundColor: 'var(--semantic-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <CheckCircle size={64} color="#FFF" weight="fill" />
          </div>
          <h1 className="heading-h1">Split Complete!</h1>
          <p className="body-md" style={{ color: 'var(--text-muted)', marginTop: 8 }}>Pages {fromPage}-{toPage} extracted successfully.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 24 }}>
          <button className="btn-primary" onClick={saveToLibrary}>Save to Library</button>
          <button className="btn-secondary" onClick={() => navigate(-1)}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid var(--border-default)' }}>
        <CaretLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <span className="heading-h2" style={{ marginLeft: 16 }}>Split PDF</span>
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
              <option key={f.id} value={f.id}>{f.name} ({f.pages} pages)</option>
            ))}
          </select>
          <div style={{ color: 'var(--text-muted)' }}>or</div>
          <AnimatedButton 
            variant="secondary" 
            style={{ height: 56, padding: '0 16px', flexShrink: 0 }}
            onClick={() => document.getElementById('direct-upload')?.click()}
          >
            Upload
          </AnimatedButton>
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
            <div className="title-md" style={{ marginBottom: 16 }}>Extraction Range</div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
              <div style={{ flex: 1 }}>
                <label className="caption">From Page</label>
                <input 
                  type="number" className="input-field" value={fromPage} 
                  onChange={e => setFromPage(Math.max(1, parseInt(e.target.value)))} 
                  min={1} max={selectedFile.pages}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="caption">To Page</label>
                <input 
                  type="number" className="input-field" value={toPage} 
                  onChange={e => setToPage(Math.min(selectedFile.pages, Math.max(fromPage, parseInt(e.target.value))))} 
                  min={fromPage} max={selectedFile.pages}
                />
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--surface-card)', borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', boxShadow: 'var(--shadow-level-1)' }}>
               <FilePdf size={40} color="var(--primary-500)" weight="fill" />
               <div style={{ marginLeft: 16 }}>
                  <div className="title-md">{selectedFile.name}</div>
                  <div className="caption" style={{ color: 'var(--text-muted)' }}>{selectedFile.pages} pages total</div>
               </div>
            </div>
          </motion.div>
        )}
      </div>

      <div style={{ padding: 20 }}>
        <button 
          className="btn-primary" 
          disabled={!selectedFile || isProcessing}
          onClick={handleSplit}
        >
          {isProcessing ? 'Processing...' : 'Split PDF →'}
        </button>
      </div>
    </div>
  );
};

export default SplitScreen;
