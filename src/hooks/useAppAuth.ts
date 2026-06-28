import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchUserProfile } from '../features/auth/authThunk';
import { clearAuth } from '../features/auth/authSlice';
import { selectUserProfile, selectAuthLoading, selectAuthError } from '../features/auth/authSelector';
import { useAuth as useSupabaseAuth } from '../context/AuthContext';

/**
 * Custom hook to abstract Redux auth state fetching, loading state, and supabase session management.
 */
export const useAppAuth = () => {
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector(selectUserProfile);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const { user: supabaseUser, signOut: supabaseSignOut } = useSupabaseAuth();

  useEffect(() => {
    if (supabaseUser) {
      dispatch(fetchUserProfile());
    } else {
      dispatch(clearAuth());
    }
  }, [supabaseUser, dispatch]);

  const signOut = async () => {
    await supabaseSignOut();
    dispatch(clearAuth());
  };

  const avatarUrl = supabaseUser?.user_metadata?.avatar_url || supabaseUser?.user_metadata?.picture;
  const name = supabaseUser?.user_metadata?.full_name || supabaseUser?.user_metadata?.name || '';

  return {
    user: userProfile
      ? { ...userProfile, avatarUrl, name }
      : (supabaseUser ? { id: supabaseUser.id, email: supabaseUser.email, avatarUrl, name } : null),
    loading,
    error,
    signOut,
  };
};
