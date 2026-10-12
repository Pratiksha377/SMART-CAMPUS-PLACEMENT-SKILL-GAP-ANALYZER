import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobPostingForm } from '@/components/JobPostingForm';
import { recruiterService } from '@/services/recruiterService';
import { JobPostingFormData } from '@/types/recruiter';
import { useToast } from '@/hooks';
import { useAuth } from '@/hooks/useAuth';

export const CreatePostingPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: JobPostingFormData) => {
    setIsSubmitting(true);
    try {
      const created = await recruiterService.createPosting(data, user?.id || 'rec-default-01');
      toast.success(
        `Job opening "${created.title}" at ${created.company} has been published!`,
        'Opportunity Published'
      );
      navigate('/recruiter/postings');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to publish opportunity';
      toast.error(msg, 'Publishing Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <JobPostingForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/recruiter/postings')}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default CreatePostingPage;
