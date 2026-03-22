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
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true, nullsFirst: false });

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
    const projectInput = {
      title: ensureString(payload.title, "title"),
      slug: typeof payload.slug === "string" ? payload.slug.trim() || null : null,
      category: ensureString(payload.category, "category"),
      tech_stack: ensureStringArray(payload.techStack),
      version: typeof payload.version === "string" ? payload.version.trim() || "v1.0.0" : "v1.0.0",
      status: ensureString(payload.status, "status"),
      summary: ensureString(payload.summary, "summary"),
      thumbnail_src:
        typeof payload.thumbnailSrc === "string" && payload.thumbnailSrc.trim()
          ? payload.thumbnailSrc.trim()
          : "/images/project-placeholder.svg",
      repo_url: typeof payload.repoUrl === "string" ? payload.repoUrl.trim() || null : null,
      live_url: typeof payload.liveUrl === "string" ? payload.liveUrl.trim() || null : null,
      featured: payload.featured === true,
      sort_order: ensureNumber(payload.sortOrder, 1000),
    };

    const { data, error } = await supabaseAdmin()
      .from("projects")
      .insert(projectInput)
      .select("*")
      .single();

    if (error) {
      return jsonError(error.message, 500);
    }

    revalidateTags(["projects"]);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Invalid payload", 400);
  }
}
