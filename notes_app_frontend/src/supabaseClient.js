import { createClient } from '@supabase/supabase-js';

/**
 * PUBLIC_INTERFACE
 * Supabase client configured via environment variables.
 *
 * Required env vars (set in container .env):
 * - REACT_APP_SUPABASE_URL: Supabase project URL
 * - REACT_APP_SUPABASE_ANON_KEY: Supabase anon/public API key
 *
 * Do not hardcode keys; CI/Orchestrator will set them.
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // We keep this as a console.warn so the app still renders,
  // but CRUD calls will fail fast with clear messages.
  // The orchestrator/user must provide the environment variables.
  // eslint-disable-next-line no-console
  console.warn(
    'Supabase env vars are missing. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in the .env for this container.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
