import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(
      import.meta.env.VITE_SUPABASE_URL || "http://127.0.0.1:54321",
      import.meta.env.VITE_SB_PUBLISHABLE_KEY || "missing-publishable-key",
    );
  }
  return supabaseClient;
};
