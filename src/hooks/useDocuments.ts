import { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setDocuments,
  addDocument,
  removeDocument,
  replaceDocument as replaceDocumentInStore,
} from '@/store/profileSlice';
import { profileService } from '@/services/profileService';
import { DocumentMetadata, DocumentType } from '@/types/profile';
import { useToast } from './useToast';

export const useDocuments = (studentId?: string) => {
  const dispatch = useAppDispatch();
  const { documents, profile } = useAppSelector((state) => state.profile);
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  const targetStudentId = studentId || profile?.id || 'prof-std-1001';

  const upload = useCallback(
    async (file: File, type: DocumentType = 'resume'): Promise<DocumentMetadata> => {
      setIsUploading(true);
      try {
        const doc = await profileService.uploadDocument(targetStudentId, file, type);
        dispatch(addDocument(doc));
        toast.success(`"${file.name}" uploaded successfully!`, 'Document Uploaded');
        return doc;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to upload document';
        toast.error(message, 'Upload Error');
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [dispatch, targetStudentId, toast]
  );

  const remove = useCallback(
    async (documentId: string): Promise<boolean> => {
      try {
        await profileService.deleteDocument(targetStudentId, documentId);
        dispatch(removeDocument(documentId));
        toast.info('Document was removed from your profile', 'Document Deleted');
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete document';
        toast.error(message, 'Delete Error');
        throw err;
      }
    },
    [dispatch, targetStudentId, toast]
  );

  const replace = useCallback(
    async (
      documentId: string,
      file: File,
      type: DocumentType = 'resume'
    ): Promise<DocumentMetadata> => {
      setIsUploading(true);
      try {
        const updated = await profileService.replaceDocument(
          targetStudentId,
          documentId,
          file,
          type
        );
        dispatch(replaceDocumentInStore({ id: documentId, document: updated }));
        toast.success(`"${file.name}" replaced existing document.`, 'Document Replaced');
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to replace document';
        toast.error(message, 'Replacement Error');
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [dispatch, targetStudentId, toast]
  );

  return {
    documents: documents || [],
    isUploading,
    uploadDocument: upload,
    deleteDocument: remove,
    replaceDocument: replace,
  };
};

export default useDocuments;
