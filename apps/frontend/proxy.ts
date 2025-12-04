import { NextRequest, NextResponse } from "next/server";

// Decode JWT payload without verification (verification happens on backend)
function decodeJWT(
  token: string
): { userId: string; email: string; role?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8")
    );
    return payload;
  } catch {
    return null;
  }
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get token from httpOnly cookie
  const token = req.cookies.get("token")?.value;

  // Authentication and authorization checks
  if (pathname.startsWith("/login") && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      // Decode JWT to get user information
      const payload = decodeJWT(token);

      if (!payload) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      // Role-based access control for specific routes
      const protectedRoutes = {
        "/dashboard/users": ["ADMIN", "EXAMINER"],
        "/dashboard/groups": ["ADMIN", "EXAMINER"],
      };

      for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
        if (pathname.startsWith(route)) {
          if (!payload.role || !allowedRoles.includes(payload.role)) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
          }
        }
      }
    } catch (error) {
      // If token parsing fails, redirect to login
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
}
