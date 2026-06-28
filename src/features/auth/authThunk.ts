import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';
import type { UserProfile } from './authSlice';

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async () => {
    const res = await apiRequest('/auth/me');
    return res.data as UserProfile;
  }
);
