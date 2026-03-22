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

export async function GET(request: Request) {
  const authGuard = guardAdmin(request);
  if (authGuard) {
    return authGuard;
  }

  const { data, error } = await supabaseAdmin().from("tool_badges").select("*").order("sort_order", { ascending: true });

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
      name: ensureString(payload.name, "name"),
      sort_order: ensureNumber(payload.sortOrder, 1000),
    };

    const { data, error } = await supabaseAdmin().from("tool_badges").insert(entry).select("*").single();

    if (error) {
      return jsonError(error.message, 500);
    }

    revalidateTags(["tool-badges"]);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Invalid payload", 400);
  }
}
