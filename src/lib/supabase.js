/**
 * Supabase Client Initialization
 * 
 * Works both with Vite bundler and standalone browser ESM.
 * The anon key is designed for frontend use — RLS protects all data.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

// Support both Vite import.meta.env and browser window.__ENV__
const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (window.__ENV__ || {});
const supabaseUrl = env.VITE_SUPABASE_URL || window.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || window.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);
