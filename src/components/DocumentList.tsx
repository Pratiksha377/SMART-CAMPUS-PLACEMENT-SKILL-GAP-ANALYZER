import React, { useState, useRef } from 'react';
import {
  FileText,
  Trash2,
  RefreshCw,
  Download,
  AlertTriangle,
  FolderOpen,
} from 'lucide-react';
import { DocumentMetadata, DocumentType } from '@/types/profile';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';

export interface DocumentListProps {
  documents: DocumentMetadata[];
  onDelete: (id: string) => Promise<boolean>;
  onReplace: (id: string, file: File, type?: DocumentType) => Promise<unknown>;
  className?: string;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onDelete,
  onReplace,
  className = '',
}) => {
  const [docToDelete, setDocToDelete] = useState<DocumentMetadata | null>(null);
  const [docToReplace, setDocToReplace] = useState<DocumentMetadata | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (isoString: string): string => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const getBadgeVariant = (type: DocumentType) => {
    switch (type) {
      case 'resume':
        return 'primary';
      case 'certificate':
        return 'success';
      case 'transcript':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const handleConfirmDelete = async () => {
    if (!docToDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(docToDelete.id);
      setDocToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReplaceClick = (doc: DocumentMetadata) => {
    setDocToReplace(doc);
    replaceInputRef.current?.click();
  };

  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && docToReplace) {
      const file = e.target.files[0];
      await onReplace(docToReplace.id, file, docToReplace.type);
      setDocToReplace(null);
      if (replaceInputRef.current) replaceInputRef.current.value = '';
    }
  };

  if (documents.length === 0) {
    return (
      <div className={`p-8 text-center rounded-2xl border border-slate-800 bg-slate-900/40 ${className}`}>
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center">
          <FolderOpen className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-200">No documents uploaded yet</h4>
        <p className="text-xs text-slate-400 mt-1">
          Upload your resume, grade transcripts, or certifications to boost placement match scores.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 font-sans ${className}`}>
      {/* Hidden file input for replacement */}
      <input
        ref={replaceInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleReplaceFile}
        className="hidden"
        data-testid="replace-file-input"
      />

      <div className="divide-y divide-slate-800/70 border border-slate-800 rounded-2xl bg-slate-900/60 overflow-hidden">
        {documents.map((doc) => (
          <div
            key={doc.id}
            data-testid={`document-item-${doc.id}`}
            className="flex items-center justify-between p-4 hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex items-center space-x-3.5 min-w-0 pr-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-100 truncate">{doc.name}</p>
                  <Badge variant={getBadgeVariant(doc.type)} size="sm">
                    {doc.type}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatFileSize(doc.size)} • Uploaded {formatDate(doc.uploadedAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {doc.url && (
                <a
                  href={doc.url}
                  download={doc.name}
                  target="_blank"
                  rel="noreferrer"
                  title="Download / View document"
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                </a>
              )}

              <button
                type="button"
                onClick={() => handleReplaceClick(doc)}
                title="Replace document with updated file"
                className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setDocToDelete(doc)}
                title="Delete document"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!docToDelete}
        onClose={() => setDocToDelete(null)}
        title="Delete Document"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDocToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              isLoading={isDeleting}
              loadingText="Deleting..."
            >
              Delete Document
            </Button>
          </>
        }
      >
        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">
              Are you sure you want to delete <span className="font-semibold text-white">"{docToDelete?.name}"</span>?
            </p>
            <p className="text-xs text-slate-400 mt-1">
              This action cannot be undone. Placement coordinators and recruiters will no longer have access to this document.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentList;
