import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_COOKIE_VALUE } from "@/lib/admin-auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const addNoCacheHeaders = (response: NextResponse) => {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  };

  if (pathname === "/admin/login") {
    return addNoCacheHeaders(NextResponse.next());
  }

  const auth = req.cookies.get(ADMIN_COOKIE)?.value;
  if (auth !== ADMIN_COOKIE_VALUE) {
    return addNoCacheHeaders(
      NextResponse.redirect(new URL("/admin/login", req.url))
    );
  }

  return addNoCacheHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/admin/:path*"],
};
