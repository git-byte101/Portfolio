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
  const { data, error } = await supabaseAdmin().from("projects").select("*").eq("id", id).maybeSingle();

  if (error) {
    return jsonError(error.message, 500);
  }

  if (!data) {
    return jsonError("Project not found", 404);
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
  if (typeof payload.slug === "string") updateInput.slug = payload.slug.trim() || null;
  if (typeof payload.category === "string") updateInput.category = payload.category.trim();
  if (Array.isArray(payload.techStack)) updateInput.tech_stack = ensureStringArray(payload.techStack);
  if (typeof payload.version === "string") updateInput.version = payload.version.trim() || "v1.0.0";
  if (typeof payload.status === "string") updateInput.status = payload.status.trim();
  if (typeof payload.summary === "string") updateInput.summary = payload.summary.trim();
  if (typeof payload.thumbnailSrc === "string") updateInput.thumbnail_src = payload.thumbnailSrc.trim();
  if (typeof payload.repoUrl === "string") updateInput.repo_url = payload.repoUrl.trim() || null;
  if (typeof payload.liveUrl === "string") updateInput.live_url = payload.liveUrl.trim() || null;
  if (typeof payload.featured === "boolean") updateInput.featured = payload.featured;
  if (payload.sortOrder !== undefined) updateInput.sort_order = ensureNumber(payload.sortOrder, 1000);

  const { data, error } = await supabaseAdmin()
    .from("projects")
    .update(updateInput)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    return jsonError(error.message, 500);
  }

  if (!data) {
    return jsonError("Project not found", 404);
  }

  revalidateTags(["projects"]);
  return NextResponse.json({ data });
}

export async function DELETE(request: Request, context: Params) {
  const authGuard = guardAdmin(request);
  if (authGuard) {
    return authGuard;
  }

  const { id } = await context.params;
  const { error } = await supabaseAdmin().from("projects").delete().eq("id", id);

  if (error) {
    return jsonError(error.message, 500);
  }

  revalidateTags(["projects"]);
  return new NextResponse(null, { status: 204 });
}
