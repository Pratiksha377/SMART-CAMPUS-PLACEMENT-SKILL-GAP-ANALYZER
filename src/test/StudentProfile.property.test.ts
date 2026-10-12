import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { profileService, initialMockProfile } from '@/services/profileService';
import { StudentProfile, profileValidationSchema, DocumentType } from '@/types/profile';

describe('Student Profile - Property-Based Tests (Properties 1-3)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Arbitrary generator for valid student profile data
  const validProfileArbitrary = fc.record({
    id: fc.stringMatching(/^prof-[a-z0-9]{5,10}$/),
    userId: fc.stringMatching(/^usr-[a-z0-9]{5,10}$/),
    fullName: fc.stringMatching(/^[A-Z][a-z]{2,12} [A-Z][a-z]{2,12}$/),
    email: fc.stringMatching(/^[a-z0-9]{3,8}\.[a-z0-9]{3,8}@campus\.edu$/),
    phone: fc.constantFrom('+1 (555) 123-4567', '+91 9876543210', undefined),
    bio: fc.constantFrom('Aspiring software engineer', 'Cloud and devops enthusiast', undefined),
    education: fc.record({
      institution: fc.constantFrom('MIT', 'Stanford University', 'IIIT Bangalore', 'National Institute of Tech'),
      degree: fc.constantFrom('B.Tech', 'B.E.', 'M.S.', 'B.S. Computer Science'),
      fieldOfStudy: fc.constantFrom('Computer Science', 'Data Science', 'Electrical Engineering'),
      graduationYear: fc.integer({ min: 2024, max: 2030 }),
      cgpa: fc.float({ min: 5.0, max: 10.0, noNaN: true }).map((n) => Math.round(n * 100) / 100),
    }),
    skills: fc.array(
      fc.record({
        name: fc.constantFrom('TypeScript', 'React', 'Python', 'Go', 'Docker', 'AWS', 'SQL'),
        proficiency: fc.constantFrom<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>(
          'Beginner',
          'Intermediate',
          'Advanced',
          'Expert'
        ),
        endorsements: fc.integer({ min: 0, max: 50 }),
        score: fc.integer({ min: 50, max: 100 }),
      }),
      { minLength: 1, maxLength: 6 }
    ),
    experience: fc.constant([]),
    projects: fc.constant([]),
    documents: fc.constant([]),
  });

  /**
   * Property 1: Profile Round-trip Consistency
   * For any student profile data, when stored and then retrieved, the retrieved data
   * SHALL be identical to the stored data, ensuring no data corruption or loss.
   */
  it('Property 1: Profile Round-trip Consistency', async () => {
    await fc.assert(
      fc.asyncProperty(validProfileArbitrary, async (profileData) => {
        // Save profile
        const saved = await profileService.updateProfile(profileData.id, profileData);

        // Retrieve profile
        const retrieved = await profileService.getProfile(profileData.id);

        // Verify round-trip equivalence
        expect(retrieved.id).toBe(profileData.id);
        expect(retrieved.fullName).toBe(profileData.fullName);
        expect(retrieved.email).toBe(profileData.email);
        expect(retrieved.education.institution).toBe(profileData.education.institution);
        expect(retrieved.education.degree).toBe(profileData.education.degree);
        expect(retrieved.education.fieldOfStudy).toBe(profileData.education.fieldOfStudy);
        expect(retrieved.education.graduationYear).toBe(profileData.education.graduationYear);
        expect(retrieved.education.cgpa).toBe(profileData.education.cgpa);
        expect(retrieved.skills.length).toBe(profileData.skills.length);
      }),
      { numRuns: 30 }
    );
  });

  /**
   * Property 2: Required Field Validation
   * For any profile submission with empty required fields, the system SHALL reject
   * the submission and prevent persistence, maintaining data integrity.
   */
  it('Property 2: Required Field Validation', () => {
    fc.assert(
      fc.property(
        fc.record({
          fullName: fc.constantFrom('', '   ', 'A'), // invalid: too short or empty
          email: fc.constantFrom('', 'not-an-email', 'missing-domain@'),
          education: fc.record({
            institution: fc.constantFrom('', '   '), // invalid
            degree: fc.constant(''), // invalid
            fieldOfStudy: fc.constant(''), // invalid
            graduationYear: fc.constantFrom(1990, 2045), // invalid: out of range
            cgpa: fc.constantFrom(-1, 15.0), // invalid: out of 0-10 range
          }),
        }),
        (invalidData) => {
          const result = profileValidationSchema.safeParse(invalidData);
          // System must reject submission
          expect(result.success).toBe(false);
          if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            expect(
              fieldErrors.fullName !== undefined ||
                fieldErrors.email !== undefined ||
                result.error.issues.length > 0
            ).toBe(true);
          }
        }
      ),
      { numRuns: 30 }
    );
  });

  /**
   * Property 3: File Upload Persistence
   * For any document uploaded by a student, querying the student profile's documents
   * collection SHALL return the uploaded file with matching metadata.
   */
  it('Property 3: File Upload Persistence and Document Metadata Match', async () => {
    const documentTypeArbitrary = fc.constantFrom<DocumentType>(
      'resume',
      'certificate',
      'transcript',
      'other'
    );
    const fileNameArbitrary = fc
      .stringMatching(/^[a-z0-9_-]{3,12}$/)
      .map((name) => `${name}.pdf`);
    const fileSizeArbitrary = fc.integer({ min: 1024, max: 5 * 1024 * 1024 });

    await fc.assert(
      fc.asyncProperty(
        fileNameArbitrary,
        documentTypeArbitrary,
        fileSizeArbitrary,
        async (fileName, docType, fileSize) => {
          const studentId = `test-std-${Math.random().toString(36).substring(7)}`;

          // Create simulated mock File
          const mockFile = new File(['mock content'], fileName, {
            type: 'application/pdf',
          });
          Object.defineProperty(mockFile, 'size', { value: fileSize });

          // Upload document
          const uploaded = await profileService.uploadDocument(studentId, mockFile, docType);

          // Verify returned metadata
          expect(uploaded.name).toBe(fileName);
          expect(uploaded.type).toBe(docType);
          expect(uploaded.size).toBe(fileSize);
          expect(uploaded.id).toBeTruthy();

          // Query profile documents
          const profile = await profileService.getProfile(studentId);
          const persisted = profile.documents.find((d) => d.id === uploaded.id);

          expect(persisted).toBeDefined();
          expect(persisted?.name).toBe(fileName);
          expect(persisted?.type).toBe(docType);
          expect(persisted?.size).toBe(fileSize);

          // Test individual document deletion persistence (Requirement 1.7)
          await profileService.deleteDocument(studentId, uploaded.id);
          const afterDeleteProfile = await profileService.getProfile(studentId);
          expect(afterDeleteProfile.documents.find((d) => d.id === uploaded.id)).toBeUndefined();
        }
      ),
      { numRuns: 20 }
    );
  });
});
