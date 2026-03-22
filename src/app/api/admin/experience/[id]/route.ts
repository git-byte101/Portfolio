import { NextResponse } from "next/server";
import {
  ensureNumber,
  ensureStringArray,
  guardAdmin,
  jsonError,
  parseJsonBody,
  revalidateTags,
  supabaseAdmin,
} from "@/app/api/admin/_shared";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: Params) {
  const authGuard = guardAdmin(request);
  if (authGuard) {
    return authGuard;
  }

  const { id } = await context.params;
  const { data, error } = await supabaseAdmin().from("experience_entries").select("*").eq("id", id).maybeSingle();

  if (error) {
    return jsonError(error.message, 500);
  }

  if (!data) {
    return jsonError("Experience record not found", 404);
  }

  return NextResponse.json({ data });
}

export async function PATCH(request: Request, context: Params) {
  const authGuard = guardAdmin(request);
  if (authGuard) {
    return authGuard;
  }

  const { id } = await context.params;
  const payload = await parseJsonBody(request);

  const updateInput: Record<string, unknown> = {};

  if (typeof payload.period === "string") updateInput.period = payload.period.trim();
  if (typeof payload.role === "string") updateInput.role = payload.role.trim();
  if (typeof payload.company === "string") updateInput.company = payload.company.trim();
  if (typeof payload.summary === "string") updateInput.summary = payload.summary.trim();
  if (Array.isArray(payload.highlights)) updateInput.highlights = ensureStringArray(payload.highlights);
  if (payload.sortOrder !== undefined) updateInput.sort_order = ensureNumber(payload.sortOrder, 1000);

  const { data, error } = await supabaseAdmin()
    .from("experience_entries")
    .update(updateInput)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    return jsonError(error.message, 500);
  }

  if (!data) {
    return jsonError("Experience record not found", 404);
  }

  revalidateTags(["experience"]);
  return NextResponse.json({ data });
}

export async function DELETE(request: Request, context: Params) {
  const authGuard = guardAdmin(request);
  if (authGuard) {
    return authGuard;
  }

  const { id } = await context.params;
  const { error } = await supabaseAdmin().from("experience_entries").delete().eq("id", id);

  if (error) {
    return jsonError(error.message, 500);
  }

  revalidateTags(["experience"]);
  return new NextResponse(null, { status: 204 });
}
