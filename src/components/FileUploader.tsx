import React, { useState, useRef, DragEvent } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { DocumentType } from '@/types/profile';
import { Button } from './ui/Button';

export interface FileUploaderProps {
  onUpload: (file: File, type: DocumentType) => Promise<unknown>;
  isUploading?: boolean;
  maxSizeBytes?: number;
  allowedExtensions?: string[];
  className?: string;
}

const documentTypes: Array<{ value: DocumentType; label: string }> = [
  { value: 'resume', label: 'Resume / CV' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'transcript', label: 'Academic Transcript' },
  { value: 'other', label: 'Other Document' },
];

export const FileUploader: React.FC<FileUploaderProps> = ({
  onUpload,
  isUploading = false,
  maxSizeBytes = 10 * 1024 * 1024, // 10 MB
  allowedExtensions = ['.pdf', '.doc', '.docx'],
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType>('resume');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setError(`Invalid file type. Allowed formats: ${allowedExtensions.join(', ')}`);
      return false;
    }
    if (file.size > maxSizeBytes) {
      setError(`File is too large. Maximum size is ${(maxSizeBytes / (1024 * 1024)).toFixed(0)}MB.`);
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;
    try {
      await onUpload(selectedFile, selectedType);
      setSelectedFile(null);
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch {
      // error handled by hook toast
    }
  };

  return (
    <div className={`space-y-4 font-sans ${className}`}>
      {/* Document Type Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-300 mr-1">Document Category:</span>
        {documentTypes.map((dt) => (
          <button
            key={dt.value}
            type="button"
            onClick={() => setSelectedType(dt.value)}
            className={`
              text-xs px-3 py-1.5 rounded-lg border font-medium transition-all duration-150
              ${
                selectedType === dt.value
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:text-white'
              }
            `}
          >
            {dt.label}
          </button>
        ))}
      </div>

      {/* Drag & Drop Target Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        data-testid="file-dropzone"
        className={`
          border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200
          flex flex-col items-center justify-center min-h-[160px]
          ${
            isDragOver
              ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
              : 'border-slate-700/80 bg-slate-900/40 hover:border-indigo-500/50 hover:bg-slate-900/70'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedExtensions.join(',')}
          onChange={handleFileChange}
          className="hidden"
          data-testid="file-input"
        />

        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>

        <p className="text-sm font-semibold text-slate-200">
          Click to upload or drag & drop files here
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Supports PDF, DOC, DOCX (Max 10MB per document)
        </p>
      </div>

      {/* Selected File Details & Upload Action */}
      {selectedFile && (
        <div className="flex items-center justify-between p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl animate-fadeIn">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{selectedFile.name}</p>
              <p className="text-[11px] text-slate-400">
                {(selectedFile.size / 1024).toFixed(1)} KB • {selectedType.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleUploadSubmit}
              isLoading={isUploading}
              loadingText="Uploading..."
              rightIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Confirm Upload
            </Button>
          </div>
        </div>
      )}

      {/* Validation Error Alert */}
      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
