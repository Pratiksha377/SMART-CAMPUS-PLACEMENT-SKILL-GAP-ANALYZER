import React, { useState } from 'react';
import { useProfile, useDocuments } from '@/hooks';
import { ProfileFormData } from '@/types/profile';
import { StudentProfileView } from '@/components/StudentProfileView';
import { StudentProfileForm } from '@/components/StudentProfileForm';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const StudentProfilePage: React.FC = () => {
  const { profile, isLoading, error, updateProfile, refreshProfile } = useProfile();
  const {
    documents,
    isUploading: isUploadingDoc,
    uploadDocument,
    deleteDocument,
    replaceDocument,
  } = useDocuments(profile?.id);

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      await updateProfile(data);
      setIsEditing(false);
    } catch {
      // Toast notification handled inside useProfile hook
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center p-8 space-y-4">
        <Spinner size="lg" variant="primary" label="Loading student profile..." />
        <p className="text-xs text-slate-400">Loading your profile details and documents...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <Card variant="glass" padding="lg" className="border-rose-500/30 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Unable to load profile</h3>
          <p className="text-xs text-slate-400">{error}</p>
          <Button variant="primary" onClick={() => refreshProfile()}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Student Profile Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain your academic credentials, verified skills, and placement documents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={isEditing ? 'secondary' : 'primary'}
            size="md"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'View Read-Only Profile' : 'Edit Profile Details'}
          </Button>
        </div>
      </div>

      {isEditing ? (
        <StudentProfileForm
          initialData={{ ...profile, documents }}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsEditing(false)}
          isSubmitting={isSubmitting}
        />
      ) : (
        <StudentProfileView
          profile={{ ...profile, documents }}
          onEditToggle={() => setIsEditing(true)}
          onDeleteDocument={deleteDocument}
          onReplaceDocument={replaceDocument}
          onUploadDocument={uploadDocument}
          isUploadingDoc={isUploadingDoc}
        />
      )}
    </div>
  );
};

export default StudentProfilePage;
