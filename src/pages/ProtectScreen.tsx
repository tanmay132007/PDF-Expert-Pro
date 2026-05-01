import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretLeft, LockKey, CheckCircle } from '@phosphor-icons/react';
import { PDFService } from '../lib/PDFService';
import { useFiles } from '../lib/FileContext';
import { motion } from 'framer-motion';

const ProtectScreen: React.FC = () => {
  const navigate = useNavigate();
  const { files, addFile } = useFiles();
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const selectedFile = files.find(f => f.id === selectedFileId);

  const handleProtect = async () => {
    if (!selectedFile || !selectedFile.blob || !password || password !== confirmPassword) return;
    setIsProcessing(true);
    try {
      const result = await PDFService.protectPDF(selectedFile.blob, password);
      setResultBlob(result);
    } catch (error) {
      console.error('Protection failed', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveToLibrary = async () => {
    if (resultBlob) {
      const file = new File([resultBlob], `protected_${selectedFile?.name}`, { type: 'application/pdf' });
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
          <h1 className="heading-h1">Protection Added!</h1>
          <p className="body-md" style={{ color: 'var(--text-muted)', marginTop: 8 }}>Your PDF is now secured with a password.</p>
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
        <span className="heading-h2" style={{ marginLeft: 16 }}>Protect PDF</span>
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
            <div className="title-md" style={{ marginBottom: 16 }}>Security Settings</div>
            
            <div className="input-container">
               <input 
                 type="password" className="input-field" placeholder="Set Password" 
                 value={password} onChange={e => setPassword(e.target.value)}
               />
               <label className="input-label">Set Password</label>
            </div>

            <div className="input-container">
               <input 
                 type="password" className="input-field" placeholder="Confirm Password" 
                 value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
               />
               <label className="input-label">Confirm Password</label>
            </div>

            <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text-muted)' }}>
               <LockKey size={16} />
               <span className="caption">Encryption: AES-256 (Simulated)</span>
            </div>
          </motion.div>
        )}
      </div>

      <div style={{ padding: 20 }}>
        <button 
          className="btn-primary" 
          disabled={!selectedFile || !password || password !== confirmPassword || isProcessing}
          onClick={handleProtect}
        >
          {isProcessing ? 'Securing...' : 'Protect PDF →'}
        </button>
      </div>
    </div>
  );
};

export default ProtectScreen;
