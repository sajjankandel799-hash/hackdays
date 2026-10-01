import React, { useState } from 'react';
import { 
  Database, 
  Folder, 
  FileJson, 
  Download, 
  Upload, 
  RotateCcw, 
  Copy, 
  Check, 
  Search,
  FileCode,
  FolderOpen
} from 'lucide-react';
import { storage, VirtualFile } from '../services/storage';

interface StorageExplorerProps {
  onRefreshData: () => void;
}

export const StorageExplorer: React.FC<StorageExplorerProps> = ({ onRefreshData }) => {
  const [virtualFiles, setVirtualFiles] = useState<VirtualFile[]>(() => storage.getAllVirtualFiles());
  const [selectedFile, setSelectedFile] = useState<VirtualFile | null>(() => storage.getAllVirtualFiles()[0] || null);
  const [copied, setCopied] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const refreshFiles = () => {
    const files = storage.getAllVirtualFiles();
    setVirtualFiles(files);
    if (selectedFile) {
      const updated = files.find(f => f.path === selectedFile.path);
      if (updated) setSelectedFile(updated);
    }
  };

  const filteredFiles = virtualFiles.filter((f) => {
    const matchesFolder = selectedFolder === 'all' || f.category === selectedFolder;
    const matchesSearch = f.filename.toLowerCase().includes(searchQuery.toLowerCase()) || f.path.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleCopy = () => {
    if (!selectedFile) return;
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingleFile = () => {
    if (!selectedFile) return;
    const blob = new Blob([selectedFile.content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportConsolidated = () => {
    const json = storage.exportConsolidatedJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hospital-management-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = storage.importConsolidatedJson(content);
      if (res.success) {
        setImportStatus('Backup successfully restored.');
        onRefreshData();
        refreshFiles();
      } else {
        setImportStatus(`Error: ${res.message}`);
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset hospital database to default demo clinical records? Any unsaved custom records will be overwritten.')) {
      storage.resetToDefaults();
      onRefreshData();
      refreshFiles();
      setImportStatus('Database successfully reset to initial clinical seeds.');
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-teal-600" />
            <span>File-Based JSON Storage Explorer</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Directly browse the file persistence tree (`data/patients/`, `data/doctors/`, etc.), inspect raw JSON documents, and export backups.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-slate-600" />
            <span>Import Backup</span>
            <input 
              type="file" 
              accept=".json" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>
          <button
            onClick={handleExportConsolidated}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export All JSON</span>
          </button>
          <button
            onClick={handleResetToDefaults}
            title="Reset database to initial samples"
            className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {importStatus && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-xs font-medium">
          {importStatus}
        </div>
      )}

      {/* Main File System Layout: Left Tree + Right Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Directories & Files Tree (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-[600px]">
          {/* Tree Filter Header */}
          <div className="p-3 border-b border-slate-200 space-y-2 bg-slate-50/70">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter files by name..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            {/* Folder Selectors */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs scrollbar-none">
              {[
                { id: 'all', label: 'All Files' },
                { id: 'patients', label: 'patients/' },
                { id: 'doctors', label: 'doctors/' },
                { id: 'appointments', label: 'appointments/' },
                { id: 'medical-records', label: 'medical-records/' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFolder(f.id)}
                  className={`px-2 py-1 rounded text-[11px] font-mono whitespace-nowrap transition-colors cursor-pointer ${
                    selectedFolder === f.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Files List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 font-mono text-xs">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile?.path === file.path;
              return (
                <div
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-teal-50 text-teal-900 border border-teal-200 font-semibold' 
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileJson className={`w-4 h-4 shrink-0 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                    <div className="truncate">
                      <div className="truncate text-xs">{file.filename}</div>
                      <div className="text-[10px] text-slate-400">{file.path}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 tabular-nums shrink-0 ml-2">
                    {file.sizeBytes} B
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 font-mono tabular-nums flex items-center justify-between">
            <span>{virtualFiles.length} JSON files indexed</span>
            <span>Local Storage Active</span>
          </div>
        </div>

        {/* Right Column: Code / JSON Content Viewer (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 overflow-hidden flex flex-col h-[600px] shadow-sm">
          {/* Viewer Toolbar */}
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300 truncate">
              <FileCode className="w-4 h-4 text-teal-400" />
              <span className="truncate">{selectedFile?.path || 'No file selected'}</span>
            </div>
            {selectedFile && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadSingleFile}
                  title="Download File"
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] bg-teal-600 hover:bg-teal-500 text-slate-950 font-semibold rounded transition-colors cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            )}
          </div>

          {/* Formatted JSON Output */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-emerald-300">
            {selectedFile ? (
              <pre className="whitespace-pre">
                {selectedFile.content}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 text-xs">
                Select a JSON file from the left directory tree to inspect contents.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
