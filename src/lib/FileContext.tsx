import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { PDFService } from './PDFService';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

export interface PDFFile {
  id: string;
  name: string;
  size: string;
  pages: number;
  blob?: Blob;
  previewUrl?: string;
  createdAt: Date;
  starred: boolean;
  storagePath: string;
}

interface FileContextType {
  files: PDFFile[];
  loading: boolean;
  addFile: (file: File) => Promise<string | null>;
  removeFile: (id: string, physical?: boolean) => Promise<void>;
  toggleStar: (id: string) => Promise<void>;
  getFile: (id: string) => PDFFile | undefined;
  downloadFile: (path: string) => Promise<Blob | null>;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const blobUrls = useRef<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      blobUrls.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchFiles();
    } else {
      setFiles([]);
      setLoading(false);
    }
  }, [user]);

  const fetchFiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching files:', error);
      showToast('Failed to load files', 'error');
    } else if (data) {
      setFiles(data.map(f => ({
        id: f.id,
        name: f.name,
        size: (f.size_bytes / (1024 * 1024)).toFixed(2) + ' MB',
        pages: f.page_count,
        createdAt: new Date(f.created_at),
        starred: f.is_starred,
        storagePath: f.storage_path
      })));
    }
    setLoading(false);
  };

  const downloadFile = async (path: string): Promise<Blob | null> => {
    const { data, error } = await supabase.storage.from('pdfs').download(path);
    if (error) {
      console.error('Secure download failed:', error);
      return null;
    }
    return data;
  };

  const createManagedUrl = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    blobUrls.current.add(url);
    return url;
  };

  const addFile = async (file: File): Promise<string | null> => {
    if (!user) {
      showToast('Please sign in', 'error');
      return null;
    }

    const storagePath = `${user.id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from('pdfs').upload(storagePath, file);

    if (uploadError) {
      console.error('Upload failed:', uploadError);
      showToast('Upload failed', 'error');
      return null;
    }

    let pages = 1;
    try { pages = await PDFService.getPageCount(file); } catch (e) {}

    const { data, error } = await supabase.from('files').insert({
      user_id: user.id,
      name: file.name,
      size_bytes: file.size,
      page_count: pages,
      storage_path: storagePath,
      is_starred: false
    }).select().single();

    if (!error) {
      await supabase.from('activity_logs').insert({ user_id: user.id, action_type: 'upload', description: `Uploaded ${file.name}`, file_id: data.id });
      setFiles(prev => [{
        id: data.id,
        name: data.name,
        size: (data.size_bytes / (1024 * 1024)).toFixed(2) + ' MB',
        pages: data.page_count,
        createdAt: new Date(data.created_at),
        starred: data.is_starred,
        storagePath: data.storage_path,
        blob: file,
        previewUrl: createManagedUrl(file)
      }, ...prev]);
      showToast('File uploaded successfully', 'success');
      refreshProfile();
      return data.id;
    }
    return null;
  };

  const removeFile = async (id: string, physical: boolean = false) => {
    const file = files.find(f => f.id === id);
    if (!file) return;

    if (physical) {
      await supabase.storage.from('pdfs').remove([file.storagePath]);
      await supabase.from('files').delete().eq('id', id);
      setFiles(prev => prev.filter(f => f.id !== id));
    } else {
      const { error } = await supabase.from('files').update({ is_deleted: true, deleted_at: new Date() }).eq('id', id);
      if (!error) {
        setFiles(prev => prev.filter(f => f.id !== id));
        showToast('Moved to trash', 'info');
      }
    }
    refreshProfile();
  };

  const toggleStar = async (id: string) => {
    const file = files.find(f => f.id === id);
    if (!file) return;
    const { error } = await supabase.from('files').update({ is_starred: !file.starred }).eq('id', id);
    if (!error) {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, starred: !f.starred } : f));
      showToast(file.starred ? 'Unstarred' : 'Starred', 'success');
    }
  };

  const getFile = (id: string) => files.find(f => f.id === id);

  return (
    <FileContext.Provider value={{ files, loading, addFile, removeFile, toggleStar, getFile, downloadFile }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFiles = () => {
  const context = useContext(FileContext);
  if (!context) throw new Error('useFiles error');
  return context;
};
