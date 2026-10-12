import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { renderWithProviders } from './test-utils';
import { StudentProfileForm } from '@/components/StudentProfileForm';
import { StudentProfileView } from '@/components/StudentProfileView';
import { FileUploader } from '@/components/FileUploader';
import { DocumentList } from '@/components/DocumentList';
import { initialMockProfile } from '@/services/profileService';

describe('Student Profile UI Components', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders StudentProfileView with full academic qualifications and skills', () => {
    renderWithProviders(
      <StudentProfileView
        profile={initialMockProfile}
        onDeleteDocument={vi.fn()}
        onReplaceDocument={vi.fn()}
        onUploadDocument={vi.fn()}
      />
    );

    expect(screen.getByText('Alex Morgan')).toBeInTheDocument();
    expect(screen.getByText(/University College of Engineering/i)).toBeInTheDocument();
    expect(screen.getByText(/Bachelor of Technology/i)).toBeInTheDocument();
    expect(screen.getAllByText(/TypeScript/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/React/i).length).toBeGreaterThan(0);
  });

  it('renders StudentProfileForm and validates required fields on submission', async () => {
    const handleSubmit = vi.fn();
    renderWithProviders(
      <StudentProfileForm
        initialData={{
          ...initialMockProfile,
          fullName: '',
          email: '',
          education: {
            ...initialMockProfile.education,
            institution: '',
          },
        }}
        onSubmit={handleSubmit}
      />
    );

    const submitBtn = screen.getByRole('button', { name: /save & update profile/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/college \/ institution name is required/i)).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('successfully submits StudentProfileForm when required fields are valid', async () => {
    const handleSubmit = vi.fn();
    renderWithProviders(
      <StudentProfileForm
        initialData={initialMockProfile}
        onSubmit={handleSubmit}
      />
    );

    const submitBtn = screen.getByRole('button', { name: /save & update profile/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  it('FileUploader validates file selection and triggers onUpload', async () => {
    const handleUpload = vi.fn().mockResolvedValue({});
    renderWithProviders(<FileUploader onUpload={handleUpload} />);

    const file = new File(['sample resume content'], 'alex_cv.pdf', {
      type: 'application/pdf',
    });

    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText('alex_cv.pdf')).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: /confirm upload/i });
    await userEvent.click(confirmBtn);

    expect(handleUpload).toHaveBeenCalledWith(file, 'resume');
  });

  it('DocumentList displays documents and handles delete confirmation modal', async () => {
    const handleDelete = vi.fn().mockResolvedValue(true);
    renderWithProviders(
      <DocumentList
        documents={initialMockProfile.documents}
        onDelete={handleDelete}
        onReplace={vi.fn()}
      />
    );

    expect(screen.getByText('Alex_Morgan_Resume_2026.pdf')).toBeInTheDocument();

    // Click delete icon for the first document
    const deleteButtons = screen.getAllByTitle('Delete document');
    await userEvent.click(deleteButtons[0]);

    // Modal appears
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument();

    // Confirm deletion in modal
    const confirmDeleteBtn = screen.getByRole('button', { name: 'Delete Document' });
    await userEvent.click(confirmDeleteBtn);

    expect(handleDelete).toHaveBeenCalledWith('doc-resume-01');
  });
});
