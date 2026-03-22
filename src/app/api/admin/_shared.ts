import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";

export function guardAdmin(request: Request): NextResponse | null {
  const authError = requireAdmin(request);
  if (authError) {
    return authError;
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 500 },
    );
  }

  return null;
}

export function jsonError(message: string, status = 400): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export async function parseJsonBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    return payload && typeof payload === "object" ? payload : {};
  } catch {
    return {};
  }
}

export function ensureString(input: unknown, fieldName: string): string {
  if (typeof input !== "string" || !input.trim()) {
    throw new Error(`${fieldName} is required.`);
  }

  return input.trim();
}

export function ensureNumber(input: unknown, defaultValue = 0): number {
  if (typeof input === "number" && Number.isFinite(input)) {
    return input;
  }

  if (typeof input === "string" && input.trim()) {
    const parsed = Number(input);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return defaultValue;
}

export function ensureStringArray(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

export function revalidateTags(tags: string[]): void {
  for (const tag of tags) {
    revalidateTag(tag, "max");
  }
}

export function supabaseAdmin() {
  return getSupabaseAdminClient();
}
