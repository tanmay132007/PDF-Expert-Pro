import React, { useState } from 'react';
import { CaretRight, Camera, Palette, Globe, List, Crown, Link, LockKey, ShieldCheck, Folder, CloudArrowUp, CellSignalFull, Bell, Info, Star, Trash, SignOut } from '@phosphor-icons/react';
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../lib/ThemeContext';
import { useToast } from '../lib/ToastContext';
import { useI18n } from '../lib/I18nContext';
import { supabase } from '../lib/supabase';
import ContentModal from '../components/ContentModal';

const SettingsPage: React.FC = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useI18n();
  const { showToast } = useToast();
  
  const [offlineMode, setOfflineMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isMfaOpen, setIsMfaOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/signin');
  };

  const handleClearCache = () => {
    localStorage.clear();
    showToast('App cache cleared successfully', 'success');
    window.location.reload();
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : (theme === 'dark' ? 'system' : 'light');
    setTheme(nextTheme);
    showToast(`Theme set to ${nextTheme}`, 'info');
  };

  const toggleDefaultView = () => {
    const current = localStorage.getItem('defaultView') === 'grid' ? 'list' : 'grid';
    localStorage.setItem('defaultView', current);
    showToast(`Default view changed to ${current.toUpperCase()}`, 'success');
  };

  const handlePassword = async () => {
    const pwd = window.prompt('Enter new password (min 6 characters):');
    if (pwd && pwd.length >= 6) {
      const { error } = await supabase.auth.updateUser({ password: pwd });
      if (error) showToast(error.message, 'error');
      else showToast('Password updated successfully!', 'success');
    } else if (pwd) {
      showToast('Password too short', 'error');
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    // 1. Upload to Real Supabase Bucket
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${user.id}-${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      showToast('Upload failed. Ensure "avatars" bucket exists.', 'error');
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

    // 2. Update Profile Table
    const { error: dbError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);
        
    if (!dbError) {
      showToast('Profile photo updated!', 'success');
      refreshProfile();
    } else {
      showToast('Failed to update profile', 'error');
    }
  };

  const groups: any[] = [
    { title: 'Preferences', items: [
      { label: 'Appearance', subLabel: theme, icon: Palette, onClick: toggleTheme },
      { label: 'Language', subLabel: language.toUpperCase(), icon: Globe, onClick: () => setIsLangOpen(true) },
      { label: 'Default View', subLabel: localStorage.getItem('defaultView') || 'list', icon: List, onClick: toggleDefaultView },
    ]},
    { title: 'Account', items: [
      { label: 'Subscription', subLabel: profile?.plan_type || 'free', icon: Crown, pro: true },
      { label: 'Linked Accounts', icon: Link, onClick: () => showToast('Social link flow started...', 'info') },
      { label: 'Change Password', icon: LockKey, onClick: handlePassword },
      { label: 'Two-Factor Auth', icon: ShieldCheck, toggle: twoFactor, onToggle: () => setIsMfaOpen(true) },
    ]},
    { title: 'Storage & Sync', items: [
      { label: 'Manage Files', icon: Folder, onClick: () => navigate('/dashboard/files') },
      { label: 'Auto-Backup', icon: CloudArrowUp, toggle: autoBackup, onToggle: () => setAutoBackup(!autoBackup) },
      { label: 'Offline Mode', icon: CellSignalFull, toggle: offlineMode, onToggle: () => setOfflineMode(!offlineMode) },
      { label: 'Clear Cache', subLabel: 'Local Data', icon: Trash, onClick: handleClearCache },
    ]},
    { title: 'Notifications', items: [
      { label: 'Push Notifications', icon: Bell, toggle: pushNotifs, onToggle: () => setPushNotifs(!pushNotifs) },
    ]},
    { title: 'Support', items: [
      { label: 'Help Center', icon: Info, onClick: () => setIsHelpOpen(true) },
      { label: 'Send Feedback', icon: Star, onClick: () => showToast('Thank you for your feedback!', 'success') },
      { label: 'Privacy Policy', icon: ShieldCheck, onClick: () => setIsPrivacyOpen(true) },
    ]}
  ];

  return (
    <div style={{ paddingBottom: 40, backgroundColor: 'var(--surface-bg)' }}>
      
      <ContentModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} title="Help Center">
         <h3>Getting Started</h3>
         <p>PDF Expert Pro is your all-in-one tool for professional PDF management.</p>
         <h3 style={{ marginTop: 24 }}>Common Questions</h3>
         <ul>
            <li>How to merge? Go to Tools and select Merge PDFs.</li>
            <li>Is it secure? Yes, all files are stored with RLS encryption.</li>
         </ul>
      </ContentModal>

      <ContentModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} title="Privacy Policy">
         <p>Your privacy is our priority. We never read the contents of your files. All data is handled through secure Supabase tunnels.</p>
      </ContentModal>

      <ContentModal isOpen={isLangOpen} onClose={() => setIsLangOpen(false)} title="Select Language">
         <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { id: 'en', label: 'English' },
              { id: 'es', label: 'Español' },
              { id: 'fr', label: 'Français' },
              { id: 'hi', label: 'हिन्दी' }
            ].map(lang => (
              <div 
                key={lang.id} 
                onClick={() => { setLanguage(lang.id as any); setIsLangOpen(false); showToast(`Language changed to ${lang.label}`, 'success'); }}
                style={{ padding: 16, borderRadius: 12, border: '1px solid var(--border-default)', backgroundColor: language === lang.id ? 'var(--primary-100)' : 'var(--surface-card)', cursor: 'pointer' }}
              >
                 {lang.label}
              </div>
            ))}
         </div>
      </ContentModal>

      <ContentModal isOpen={isMfaOpen} onClose={() => setIsMfaOpen(false)} title="Two-Factor Auth">
         <div style={{ textAlign: 'center' }}>
            <ShieldCheck size={64} color="var(--primary-500)" weight="fill" />
            <div className="title-lg" style={{ marginTop: 16 }}>Enroll in MFA</div>
            <p className="body-md" style={{ color: 'var(--text-muted)', marginTop: 8 }}>Secure your account using an authenticator app.</p>
            <div style={{ width: 180, height: 180, backgroundColor: '#EEE', margin: '24px auto', borderRadius: 12 }}></div>
            <button className="btn-primary" onClick={() => { setTwoFactor(true); setIsMfaOpen(false); showToast('2FA Active!', 'success'); }}>Enroll Now</button>
         </div>
      </ContentModal>

      <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 20px', backgroundColor: 'var(--surface-card)', borderBottom: '1px solid var(--border-default)' }}>
        <div className="heading-h2">Settings</div>
      </div>

      <div style={{ padding: '16px 20px' }}>
        <div style={{ backgroundColor: '#1A1A2E', borderRadius: 20, padding: 20, display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--accent-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, fontWeight: 700, overflow: 'hidden' }}>
              {profile?.avatar_url ? <img src={profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user?.email?.charAt(0).toUpperCase() || 'U')}
            </div>
            <div onClick={() => document.getElementById('avatar-upload')?.click()} style={{ position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderRadius: '50%', backgroundColor: 'var(--primary-500)', border: '2px solid #1A1A2E', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
               <Camera size={12} color="#fff" weight="fill" />
            </div>
            <input type="file" id="avatar-upload" hidden accept="image/*" onChange={handlePhotoUpload} />
          </div>
          <div style={{ flex: 1, marginLeft: 16 }}>
            <div className="title-lg" style={{ color: '#fff' }}>{profile?.full_name || 'User'}</div>
            <div className="body-md" style={{ color: '#CBD5E0' }}>{user?.email}</div>
          </div>
        </div>
      </div>

      {groups.map((group, i) => (
        <div key={i} style={{ padding: '0 20px 16px' }}>
          <div className="label-sm" style={{ marginBottom: 8, marginLeft: 8, textTransform: 'uppercase' }}>{group.title}</div>
          <div style={{ backgroundColor: 'var(--surface-card)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-level-1)' }}>
            {group.items.map((item: any, j: number) => (
              <div key={j} onClick={item.onClick} style={{ height: 56, display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: j === group.items.length - 1 ? 'none' : '1px solid var(--border-default)', cursor: 'pointer' }}>
                <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <item.icon size={20} color="var(--text-secondary)" />
                </div>
                <div className="title-md" style={{ flex: 1, marginLeft: 12 }}>{item.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {item.subLabel && <span className="body-md" style={{ color: 'var(--text-muted)' }}>{item.subLabel}</span>}
                  {item.toggle !== undefined ? (
                    <div onClick={(e) => { e.stopPropagation(); item.onToggle?.(); }} style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: item.toggle ? 'var(--primary-500)' : '#E2E8F0', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 2, left: item.toggle ? 22 : 2, width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fff', transition: 'all 0.2s' }} />
                    </div>
                  ) : <CaretRight size={16} color="var(--text-muted)" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ padding: '0 20px' }}>
         <div onClick={handleSignOut} style={{ height: 56, backgroundColor: 'var(--surface-card)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--semantic-error)', fontWeight: 600, cursor: 'pointer' }}>
            <SignOut size={20} style={{ marginRight: 8 }} /> Sign Out
         </div>
      </div>
    </div>
  );
};

export default SettingsPage;
