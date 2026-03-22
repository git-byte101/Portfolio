import { NextResponse } from "next/server";

const ADMIN_TOKEN_HEADER = "x-admin-token";

function parseBearerToken(value: string | null): string {
  if (!value) {
    return "";
  }

  const [scheme, token] = value.split(" ");
  if (scheme?.toLowerCase() !== "bearer") {
    return "";
  }

  return token?.trim() ?? "";
}

export function requireAdmin(request: Request): NextResponse | null {
  const expectedToken = process.env.ADMIN_API_TOKEN?.trim() ?? "";

  if (!expectedToken) {
    return NextResponse.json(
      {
        error:
          "ADMIN_API_TOKEN is not configured. Refusing admin write access for safety.",
      },
      { status: 500 },
    );
  }

  const headerToken = request.headers.get(ADMIN_TOKEN_HEADER)?.trim() ?? "";
  const bearerToken = parseBearerToken(request.headers.get("authorization"));
  const providedToken = headerToken || bearerToken;

  if (providedToken !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
