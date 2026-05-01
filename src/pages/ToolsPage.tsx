import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, GitMerge, Scissors, Archive, ArrowsLeftRight, LockKey, LockKeyOpen, CheckSquareOffset, Signature, TextT } from '@phosphor-icons/react';

const ToolsPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const tools = [
    { label: 'Merge PDFs', subLabel: 'Combine files', icon: GitMerge, gradient: 'linear-gradient(to bottom right, #E53935, #FF6B35)', path: '/tools/merge' },
    { label: 'Split PDF', subLabel: 'Extract pages', icon: Scissors, gradient: 'linear-gradient(to bottom right, #3182CE, #63B3ED)', path: '/tools/split' },
    { label: 'Compress', subLabel: 'Reduce file size', icon: Archive, gradient: 'linear-gradient(to bottom right, #38A169, #68D391)', path: '/tools/compress' },
    { label: 'Reorder Pages', subLabel: 'Drag to sort', icon: ArrowsLeftRight, gradient: 'linear-gradient(to bottom right, #D69E2E, #F6E05E)', path: '/tools/reorder' },
    { label: 'Protect PDF', subLabel: 'Add password', icon: LockKey, gradient: 'linear-gradient(to bottom right, #1A1A2E, #2D3748)', path: '/tools/protect' },
    { label: 'Unlock PDF', subLabel: 'Remove password', icon: LockKeyOpen, gradient: 'linear-gradient(to bottom right, #744210, #C05621)' },
    { label: 'OCR Scanner', subLabel: 'Extract text', icon: CheckSquareOffset, gradient: 'linear-gradient(to bottom right, #1A1A2E, #E53935)', path: '/tools/ocr' },
    { label: 'Watermark', subLabel: 'Add text overlay', icon: TextT, gradient: 'linear-gradient(to bottom right, #4A5568, #718096)', path: '/tools/watermark' },
    { label: 'Sign PDF', subLabel: 'Draw or type', icon: Signature, gradient: 'linear-gradient(to bottom right, #1C4532, #276749)', path: '/tools/sign' },
  ];

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* App Bar */}
      <div style={{ height: 64, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 20px', backgroundColor: 'var(--surface-card)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div className="heading-h2" style={{ color: 'var(--text-primary)' }}>PDF Tools</div>
        <div className="caption" style={{ color: 'var(--text-muted)' }}>Professional operations</div>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '12px 20px' }}>
        <div style={{ height: 40, borderRadius: 20, backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
          <MagnifyingGlass size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', paddingLeft: 8, fontFamily: 'Inter', fontSize: 14, color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '0 20px 16px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {['All', 'Edit', 'Convert', 'Organise', 'Security', 'Extract'].map((cat, i) => (
          <div key={i} style={{ height: 32, borderRadius: 20, padding: '0 16px', display: 'flex', alignItems: 'center', backgroundColor: i === 0 ? 'var(--primary-100)' : 'var(--surface-card)', border: `1px solid ${i === 0 ? 'var(--primary-500)' : 'var(--border-default)'}`, color: i === 0 ? 'var(--primary-500)' : 'var(--text-secondary)', fontFamily: 'Inter', fontWeight: 500, fontSize: 13, flexShrink: 0, cursor: 'pointer' }}>
            {cat}
          </div>
        ))}
      </div>

      {/* Tools Grid */}
      <div style={{ padding: '0 20px' }}>
        <div className="title-md" style={{ color: 'var(--text-primary)', marginBottom: 16 }}>All Capabilities</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {tools.filter(t => t.label.toLowerCase().includes(search.toLowerCase())).map((tool, i) => (
            <div 
              key={i} 
              onClick={() => tool.path && navigate(tool.path)}
              style={{ backgroundColor: 'var(--surface-card)', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-level-1)', position: 'relative', cursor: 'pointer', aspectRatio: '1/1' }}
            >
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: tool.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <tool.icon size={36} color="#FFFFFF" weight="fill" />
              </div>
              <div className="label-lg" style={{ color: 'var(--text-primary)', textAlign: 'center' }}>{tool.label}</div>
              <div className="caption" style={{ color: 'var(--text-muted)', textAlign: 'center' }}>{tool.subLabel}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
