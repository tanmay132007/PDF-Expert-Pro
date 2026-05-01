import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlass, X, FilePdf, CaretRight, ClockCounterClockwise } from '@phosphor-icons/react';
import { useFiles } from '../lib/FileContext';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { files } = useFiles();
  const navigate = useNavigate();

  const results = query 
    ? files.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--surface-bg)',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Search Header */}
          <div style={{ height: 80, display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid var(--border-default)', gap: 16 }}>
            <div style={{ flex: 1, height: 48, backgroundColor: 'var(--surface-card)', borderRadius: 24, border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
              <MagnifyingGlass size={20} color="var(--text-muted)" />
              <input 
                autoFocus
                type="text" 
                placeholder="Search files, tools, or content..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', paddingLeft: 12, fontFamily: 'Inter', fontSize: 16, color: 'var(--text-primary)' }}
              />
              {query && <X size={18} onClick={() => setQuery('')} style={{ cursor: 'pointer' }} />}
            </div>
            <button onClick={onClose} style={{ border: 'none', background: 'none', color: 'var(--primary-500)', fontWeight: 600, fontSize: 15, fontFamily: 'Inter' }}>Cancel</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {query === '' ? (
              <div>
                <div className="label-sm" style={{ color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Recent Searches</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[ 'Contract_2025.pdf', 'Merge Tool', 'Signed Document' ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-secondary)' }}>
                      <ClockCounterClockwise size={18} />
                      <span className="body-md">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : results.length > 0 ? (
              <div>
                <div className="label-sm" style={{ color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>File Results ({results.length})</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {results.map(file => (
                    <div 
                      key={file.id} 
                      onClick={() => { navigate(`/files/${file.id}`); onClose(); }}
                      style={{ height: 72, backgroundColor: 'var(--surface-card)', borderRadius: 16, border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', padding: 12, cursor: 'pointer' }}
                    >
                      <div style={{ width: 40, height: 48, borderRadius: 6, background: 'linear-gradient(to bottom right, #E53935, #FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FilePdf size={20} color="#FFF" weight="fill" />
                      </div>
                      <div style={{ flex: 1, marginLeft: 12, overflow: 'hidden' }}>
                        <div className="title-md" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                        <div className="caption" style={{ color: 'var(--text-muted)' }}>{file.size} · {file.pages} pages</div>
                      </div>
                      <CaretRight size={18} color="var(--text-muted)" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', marginTop: 80 }}>
                <MagnifyingGlass size={64} color="var(--text-disabled)" style={{ marginBottom: 16 }} />
                <div className="heading-h2">No results found</div>
                <div className="body-md" style={{ color: 'var(--text-muted)', marginTop: 8 }}>Try searching for a different keyword or file name.</div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalSearch;
