import { supabase } from '../config/auth/supabaseClient';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Common fetch client wrapper that injects active Supabase Auth headers.
 */
export const apiRequest = async (path: string, options: RequestInit = {}): Promise<any> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.set('Content-Type', 'application/json');

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return response.json();
};
