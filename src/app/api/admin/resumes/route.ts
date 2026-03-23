import { NextResponse } from "next/server";
import {
  ensureNumber,
  ensureString,
  guardAdmin,
  jsonError,
  parseJsonBody,
  revalidateTags,
  supabaseAdmin,
} from "@/app/api/admin/_shared";

function ensurePdfAsset(fileUrl: string, fileName: string): void {
  const urlLooksPdf = /\.pdf($|[?#])/i.test(fileUrl.trim());
  const nameLooksPdf = fileName.trim().toLowerCase().endsWith(".pdf");

  if (!urlLooksPdf || !nameLooksPdf) {
    throw new Error("Resume file must be a PDF upload.");
  }
}

export async function GET(request: Request) {
  const authGuard = guardAdmin(request);
  if (authGuard) {
    return authGuard;
  }

  const { data, error } = await supabaseAdmin().from("resume_assets").select("*").order("sort_order", { ascending: true });

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
    const fileUrl = ensureString(payload.fileUrl, "fileUrl");
    const fileName = ensureString(payload.fileName, "fileName");
    ensurePdfAsset(fileUrl, fileName);

    const entry = {
      title: ensureString(payload.title, "title"),
      summary: ensureString(payload.summary, "summary"),
      file_url: fileUrl,
      file_name: fileName,
      is_active: payload.isActive === true,
      sort_order: ensureNumber(payload.sortOrder, 1000),
    };

    const { data, error } = await supabaseAdmin().from("resume_assets").insert(entry).select("*").single();

    if (error) {
      return jsonError(error.message, 500);
    }

    if (data?.id && entry.is_active) {
      const { error: deactivateError } = await supabaseAdmin()
        .from("resume_assets")
        .update({ is_active: false })
        .neq("id", data.id);

      if (deactivateError) {
        return jsonError(deactivateError.message, 500);
      }
    }

    revalidateTags(["resume-assets"]);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Invalid payload", 400);
  }
}
