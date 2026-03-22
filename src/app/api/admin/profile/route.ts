import { NextResponse } from "next/server";
import {
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
    .from("profile_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();

  if (error) {
    return jsonError(error.message, 500);
  }

  return NextResponse.json({ data });
}

export async function PUT(request: Request) {
  const authGuard = guardAdmin(request);
  if (authGuard) {
    return authGuard;
  }

  const payload = await parseJsonBody(request);

  try {
    const upsertInput = {
      id: "default",
      name: ensureString(payload.name, "name"),
      sidebar_footnote: ensureString(payload.sidebarFootnote, "sidebarFootnote"),
      dashboard_title: ensureString(payload.dashboardTitle, "dashboardTitle"),
      dashboard_subtitle: ensureString(payload.dashboardSubtitle, "dashboardSubtitle"),
      profile_photo_src: ensureString(payload.profilePhotoSrc, "profilePhotoSrc"),
      overview_heading: ensureString(payload.overviewHeading, "overviewHeading"),
      overview_intro: ensureString(payload.overviewIntro, "overviewIntro"),
      learner_heading: ensureString(payload.learnerHeading, "learnerHeading"),
      learner_intro: ensureString(payload.learnerIntro, "learnerIntro"),
      availability_text: ensureString(payload.availabilityText, "availabilityText"),
      target_text: ensureString(payload.targetText, "targetText"),
      work_style_text: ensureString(payload.workStyleText, "workStyleText"),
      foundation_areas: ensureStringArray(payload.foundationAreas),
      contact_heading: ensureString(payload.contactHeading, "contactHeading"),
      contact_intro: ensureString(payload.contactIntro, "contactIntro"),
      contact_bio: ensureString(payload.contactBio, "contactBio"),
      contact_highlights: ensureStringArray(payload.contactHighlights),
    };

    const { data, error } = await supabaseAdmin()
      .from("profile_settings")
      .upsert(upsertInput, { onConflict: "id" })
      .select("*")
      .single();

    if (error) {
      return jsonError(error.message, 500);
    }

    revalidateTags(["profile", "profile-settings"]);
    return NextResponse.json({ data });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Invalid payload", 400);
  }
}
