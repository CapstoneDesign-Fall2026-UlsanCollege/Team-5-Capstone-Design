/**
 * Supabase Client Initialization
 * 
 * Works both with Vite bundler and standalone browser ESM.
 * The anon key is designed for frontend use — RLS protects all data.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const DEFAULT_SUPABASE_URL = 'https://bcwwnjtmrcxggbaallon.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_w2FL6KB5yEyy_iatIN993Q_ifuBdl7i';

// Support both Vite import.meta.env, browser window.__ENV__, and live deployed project defaults
const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (window.__ENV__ || {});
export const supabaseUrl = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || window.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || window.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;

// Returns true if real Supabase credentials have been configured
export const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder-project') &&
  !supabaseUrl.includes('your-project-ref')
);

if (!isConfigured) {
  console.info(
    'Notice: Supabase credentials not set. Running in Local Preview Mode with mock auth and offline database. ' +
    'To connect live Supabase Cloud, add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env'
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
