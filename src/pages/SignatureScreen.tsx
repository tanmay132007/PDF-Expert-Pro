import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { CaretLeft, Eraser, CheckCircle } from '@phosphor-icons/react';
import { PDFService } from '../lib/PDFService';
import { useFiles } from '../lib/FileContext';
import { motion } from 'framer-motion';
import { useToast } from '../lib/ToastContext';
import AnimatedButton from '../components/AnimatedButton';
import InteractiveStamp from '../components/InteractiveStamp';

const SignatureScreen: React.FC = () => {
  const navigate = useNavigate();
  const { files, addFile } = useFiles();
  const { showToast } = useToast();
  
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [step, setSetp] = useState<'draw' | 'position' | 'done'>('draw');
  
  const sigCanvas = useRef<any>(null);
  const selectedFile = files.find(f => f.id === selectedFileId);

  const handleClear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  const startPositioning = () => {
    if (!selectedFile || !selectedFile.blob || !sigCanvas.current || sigCanvas.current.isEmpty()) {
      showToast('Please select a file and draw your signature.', 'error');
      return;
    }
    const signatureDataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    setSignatureData(signatureDataUrl);
    setSetp('position');
  };

  const handleStampComplete = async (pos: { x: number, y: number, page: number }) => {
    if (!selectedFile || !selectedFile.blob || !signatureData) return;
    setIsProcessing(true);
    try {
      const result = await PDFService.addSignature(selectedFile.blob, signatureData, pos.page);
      setResultBlob(result);
      setSetp('done');
      showToast('Signature applied successfully', 'success');
    } catch (error) {
      console.error('Signing failed', error);
      showToast('Failed to apply signature', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const saveToLibrary = async () => {
    if (resultBlob) {
      const file = new File([resultBlob], `signed_${selectedFile?.name}`, { type: 'application/pdf' });
      await addFile(file);
      navigate('/dashboard/files');
    }
  };

  if (step === 'position' && selectedFile?.blob && signatureData) {
    return <InteractiveStamp pdfFile={selectedFile.blob} signatureImage={signatureData} onComplete={handleStampComplete} />;
  }

  if (step === 'done' && resultBlob) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 20 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', backgroundColor: 'var(--semantic-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <CheckCircle size={64} color="#FFF" weight="fill" />
          </div>
          <h1 className="heading-h1">Document Signed!</h1>
          <p className="body-md" style={{ color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>Your signature has been stamped correctly.</p>
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
        <span className="heading-h2" style={{ marginLeft: 16 }}>Sign PDF</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        <label className="label-lg" style={{ color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>Select File to Sign</label>
        
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span className="title-md">Draw Signature</span>
              <span className="label-sm" onClick={handleClear} style={{ color: 'var(--primary-500)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Eraser size={16} /> Clear
              </span>
            </div>
            
            <div style={{ border: '2px dashed var(--border-default)', borderRadius: 16, backgroundColor: 'var(--surface-card)', overflow: 'hidden' }}>
              <SignatureCanvas 
                ref={sigCanvas}
                penColor="black"
                canvasProps={{ style: { width: '100%', height: 200, cursor: 'crosshair' } }}
              />
            </div>
          </motion.div>
        )}
      </div>

      <div style={{ padding: 20 }}>
        <AnimatedButton 
          disabled={!selectedFile || isProcessing}
          onClick={startPositioning}
        >
          {isProcessing ? 'Processing...' : 'Position Signature →'}
        </AnimatedButton>
      </div>
    </div>
  );
};

export default SignatureScreen;
