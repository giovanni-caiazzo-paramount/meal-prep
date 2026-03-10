/**
 * Supabase Client Initialization
 * Server-side and Client-side clients
 */

import { createClient } from "@supabase/supabase-js";
import env from "../env";

// Server client for SSR and Server Actions
export function createServerSupabaseClient() {
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
      },
    }
  );
}

// Client for browser (if needed)
export function createBrowserSupabaseClient() {
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
