import { NextResponse } from "next/server";
import {
  ensureNumber,
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
  const { data, error } = await supabaseAdmin().from("tool_badges").select("*").eq("id", id).maybeSingle();

  if (error) {
    return jsonError(error.message, 500);
  }

  if (!data) {
    return jsonError("Tool badge not found", 404);
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

  if (typeof payload.name === "string") updateInput.name = payload.name.trim();
  if (payload.sortOrder !== undefined) updateInput.sort_order = ensureNumber(payload.sortOrder, 1000);

  const { data, error } = await supabaseAdmin()
    .from("tool_badges")
    .update(updateInput)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    return jsonError(error.message, 500);
  }

  if (!data) {
    return jsonError("Tool badge not found", 404);
  }

  revalidateTags(["tool-badges"]);
  return NextResponse.json({ data });
}

export async function DELETE(request: Request, context: Params) {
  const authGuard = guardAdmin(request);
  if (authGuard) {
    return authGuard;
  }

  const { id } = await context.params;
  const { error } = await supabaseAdmin().from("tool_badges").delete().eq("id", id);

  if (error) {
    return jsonError(error.message, 500);
  }

  revalidateTags(["tool-badges"]);
  return new NextResponse(null, { status: 204 });
}
