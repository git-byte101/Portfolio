import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  isValidAdminToken,
  requireAdmin,
} from "@/lib/admin-auth";

function sessionCookie(token: string) {
  return {
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  };
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    token?: unknown;
  };
  const token = typeof body.token === "string" ? body.token.trim() : "";

  if (!isValidAdminToken(token)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookie(token));
  return response;
}

export function GET(request: Request) {
  const authError = requireAdmin(request);
  if (authError) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}

export function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
