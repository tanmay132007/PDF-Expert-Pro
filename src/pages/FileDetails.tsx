import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CaretLeft, ShareNetwork, Trash, Star, FilePdf, Pencil, DownloadSimple, Scissors } from '@phosphor-icons/react';
import { useFiles } from '../lib/FileContext';
import { useAuth } from '../lib/AuthContext';

const FileDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFile, toggleStar, removeFile } = useFiles();
  const { profile } = useAuth();
  const file = getFile(id || '');

  if (!file) return <div style={{ padding: 20 }}>File not found</div>;

  const handleDownload = () => {
    if (file.blob) {
      const url = URL.createObjectURL(file.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
    } else if (file.previewUrl) {
      const a = document.createElement('a');
      a.href = file.previewUrl;
      a.download = file.name;
      a.target = '_blank';
      a.click();
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--surface-bg)' }}>
      {/* App Bar */}
      <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 20px', backgroundColor: 'var(--surface-card)' }}>
        <CaretLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <span className="heading-h2" style={{ marginLeft: 16, flex: 1 }}>File Details</span>
        <Pencil size={24} color="var(--text-primary)" />
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Preview Section */}
        <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F8FC' }}>
          <div style={{ width: 140, height: 180, backgroundColor: '#FFF', borderRadius: 8, boxShadow: 'var(--shadow-level-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FilePdf size={64} color="var(--primary-500)" weight="fill" />
          </div>
        </div>

        <div style={{ padding: '24px 20px' }}>
          <h1 className="heading-h2" style={{ textAlign: 'center' }}>{file.name}</h1>
          
          {/* Action Chips */}
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '20px 0' }}>
            {[
              { icon: FilePdf, label: 'Open', color: 'var(--primary-500)', onClick: () => navigate(`/view/${file.id}`) },
              { icon: ShareNetwork, label: 'Share' },
              { icon: DownloadSimple, label: 'Download', onClick: handleDownload },
              { icon: Star, label: file.starred ? 'Starred' : 'Star', active: file.starred, onClick: () => toggleStar(file.id) },
              { icon: Trash, label: 'Delete', color: 'var(--semantic-error)', onClick: () => { removeFile(file.id); navigate(-1); } },
            ].map((action, i) => (
              <div 
                key={i} 
                onClick={action.onClick}
                style={{ 
                  height: 36, borderRadius: 18, border: '1px solid var(--border-default)', backgroundColor: action.active ? 'var(--primary-100)' : 'var(--surface-card)', 
                  display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, whiteSpace: 'nowrap', cursor: 'pointer'
                }}
              >
                <action.icon size={18} color={action.color || (action.active ? 'var(--primary-500)' : 'var(--text-secondary)')} weight={action.active ? 'fill' : 'regular'} />
                <span className="label-sm" style={{ color: action.active ? 'var(--primary-500)' : 'var(--text-secondary)' }}>{action.label}</span>
              </div>
            ))}
          </div>

          {/* Details Section */}
          <div style={{ backgroundColor: 'var(--surface-card)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-level-1)' }}>
            {[
              { label: 'File Size', value: file.size },
              { label: 'Pages', value: file.pages },
              { label: 'Created', value: file.createdAt.toLocaleString() },
              { label: 'Format', value: 'PDF 1.7' },
              { label: 'Owner', value: profile?.full_name || 'User' },
            ].map((row, i) => (
              <div key={i} style={{ height: 56, display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: i === 4 ? 'none' : '1px solid #F7F8FC' }}>
                <span className="body-md" style={{ color: 'var(--text-muted)', flex: 1 }}>{row.label}</span>
                <span className="body-md" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{row.value}</span>
              </div>
            ))}
          </div>

          <div className="title-md" style={{ marginTop: 24, marginBottom: 16 }}>Quick Actions</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
             <div onClick={() => navigate('/tools/split')} style={{ backgroundColor: 'var(--surface-card)', borderRadius: 12, padding: 16, boxShadow: 'var(--shadow-level-1)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Scissors size={20} color="var(--primary-500)" weight="fill" />
                </div>
                <span className="label-lg">Split PDF</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetails;
