import type { RootState } from '../../app/Store';

export const selectUserProfile = (state: RootState) => state.auth.userProfile;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
