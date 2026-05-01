import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { MagnifyingGlass, List, SquaresFour, Star, Trash, FilePdf, DotsThreeVertical, Plus, CheckCircle } from '@phosphor-icons/react';
import { useFiles } from '../lib/FileContext';
import { ListSkeleton, GridSkeleton } from '../components/Skeletons';

const FilesPage: React.FC = () => {
  const navigate = useNavigate();
  const { files, loading, addFile, toggleStar, removeFile } = useFiles();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(() => {
    return (localStorage.getItem('defaultView') as 'list' | 'grid') || 'list';
  });
  const [activeSegment, setActiveSegment] = useState<'all' | 'starred' | 'trash'>('all');
  
  // Selection mode state
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => addFile(file));
  }, [addFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'application/pdf': ['.pdf'] },
    noClick: files.length > 0 
  });

  const filteredFiles = files.filter(f => {
    if (activeSegment === 'starred') return f.starred;
    if (activeSegment === 'trash') return false; 
    return true;
  });

  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const enterSelectionMode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelectionMode(true);
    setSelectedIds(new Set([id]));
  };

  const handleBulkDelete = async () => {
    for (const id of Array.from(selectedIds)) {
      await removeFile(id);
    }
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };

  const handleBulkStar = async () => {
    for (const id of Array.from(selectedIds)) {
      await toggleStar(id);
    }
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };

  return (
    <div style={{ paddingBottom: 40, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* App Bar */}
      <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 20px', backgroundColor: 'var(--surface-card)', position: 'sticky', top: 0, zIndex: 10 }}>
        {isSelectionMode ? (
          <>
            <span onClick={() => setIsSelectionMode(false)} style={{ color: 'var(--primary-500)', fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter' }}>Cancel</span>
            <div className="heading-h2" style={{ color: 'var(--text-primary)', flex: 1, textAlign: 'center' }}>{selectedIds.size} Selected</div>
            <span onClick={() => setSelectedIds(new Set(filteredFiles.map(f => f.id)))} style={{ color: 'var(--primary-500)', fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter' }}>Select All</span>
          </>
        ) : (
          <>
            <div className="heading-h2" style={{ color: 'var(--text-primary)', flex: 1 }}>My Files</div>
            <div style={{ display: 'flex', gap: 16 }}>
              <MagnifyingGlass size={24} color="var(--text-primary)" />
              <div onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')} style={{ cursor: 'pointer' }}>
                {viewMode === 'list' ? <SquaresFour size={24} color="var(--text-primary)" /> : <List size={24} color="var(--text-primary)" />}
              </div>
            </div>
          </>
        )}
      </div>

      <div {...getRootProps()} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', position: 'relative' }}>
        <input {...getInputProps()} />
        
        {isDragActive && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(229,57,53,0.1)', border: '2px dashed var(--primary-500)', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 16, margin: 20 }}>
            <div className="heading-h2" style={{ color: 'var(--primary-500)' }}>Drop PDF here</div>
          </div>
        )}

        {/* Segmented Control */}
        {!isSelectionMode && (
          <div style={{ padding: '8px 20px 20px' }}>
            <div style={{ height: 40, borderRadius: 20, backgroundColor: '#F7F8FC', border: '1px solid var(--border-default)', display: 'flex', padding: 2 }}>
              {['all', 'starred', 'trash'].map((seg) => (
                <div
                  key={seg}
                  onClick={() => setActiveSegment(seg as any)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 18,
                    backgroundColor: activeSegment === seg ? 'var(--primary-500)' : 'transparent',
                    color: activeSegment === seg ? '#FFF' : 'var(--text-secondary)',
                    fontFamily: 'Inter',
                    fontWeight: 500,
                    fontSize: 13,
                    textTransform: 'capitalize',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {seg === 'starred' ? 'Starred ★' : seg === 'trash' ? 'Trash 🗑' : 'All'}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div style={{ padding: '0 20px' }}>
          {loading ? (
             viewMode === 'list' ? <ListSkeleton /> : <GridSkeleton />
          ) : filteredFiles.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 80, textAlign: 'center' }}>
              <div style={{ width: 120, height: 120, borderRadius: '50%', backgroundColor: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                {activeSegment === 'all' ? <FilePdf size={64} color="var(--primary-500)" /> : <Trash size={64} color="var(--primary-500)" />}
              </div>
              <div className="heading-h2" style={{ color: 'var(--text-primary)' }}>
                {activeSegment === 'all' ? 'Your workspace is empty' : activeSegment === 'starred' ? 'No favourites yet' : 'Trash is clear'}
              </div>
              <div className="body-md" style={{ color: 'var(--text-muted)', marginTop: 8 }}>
                 {activeSegment === 'all' ? 'Upload your first PDF to get started' : activeSegment === 'starred' ? 'Long-press any file and tap ☆ to save it here' : 'Files you delete will appear here for 30 days'}
              </div>
            </div>
          ) : (
            viewMode === 'list' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filteredFiles.map(file => {
                  const isSelected = selectedIds.has(file.id);
                  return (
                    <div 
                      key={file.id} 
                      onClick={(e) => isSelectionMode ? toggleSelection(file.id, e) : navigate(`/files/${file.id}`)} 
                      onContextMenu={(e) => { e.preventDefault(); enterSelectionMode(file.id, e); }}
                      style={{ 
                        height: 72, backgroundColor: isSelected ? 'var(--primary-100)' : 'var(--surface-card)', 
                        borderRadius: 16, boxShadow: 'var(--shadow-level-1)', display: 'flex', alignItems: 'center', 
                        padding: 12, position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s',
                        border: isSelected ? '2px solid var(--primary-500)' : '2px solid transparent'
                      }}
                    >
                      {isSelectionMode ? (
                        <div style={{ marginRight: 12 }}>
                          <CheckCircle size={24} weight={isSelected ? "fill" : "regular"} color={isSelected ? "var(--primary-500)" : "var(--text-disabled)"} />
                        </div>
                      ) : null}
                      <div style={{ width: 48, height: 56, borderRadius: 8, background: 'linear-gradient(to bottom right, #E53935, #FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <FilePdf size={24} color="#FFF" weight="fill" />
                        {file.starred && !isSelectionMode && <Star size={12} weight="fill" color="#FFD700" style={{ position: 'absolute', top: 2, right: 2 }} />}
                      </div>
                      <div style={{ flex: 1, paddingLeft: 12, overflow: 'hidden' }}>
                        <div className="title-md" style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                        <div className="caption" style={{ color: 'var(--text-muted)', marginTop: 4 }}>{file.size} · {file.pages} pages</div>
                      </div>
                      {!isSelectionMode && (
                        <div onClick={(e) => { e.stopPropagation(); toggleStar(file.id); }} style={{ cursor: 'pointer', padding: 8 }}>
                           <Star size={20} weight={file.starred ? 'fill' : 'regular'} color={file.starred ? '#FFD700' : 'var(--text-muted)'} />
                        </div>
                      )}
                      {!isSelectionMode && <DotsThreeVertical size={20} color="var(--text-muted)" />}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {filteredFiles.map(file => {
                  const isSelected = selectedIds.has(file.id);
                  return (
                    <div 
                      key={file.id} 
                      onClick={(e) => isSelectionMode ? toggleSelection(file.id, e) : navigate(`/files/${file.id}`)} 
                      onContextMenu={(e) => { e.preventDefault(); enterSelectionMode(file.id, e); }}
                      style={{ 
                        height: 200, backgroundColor: isSelected ? 'var(--primary-100)' : 'var(--surface-card)', 
                        borderRadius: 16, boxShadow: 'var(--shadow-level-1)', display: 'flex', flexDirection: 'column', 
                        overflow: 'hidden', cursor: 'pointer', transition: 'background-color 0.2s',
                        border: isSelected ? '2px solid var(--primary-500)' : '2px solid transparent'
                      }}
                    >
                      <div style={{ flex: 1, background: 'linear-gradient(to bottom right, #FFEBEE, #FFFFFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        {isSelectionMode && (
                          <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 5 }}>
                            <CheckCircle size={24} weight={isSelected ? "fill" : "regular"} color={isSelected ? "var(--primary-500)" : "var(--text-disabled)"} />
                          </div>
                        )}
                        <FilePdf size={48} color="var(--primary-500)" weight="fill" />
                        {!isSelectionMode && (
                          <div onClick={(e) => { e.stopPropagation(); toggleStar(file.id); }} style={{ position: 'absolute', top: 8, right: 8, cursor: 'pointer', zIndex: 5 }}>
                            <Star size={20} weight={file.starred ? 'fill' : 'regular'} color={file.starred ? '#FFD700' : 'var(--text-muted)'} />
                          </div>
                        )}
                      </div>
                      <div style={{ padding: 12, height: 80, backgroundColor: isSelected ? 'transparent' : 'var(--surface-card)' }}>
                        <div className="title-md" style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                        <div className="caption" style={{ color: 'var(--text-muted)', marginTop: 4 }}>{file.size} · {file.pages} pages</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>
      
      {/* FAB / Selection Toolbar */}
      {isSelectionMode ? (
        <div style={{ position: 'fixed', bottom: 80, left: 0, right: 0, padding: 20, zIndex: 100 }}>
          <div style={{ backgroundColor: 'var(--secondary-500)', borderRadius: 16, display: 'flex', padding: '12px 24px', justifyContent: 'space-between', boxShadow: 'var(--shadow-level-3)' }}>
             <div onClick={handleBulkDelete} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--semantic-error)', cursor: 'pointer' }}>
                <Trash size={24} weight="fill" />
                <span style={{ fontSize: 11, marginTop: 4, fontFamily: 'Inter' }}>Delete</span>
             </div>
             <div onClick={handleBulkStar} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#FFD700', cursor: 'pointer' }}>
                <Star size={24} weight="fill" />
                <span style={{ fontSize: 11, marginTop: 4, fontFamily: 'Inter' }}>Star</span>
             </div>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
          style={{ position: 'fixed', bottom: 96, right: 16, width: 56, height: 56, borderRadius: '50%', backgroundColor: 'var(--primary-500)', boxShadow: 'var(--shadow-level-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', zIndex: 100 }}
        >
          <Plus size={24} weight="bold" />
        </div>
      )}
    </div>
  );
};

export default FilesPage;
