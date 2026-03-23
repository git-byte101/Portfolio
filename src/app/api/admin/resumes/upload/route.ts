import { NextResponse } from "next/server";
import { guardAdmin, jsonError, supabaseAdmin } from "@/app/api/admin/_shared";

const RESUME_BUCKET = "resume-files";
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function isPdfFile(file: File): boolean {
  if (file.type === "application/pdf") {
    return true;
  }

  return file.name.toLowerCase().endsWith(".pdf");
}

async function ensureBucketExists() {
  const admin = supabaseAdmin();
  const { data, error } = await admin.storage.listBuckets();
  if (error) {
    throw new Error(error.message);
  }

  const exists = (data ?? []).some((bucket) => bucket.name === RESUME_BUCKET);
  if (exists) {
    return;
  }

  const { error: createError } = await admin.storage.createBucket(RESUME_BUCKET, {
    public: true,
    fileSizeLimit: MAX_FILE_SIZE_BYTES,
    allowedMimeTypes: ["application/pdf"],
  });

  if (createError) {
    throw new Error(createError.message);
  }
}

export async function POST(request: Request) {
  const authGuard = guardAdmin(request);
  if (authGuard) {
    return authGuard;
  }

  try {
    const formData = await request.formData();
    const fileField = formData.get("file");

    if (!(fileField instanceof File)) {
      return jsonError("PDF file is required.", 400);
    }

    if (!isPdfFile(fileField)) {
      return jsonError("Only PDF uploads are allowed.", 400);
    }

    if (fileField.size > MAX_FILE_SIZE_BYTES) {
      return jsonError("PDF exceeds the 10MB limit.", 400);
    }

    await ensureBucketExists();

    const safeName = sanitizeFileName(fileField.name || "resume.pdf");
    const objectPath = `${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabaseAdmin().storage
      .from(RESUME_BUCKET)
      .upload(objectPath, fileField, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      return jsonError(uploadError.message, 500);
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin().storage.from(RESUME_BUCKET).getPublicUrl(objectPath);

    return NextResponse.json({
      data: {
        fileUrl: publicUrl,
        fileName: safeName,
      },
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Resume upload failed.",
      500,
    );
  }
}
