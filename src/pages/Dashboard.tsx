import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { House, Files, SquaresFour, ClockCounterClockwise, Gear, CloudArrowUp } from '@phosphor-icons/react';
import DashboardHome from './DashboardHome';
import ToolsPage from './ToolsPage';
import FilesPage from './FilesPage';
import HistoryPage from './HistoryPage';
import SettingsPage from './SettingsPage';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'home', icon: House, label: 'Home', path: '/dashboard' },
    { id: 'files', icon: Files, label: 'Files', path: '/dashboard/files' },
    { id: 'tools', icon: SquaresFour, label: 'Tools', path: '/dashboard/tools' },
    { id: 'history', icon: ClockCounterClockwise, label: 'History', path: '/dashboard/history' },
    { id: 'settings', icon: Gear, label: 'Settings', path: '/dashboard/settings' },
  ];

  const isAutoBackupOn = true; // In real app, read from global state or context

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--surface-bg)' }}>
      
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/files" element={<FilesPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>

      {/* Global Sync Indicator */}
      {isAutoBackupOn && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          style={{ position: 'fixed', bottom: 84, left: 16, display: 'flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: 20, boxShadow: 'var(--shadow-level-1)', zIndex: 50 }}
        >
          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <CloudArrowUp size={14} color="var(--primary-500)" weight="fill" />
          </motion.div>
          <span className="caption" style={{ color: 'var(--text-muted)', fontSize: 10 }}>Syncing to Cloud...</span>
        </motion.div>
      )}

      {/* Bottom Navigation */}
      <div style={{
        height: '80px',
        backgroundColor: 'var(--surface-nav)',
        boxShadow: 'var(--shadow-level-1)',
        display: 'flex',
        paddingBottom: '34px', // Safe area
        position: 'relative'
      }}>
        {tabs.map(tab => {
          const isActive = location.pathname === tab.path || (tab.id === 'home' && location.pathname === '/dashboard');
          const Icon = tab.icon;
          return (
            <div
              key={tab.id}
              onClick={() => navigate(tab.path)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isActive ? 'var(--primary-500)' : 'var(--text-muted)',
                position: 'relative',
                paddingTop: '8px'
              }}
            >
              {isActive && (
                <div style={{ position: 'absolute', top: 0, width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--primary-500)' }} />
              )}
              <Icon size={24} weight={isActive ? 'fill' : 'regular'} />
              <span style={{ fontSize: 10, fontWeight: 500, fontFamily: 'Inter', marginTop: 4 }}>{tab.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
