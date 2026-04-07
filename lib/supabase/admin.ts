import "server-only";

import { createClient } from "@supabase/supabase-js";

let hasWarnedAboutAnonFallback = false;

function normalizeEnvValue(value: string | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = normalizeEnvValue(
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  const fallbackAnonKey =
    normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    normalizeEnvValue(process.env.SUPABASE_ANON_KEY);
  const supabaseKey = serviceRoleKey || fallbackAnonKey;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }

  if (!supabaseKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set",
    );
  }

  if (!serviceRoleKey && !hasWarnedAboutAnonFallback) {
    hasWarnedAboutAnonFallback = true;
    console.warn(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Falling back to the anon key for server requests.",
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function requireSupabaseServiceRoleKey() {
  if (normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY)) {
    return;
  }

  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is required for privileged writes like checkout, orders, and cart mutations. Add the service_role key from Supabase to .env.local.",
  );
}
