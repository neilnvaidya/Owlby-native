import { supabase } from '../lib/supabase';

export const api = {
  async loginWithGoogle(token: string) {
    try {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token,
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error?.message || 'Unknown error' };
    }
  },

  async loginWithApple(token: string) {
    try {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token,
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error?.message || 'Unknown error' };
    }
  },

  setToken(token: string) {
    // Token is automatically handled by Supabase client
    return;
  },
}; 