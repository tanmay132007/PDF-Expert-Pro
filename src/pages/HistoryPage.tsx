import React, { useEffect, useState } from 'react';
import { Funnel, UploadSimple, GitMerge, Trash, Eye, FilePdf, Scissors, LockKey } from '@phosphor-icons/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { ListSkeleton } from '../components/Skeletons';

const HistoryPage: React.FC = () => {
  const [historyGroups, setHistoryGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const getIcon = (type: string) => {
    switch (type) {
      case 'upload': return { icon: UploadSimple, color: '#38A169', bg: '#E8F5E9' };
      case 'merge': return { icon: GitMerge, color: 'var(--primary-500)', bg: 'var(--primary-100)' };
      case 'split': return { icon: Scissors, color: '#3182CE', bg: '#E3F2FD' };
      case 'protect': return { icon: LockKey, color: '#805AD5', bg: '#F3E8FF' };
      case 'delete': return { icon: Trash, color: '#E53E3E', bg: '#FFF5F5' };
      default: return { icon: Eye, color: 'var(--text-muted)', bg: 'var(--surface-bg)' };
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*, files(name, size_bytes)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching history:', error);
    } else {
      const groups: any = {};
      data.forEach(item => {
        const date = new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        const label = date === today ? 'Today' : date;
        
        if (!groups[label]) groups[label] = [];
        groups[label].push(item);
      });

      setHistoryGroups(Object.keys(groups).map(label => ({
        date: label,
        items: groups[label]
      })));
    }
    setLoading(false);
  };

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 20px', backgroundColor: 'var(--surface-card)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div className="heading-h2" style={{ color: 'var(--text-primary)', flex: 1 }}>Activity</div>
        <Funnel size={24} color="var(--text-primary)" />
      </div>

      <div style={{ padding: '12px 20px 16px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {['All', 'Uploads', 'Tools Used', 'Shared', 'Deleted'].map((chip, i) => (
          <div key={i} style={{ height: 32, borderRadius: 20, padding: '0 16px', display: 'flex', alignItems: 'center', backgroundColor: i === 0 ? 'var(--primary-100)' : 'var(--surface-card)', border: `1px solid ${i === 0 ? 'var(--primary-500)' : 'var(--border-default)'}`, color: i === 0 ? 'var(--primary-500)' : 'var(--text-secondary)', fontFamily: 'Inter', fontWeight: 500, fontSize: 13, flexShrink: 0 }}>
            {chip}
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: 20 }}>
           <ListSkeleton />
        </div>
      ) : historyGroups.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <div className="body-md" style={{ color: 'var(--text-muted)' }}>No activity found. Start working with PDFs!</div>
        </div>
      ) : (
        historyGroups.map((group, i) => (
          <div key={i}>
            <div style={{ padding: '8px 20px', backgroundColor: 'var(--surface-bg)', position: 'sticky', top: 64, zIndex: 5 }}>
              <span className="label-sm" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{group.date}</span>
            </div>
            <div style={{ padding: '0 20px' }}>
              {group.items.map((item: any) => {
                const config = getIcon(item.action_type);
                const Icon = config.icon;
                return (
                  <div key={item.id} style={{ height: 72, backgroundColor: 'var(--surface-card)', borderRadius: 16, boxShadow: 'var(--shadow-level-1)', display: 'flex', alignItems: 'center', padding: '0 12px', marginBottom: 8 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={22} color={config.color} weight="fill" />
                    </div>
                    <div style={{ flex: 1, paddingLeft: 12, overflow: 'hidden' }}>
                      <div className="title-md" style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</div>
                      <div className="caption" style={{ color: 'var(--text-muted)', marginTop: 4 }}>
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {item.files?.size_bytes && ` · ${(item.files.size_bytes / (1024*1024)).toFixed(2)} MB`}
                      </div>
                    </div>
                    <div style={{ width: 36, height: 42, borderRadius: 6, backgroundColor: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.6 }}>
                      <FilePdf size={20} color="var(--primary-500)" weight="fill" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default HistoryPage;
