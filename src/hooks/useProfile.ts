import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setProfileStart,
  setProfile,
  updateProfile as updateProfileInStore,
  setProfileError,
} from '@/store/profileSlice';
import { profileService } from '@/services/profileService';
import { StudentProfile } from '@/types/profile';
import { useToast } from './useToast';

export const useProfile = (studentId?: string) => {
  const dispatch = useAppDispatch();
  const { profile, isLoading, error } = useAppSelector((state) => state.profile);
  const toast = useToast();

  const fetchProfile = useCallback(async () => {
    dispatch(setProfileStart());
    try {
      const data = await profileService.getProfile(studentId);
      dispatch(setProfile(data));
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch student profile';
      dispatch(setProfileError(message));
      return null;
    }
  }, [dispatch, studentId]);

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  const update = useCallback(
    async (data: Partial<StudentProfile>) => {
      if (!profile) return null;
      dispatch(setProfileStart());
      try {
        const updated = await profileService.updateProfile(profile.id, data);
        dispatch(updateProfileInStore(updated));
        toast.success('Profile updated successfully!', 'Profile Saved');
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update profile';
        dispatch(setProfileError(message));
        toast.error(message, 'Update Error');
        throw err;
      }
    },
    [dispatch, profile, toast]
  );

  return {
    profile,
    isLoading,
    error,
    updateProfile: update,
    refreshProfile: fetchProfile,
  };
};

export default useProfile;
