import React from 'react';
import { motion } from 'framer-motion';

export const ListSkeleton: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{ height: 72, backgroundColor: 'var(--surface-card)', borderRadius: 16, display: 'flex', alignItems: 'center', padding: 12 }}>
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 48, height: 56, borderRadius: 8, backgroundColor: 'var(--border-default)' }} 
          />
          <div style={{ flex: 1, paddingLeft: 12 }}>
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              style={{ height: 16, width: '70%', backgroundColor: 'var(--border-default)', borderRadius: 4, marginBottom: 8 }} 
            />
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              style={{ height: 12, width: '40%', backgroundColor: 'var(--border-default)', borderRadius: 4 }} 
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export const GridSkeleton: React.FC = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ height: 200, backgroundColor: 'var(--surface-card)', borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <motion.div 
            animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
            style={{ flex: 1, backgroundColor: 'var(--border-default)' }} 
          />
          <div style={{ padding: 12, height: 80 }}>
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              style={{ height: 16, width: '80%', backgroundColor: 'var(--border-default)', borderRadius: 4, marginBottom: 8 }} 
            />
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              style={{ height: 12, width: '50%', backgroundColor: 'var(--border-default)', borderRadius: 4 }} 
            />
          </div>
        </div>
      ))}
    </div>
  );
};
