import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_COOKIE_VALUE } from "@/lib/admin-auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const allCookies = req.cookies.getAll().map(c => c.name).join(",");
  const authCookie = req.cookies.get(ADMIN_COOKIE)?.value ?? "MISSING";

  const addDiagHeaders = (response: NextResponse) => {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    response.headers.set("X-MW-Ran", "yes");
    response.headers.set("X-MW-Path", pathname);
    response.headers.set("X-MW-All-Cookies", allCookies || "none");
    response.headers.set("X-MW-Auth-Cookie", authCookie);
    return response;
  };

  if (pathname === "/admin/login") {
    return addDiagHeaders(NextResponse.next());
  }

  if (authCookie !== ADMIN_COOKIE_VALUE) {
    const response = NextResponse.redirect(new URL("/admin/login", req.url));
    return addDiagHeaders(response);
  }

  return addDiagHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/admin/:path*"],
};
