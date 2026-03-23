import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedAdminClient: SupabaseClient | null = null;

function getEnv(name: string): string {
  return process.env[name]?.trim() ?? "";
}

function hasSupabaseConfig(): boolean {
  return Boolean(getEnv("NEXT_PUBLIC_SUPABASE_URL") && getEnv("SUPABASE_SERVICE_ROLE_KEY"));
}

export function isSupabaseConfigured(): boolean {
  return hasSupabaseConfig();
}

export function getSupabaseAdminClient(): SupabaseClient {
  if (!hasSupabaseConfig()) {
    throw new Error("Supabase environment variables are not configured.");
  }

  if (cachedAdminClient) {
    return cachedAdminClient;
  }

  cachedAdminClient = createClient(
    getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  return cachedAdminClient;
}

export function getSupabaseAnonClient(): SupabaseClient {
  const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabasePublishableKey =
    getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ||
    getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Supabase publishable key is missing. Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY for legacy projects).",
    );
  }

  return createClient(supabaseUrl, supabasePublishableKey);
}
