import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './authSlice';
import profileReducer from './slices/profileSlice';
import opportunityReducer from './slices/opportunitySlice';
import notificationReducer from './slices/notificationSlice';
import assessmentReducer from './assessmentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    opportunities: opportunityReducer,
    notifications: notificationReducer,
    assessment: assessmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
