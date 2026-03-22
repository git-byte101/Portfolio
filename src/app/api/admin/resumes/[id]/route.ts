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
  const { data, error } = await supabaseAdmin().from("resume_assets").select("*").eq("id", id).maybeSingle();

  if (error) {
    return jsonError(error.message, 500);
  }

  if (!data) {
    return jsonError("Resume record not found", 404);
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

  if (typeof payload.title === "string") updateInput.title = payload.title.trim();
  if (typeof payload.summary === "string") updateInput.summary = payload.summary.trim();
  if (typeof payload.fileUrl === "string") updateInput.file_url = payload.fileUrl.trim();
  if (typeof payload.fileName === "string") updateInput.file_name = payload.fileName.trim();
  if (typeof payload.isActive === "boolean") updateInput.is_active = payload.isActive;
  if (payload.sortOrder !== undefined) updateInput.sort_order = ensureNumber(payload.sortOrder, 1000);

  const { data, error } = await supabaseAdmin()
    .from("resume_assets")
    .update(updateInput)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    return jsonError(error.message, 500);
  }

  if (!data) {
    return jsonError("Resume record not found", 404);
  }

  revalidateTags(["resume-assets"]);
  return NextResponse.json({ data });
}

export async function DELETE(request: Request, context: Params) {
  const authGuard = guardAdmin(request);
  if (authGuard) {
    return authGuard;
  }

  const { id } = await context.params;
  const { error } = await supabaseAdmin().from("resume_assets").delete().eq("id", id);

  if (error) {
    return jsonError(error.message, 500);
  }

  revalidateTags(["resume-assets"]);
  return new NextResponse(null, { status: 204 });
}
