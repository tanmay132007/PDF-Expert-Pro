import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CaretLeft, Info, Warning, DownloadSimple, ArrowsOut } from '@phosphor-icons/react';
import { useFiles } from '../lib/FileContext';

const PDFViewer: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFile, downloadFile } = useFiles();
  const file = getFile(id || '');

  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let currentUrl: string | null = null;

    const prepareViewer = async () => {
      if (file) {
        try {
          let blob = file.blob;
          
          // If not in local memory, fetch securely from cloud
          if (!blob && file.storagePath) {
            blob = await downloadFile(file.storagePath) || undefined;
          }

          if (blob) {
            currentUrl = URL.createObjectURL(blob);
            setObjectUrl(currentUrl);
            setIsLoading(false);
          } else {
            setError("Document could not be retrieved from memory or cloud.");
            setIsLoading(false);
          }
        } catch (err: any) {
          setError(err.message);
          setIsLoading(false);
        }
      }
    };

    prepareViewer();

    // Cleanup: Revoke the URL when leaving to prevent memory leaks
    return () => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, [file, downloadFile]);

  if (!file) return <div style={{ padding: 40, textAlign: 'center', color: '#FFF' }}>File not found</div>;

  const handleDownload = () => {
    if (objectUrl) {
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = file.name;
      a.click();
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#1A1A2E' }}>
      
      {/* Immersive Header */}
      <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 20px', color: '#FFF', borderBottom: '1px solid #2D3748', flexShrink: 0 }}>
        <CaretLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <div style={{ marginLeft: 16, flex: 1, overflow: 'hidden' }}>
           <div className="title-md" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
           <div className="caption" style={{ color: 'var(--text-muted)' }}>Native System Viewer</div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
           <DownloadSimple size={24} onClick={handleDownload} style={{ cursor: 'pointer' }} />
           <Info size={24} />
        </div>
      </div>

      {/* Local Native Viewer Area */}
      <div style={{ flex: 1, backgroundColor: '#0F0F1A', position: 'relative' }}>
        {isLoading ? (
           <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', flexDirection: 'column', gap: 12 }}>
              <div className="pulsing-circle" />
              <div className="body-md">Securing PDF...</div>
           </div>
        ) : error ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#FFF' }}>
            <Warning size={48} color="var(--semantic-error)" />
            <div className="heading-h2" style={{ marginTop: 16 }}>Load Failed</div>
            <p className="body-md" style={{ color: 'var(--text-muted)' }}>{error}</p>
            <button className="btn-primary" style={{ marginTop: 24 }} onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          /* Using the Native Browser Engine */
          <iframe
            src={`${objectUrl}#toolbar=1&view=FitH`}
            title="PDF Viewer"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        )}
      </div>

      {/* Footer Info */}
      <div style={{ height: 44, backgroundColor: '#1A1A2E', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
         <div className="caption" style={{ color: '#718096', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ArrowsOut size={14} /> Full Screen Native Experience
         </div>
      </div>

      <style>{`
        .pulsing-circle {
          width: 40px; height: 40px;
          border-radius: 50%;
          border: 3px solid var(--primary-500);
          border-top-color: transparent;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default PDFViewer;
