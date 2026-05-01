import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, Bell, UploadSimple, GitMerge, Archive, Scissors, DotsThreeVertical } from '@phosphor-icons/react';
import Logo from '../components/Logo';
import { useFiles } from '../lib/FileContext';
import { useAuth } from '../lib/AuthContext';
import GlobalSearch from '../components/GlobalSearch';
import ContentModal from '../components/ContentModal';

const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const { files } = useFiles();
  const { profile, getInitials } = useAuth();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const storageUsed = profile?.storage_used_mb || 0;
  const storageLimit = profile?.storage_limit_mb || 100;
  const percent = Math.round((storageUsed / storageLimit) * 100);

  return (
    <div style={{ paddingBottom: '96px', position: 'relative' }}>
      
      {/* Search Overlay */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Notifications Modal */}
      <ContentModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} title="Notifications">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
           <div style={{ padding: 16, borderRadius: 12, backgroundColor: 'var(--primary-100)', border: '1px solid var(--primary-500)' }}>
              <div className="title-md" style={{ color: 'var(--primary-500)' }}>Welcome to God Tier!</div>
              <div className="body-md" style={{ marginTop: 4 }}>You have successfully upgraded your application to the S-Tier masterpiece version. Enjoy advanced drawing and real-time search.</div>
              <div className="caption" style={{ marginTop: 8, color: 'var(--text-muted)' }}>Just now</div>
           </div>
           <div style={{ padding: 16, borderRadius: 12, backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)' }}>
              <div className="title-md">Storage Alert</div>
              <div className="body-md" style={{ marginTop: 4 }}>You are using {percent}% of your free storage. Consider upgrading to Pro for unlimited cloud space.</div>
              <div className="caption" style={{ marginTop: 8, color: 'var(--text-muted)' }}>2 hours ago</div>
           </div>
        </div>
      </ContentModal>

      {/* App Bar */}
      <div style={{ height: '64px', display: 'flex', alignItems: 'center', padding: '0 20px', backgroundColor: 'var(--surface-card)', position: 'sticky', top: 0, zIndex: 10 }}>
        <Logo size={32} />
        <span style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 18, color: 'var(--text-primary)', marginLeft: 8 }}>PDF Expert</span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <MagnifyingGlass size={24} color="var(--text-primary)" onClick={() => setIsSearchOpen(true)} style={{ cursor: 'pointer' }} />
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setIsNotifOpen(true)}>
            <Bell size={24} color="var(--text-primary)" />
            <div style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--primary-500)' }} />
          </div>
          <div onClick={() => navigate('/dashboard/settings')} style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'var(--accent-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            {getInitials()}
          </div>
        </div>
      </div>

      {/* Storage Meter */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ backgroundColor: '#1A1A2E', borderRadius: 20, padding: 20, display: 'flex', boxShadow: 'var(--shadow-level-2)' }}>
          <div style={{ flex: 1 }}>
            <div className="label-sm" style={{ color: '#718096', textTransform: 'uppercase', letterSpacing: 1 }}>Storage</div>
            <div className="heading-h2" style={{ color: '#FFFFFF', marginTop: 4 }}>{storageUsed.toFixed(1)} MB used</div>
            <div className="caption" style={{ color: '#CBD5E0', marginTop: 4 }}>of {storageLimit} MB {profile?.plan_type || 'free'} plan</div>
            <div style={{ color: '#FF6B35', fontSize: 13, marginTop: 12, fontWeight: 500, cursor: 'pointer' }} onClick={() => navigate('/dashboard/settings')}>Upgrade to Pro →</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', border: '8px solid rgba(255,255,255,0.15)', borderTopColor: '#FF6B35', borderRightColor: '#E53935', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${percent * 3.6 - 90}deg)`, transition: 'transform 1s ease' }}>
              <div style={{ transform: `rotate(${- (percent * 3.6 - 90)}deg)`, fontFamily: 'Sora', fontWeight: 700, fontSize: 18, color: '#FFFFFF' }}>{percent}%</div>
            </div>
            <div className="caption" style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#CBD5E0', padding: '6px 12px', borderRadius: 20, marginTop: -10, zIndex: 1, textTransform: 'capitalize' }}>{profile?.plan_type || 'Free'}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: 12 }}>
          <span className="title-lg" style={{ color: 'var(--text-primary)' }}>Quick Actions</span>
          <span className="label-sm" style={{ color: 'var(--primary-500)' }} onClick={() => navigate('/dashboard/tools')}>See All</span>
        </div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '4px 20px 12px' }}>
          {[
            { icon: UploadSimple, label: 'Upload', gradient: 'linear-gradient(to bottom right, #E53935, #FF6B35)', path: '/dashboard/files' },
            { icon: GitMerge, label: 'Merge', gradient: 'linear-gradient(to bottom right, #3182CE, #63B3ED)', path: '/tools/merge' },
            { icon: Archive, label: 'Compress', gradient: 'linear-gradient(to bottom right, #38A169, #68D391)', path: '/tools/compress' },
            { icon: Scissors, label: 'Split', gradient: 'linear-gradient(to bottom right, #D69E2E, #F6E05E)', path: '/tools/split' },
          ].map((action, i) => (
            <div 
              key={i} 
              onClick={() => action.path && navigate(action.path)}
              style={{ width: 100, height: 112, backgroundColor: 'var(--surface-card)', borderRadius: 16, boxShadow: 'var(--shadow-level-1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}
            >
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: action.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                <action.icon size={26} color="#FFFFFF" weight="fill" />
              </div>
              <span className="label-lg" style={{ color: 'var(--text-primary)' }}>{action.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Files */}
      <div style={{ marginTop: 24, padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span className="title-lg" style={{ color: 'var(--text-primary)' }}>Recent Files</span>
          <span className="label-sm" style={{ color: 'var(--primary-500)' }} onClick={() => navigate('/dashboard/files')}>All Files →</span>
        </div>
        {files.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="body-md" style={{ color: 'var(--text-muted)' }}>No recent files yet.</div>
          </div>
        ) : (
          files.slice(0, 3).map((file, i) => (
            <div key={i} onClick={() => navigate(`/files/${file.id}`)} style={{ height: 72, backgroundColor: 'var(--surface-card)', borderRadius: 16, boxShadow: 'var(--shadow-level-1)', display: 'flex', alignItems: 'center', padding: 12, marginBottom: 8, cursor: 'pointer' }}>
              <div style={{ width: 48, height: 56, borderRadius: 8, background: 'linear-gradient(to bottom right, #E53935, #FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="label-sm" style={{ color: '#fff' }}>PDF</span>
              </div>
              <div style={{ flex: 1, paddingLeft: 12, overflow: 'hidden' }}>
                <div className="title-md" style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                <div className="caption" style={{ color: 'var(--text-muted)', marginTop: 4 }}>{file.size} · {file.pages} pages</div>
              </div>
              <DotsThreeVertical size={20} color="var(--text-muted)" />
            </div>
          ))
        )}
      </div>

      {/* FAB */}
      <div 
        onClick={() => navigate('/dashboard/files')}
        style={{ position: 'fixed', bottom: 96, right: 16, backgroundColor: 'var(--primary-500)', borderRadius: 16, boxShadow: 'var(--shadow-level-3)', display: 'flex', alignItems: 'center', padding: '16px 20px', color: '#fff', cursor: 'pointer', zIndex: 100 }}
      >
        <UploadSimple size={20} weight="bold" />
        <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 15, marginLeft: 8 }}>Upload PDF</span>
      </div>

    </div>
  );
};

export default DashboardHome;
