import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretLeft, CheckSquareOffset } from '@phosphor-icons/react';
import { useFiles } from '../lib/FileContext';
import { motion } from 'framer-motion';
import { useToast } from '../lib/ToastContext';
import AnimatedButton from '../components/AnimatedButton';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Use a more stable worker source from the package itself
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const OCRScreen: React.FC = () => {
  const navigate = useNavigate();
  const { files, addFile } = useFiles();
  const { showToast } = useToast();
  
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState<string | null>(null);

  const selectedFile = files.find(f => f.id === selectedFileId);

  const handleOCR = async () => {
    if (!selectedFile || !selectedFile.blob) return;
    setIsProcessing(true);
    setProgress(0);
    try {
      const pdfBytes = await selectedFile.blob.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
      const page = await pdf.getPage(1); 
      
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context!, viewport, canvas: null as any }).promise;
      const imageUrl = canvas.toDataURL('image/png');

      const result = await Tesseract.recognize(
        imageUrl,
        'eng',
        { logger: m => {
          if (m.status === 'recognizing text') setProgress(Math.round(m.progress * 100));
        }}
      );

      setExtractedText(result.data.text);
      showToast('OCR Complete!', 'success');
    } catch (error) {
      console.error('OCR failed', error);
      showToast('OCR failed. Make sure the file contains clear text/images.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText);
      showToast('Text copied to clipboard', 'info');
    }
  };

  if (extractedText) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 20 }}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <CaretLeft size={24} onClick={() => setExtractedText(null)} style={{ cursor: 'pointer' }} />
          <span className="heading-h2" style={{ marginLeft: 16 }}>Extracted Text</span>
        </div>
        <div style={{ flex: 1, backgroundColor: 'var(--surface-card)', borderRadius: 16, padding: 20, border: '1px solid var(--border-default)', overflowY: 'auto', fontFamily: 'monospace', fontSize: 14, whiteSpace: 'pre-wrap' }}>
          {extractedText}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
          <AnimatedButton onClick={handleCopy}>Copy Text</AnimatedButton>
          <AnimatedButton variant="secondary" onClick={() => navigate(-1)}>Close</AnimatedButton>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid var(--border-default)' }}>
        <CaretLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <span className="heading-h2" style={{ marginLeft: 16 }}>OCR Scanner Pro</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        <label className="label-lg" style={{ color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>Select Document</label>
        
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

        {selectedFile && !isProcessing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ backgroundColor: 'var(--primary-100)', padding: 20, borderRadius: 16, textAlign: 'center' }}>
               <CheckSquareOffset size={48} color="var(--primary-500)" weight="fill" />
               <div className="title-md" style={{ color: 'var(--primary-500)', marginTop: 12 }}>Ready for OCR</div>
               <div className="caption" style={{ color: 'var(--text-muted)', marginTop: 4 }}>This will extract all text from the first page of your document using AI.</div>
            </div>
          </motion.div>
        )}

        {isProcessing && (
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <div style={{ height: 8, width: '100%', backgroundColor: 'var(--border-default)', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
               <motion.div style={{ height: '100%', width: `${progress}%`, backgroundColor: 'var(--primary-500)' }} />
            </div>
            <div className="title-md">Processing OCR... {progress}%</div>
            <div className="caption" style={{ color: 'var(--text-muted)', marginTop: 8 }}>Using Tesseract AI Engine</div>
          </div>
        )}
      </div>

      <div style={{ padding: 20 }}>
        <AnimatedButton 
          disabled={!selectedFile || isProcessing}
          onClick={handleOCR}
        >
          {isProcessing ? 'Reading Text...' : 'Start Extraction →'}
        </AnimatedButton>
      </div>
    </div>
  );
};

export default OCRScreen;
