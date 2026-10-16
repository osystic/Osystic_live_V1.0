import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createBrowserSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createBrowserSupabaseClient();

export const financeDB = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'finance' },
});

export const auditDB = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'audit' },
});

export const reportingDB = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'reporting' },
});