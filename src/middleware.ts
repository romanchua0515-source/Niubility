import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_COOKIE = "admin_auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const auth = req.cookies.get(ADMIN_COOKIE)?.value;
  if (auth !== "true") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
