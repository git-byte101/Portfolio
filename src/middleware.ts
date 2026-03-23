import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

function isAdminSessionValid(request: NextRequest): boolean {
  const expected = process.env.ADMIN_API_TOKEN?.trim() ?? "";
  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value?.trim() ?? "";
  return Boolean(expected) && session === expected;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isLoginPage = pathname === "/admin/login";
  const isAuthenticated = isAdminSessionValid(request);

  if (!isAuthenticated && !isLoginPage) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isLoginPage) {
    const adminUrl = new URL("/admin", request.url);
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
