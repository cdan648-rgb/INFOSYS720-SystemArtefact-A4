import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export function createSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables"
    );
  }

  return createClient<Database>(url, key, {
    auth: { persistSession: false },
  });
}
