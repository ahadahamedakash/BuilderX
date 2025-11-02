import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const publicRoutes = ["/login", "/signup"];
const protectedRoutes = ["/"];

export default async function proxy(req: NextRequest) {
  const { pathname } = new URL(req.url);

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images")
  ) {
    return NextResponse.next();
  }

  // Allow public pages
  if (publicRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Check if route requires auth
  const needsAuth = protectedRoutes.some((r) => pathname.startsWith(r));
  if (!needsAuth) return NextResponse.next();

  // Read cookie
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
