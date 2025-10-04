import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Create Supabase client for frontend operations
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// API base URL for our server
export const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-9f006129`;

// Helper function to make authenticated requests to our server
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add authorization header if user is authenticated
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// Auth helper functions
export const authHelpers = {
  // Sign up a new user
  signUp: async (name: string, email: string, password: string) => {
    return apiRequest('/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  // Sign in an existing user
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      user: {
        id: data.user.id,
        name: data.user.user_metadata?.name || 'Usuário',
        email: data.user.email,
      },
      session: data.session,
    };
  },

  // Sign out the current user
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      throw new Error(error.message);
    }
    return session;
  },

  // Get user profile from server
  getUserProfile: async () => {
    return apiRequest('/profile');
  },

  // Subscribe to auth state changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};