import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretLeft, TextT, CheckCircle, FilePdf } from '@phosphor-icons/react';
import { PDFService } from '../lib/PDFService';
import { useFiles } from '../lib/FileContext';
import { motion } from 'framer-motion';
import { useToast } from '../lib/ToastContext';
import AnimatedButton from '../components/AnimatedButton';

const WatermarkScreen: React.FC = () => {
  const navigate = useNavigate();
  const { files, addFile } = useFiles();
  const { showToast } = useToast();
  
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const [watermarkText, setWatermarkText] = useState('PDF EXPERT PRO');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const selectedFile = files.find(f => f.id === selectedFileId);

  const handleWatermark = async () => {
    if (!selectedFile || !selectedFile.blob || !watermarkText) return;
    setIsProcessing(true);
    try {
      // We'll update PDFService to handle watermarking
      const result = await (PDFService as any).addWatermark(selectedFile.blob, watermarkText);
      setResultBlob(result);
      showToast('Watermark added!', 'success');
    } catch (error) {
      console.error('Watermarking failed', error);
      showToast('Watermarking failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const saveToLibrary = async () => {
    if (resultBlob) {
      const file = new File([resultBlob], `watermarked_${selectedFile?.name}`, { type: 'application/pdf' });
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
          <h1 className="heading-h1">Watermark Applied!</h1>
          <p className="body-md" style={{ color: 'var(--text-muted)', marginTop: 8 }}>Your document is now branded.</p>
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
        <span className="heading-h2" style={{ marginLeft: 16 }}>Add Watermark</span>
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
            <div className="title-md" style={{ marginBottom: 16 }}>Watermark Content</div>
            
            <div className="input-container">
               <input 
                 type="text" className="input-field" placeholder="Watermark Text" 
                 value={watermarkText} onChange={e => setWatermarkText(e.target.value)}
               />
               <label className="input-label">Watermark Text</label>
            </div>

            <div style={{ marginTop: 24 }}>
               <div className="title-md" style={{ marginBottom: 12 }}>Appearance</div>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ padding: 16, borderRadius: 12, border: '1px solid var(--primary-500)', backgroundColor: 'var(--primary-100)', textAlign: 'center' }}>
                     <TextT size={24} color="var(--primary-500)" />
                     <div className="caption" style={{ marginTop: 4 }}>Text Watermark</div>
                  </div>
                  <div style={{ padding: 16, borderRadius: 12, border: '1px solid var(--border-default)', backgroundColor: 'var(--surface-card)', textAlign: 'center', opacity: 0.5 }}>
                     <FilePdf size={24} color="var(--text-muted)" />
                     <div className="caption" style={{ marginTop: 4 }}>Image (Pro)</div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </div>

      <div style={{ padding: 20 }}>
        <AnimatedButton 
          disabled={!selectedFile || isProcessing || !watermarkText}
          onClick={handleWatermark}
        >
          {isProcessing ? 'Applying...' : 'Apply Watermark →'}
        </AnimatedButton>
      </div>
    </div>
  );
};

export default WatermarkScreen;
