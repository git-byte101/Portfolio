import { NextResponse } from "next/server";
import {
  ensureNumber,
  ensureString,
  ensureStringArray,
  guardAdmin,
  jsonError,
  parseJsonBody,
  revalidateTags,
  supabaseAdmin,
} from "@/app/api/admin/_shared";

export async function GET(request: Request) {
  const authGuard = guardAdmin(request);
  if (authGuard) {
    return authGuard;
  }

  const { data, error } = await supabaseAdmin()
    .from("experience_entries")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return jsonError(error.message, 500);
  }

  return NextResponse.json({ data: data ?? [] });
}

export async function POST(request: Request) {
  const authGuard = guardAdmin(request);
  if (authGuard) {
    return authGuard;
  }

  const payload = await parseJsonBody(request);

  try {
    const entry = {
      period: ensureString(payload.period, "period"),
      role: ensureString(payload.role, "role"),
      company: ensureString(payload.company, "company"),
      summary: ensureString(payload.summary, "summary"),
      highlights: ensureStringArray(payload.highlights),
      sort_order: ensureNumber(payload.sortOrder, 1000),
    };

    const { data, error } = await supabaseAdmin()
      .from("experience_entries")
      .insert(entry)
      .select("*")
      .single();

    if (error) {
      return jsonError(error.message, 500);
    }

    revalidateTags(["experience"]);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Invalid payload", 400);
  }
}
