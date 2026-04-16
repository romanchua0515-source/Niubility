import { NextResponse } from "next/server";

const ADMIN_COOKIE = "admin_auth";

export async function GET(req: Request) {
  const url = new URL("/", req.url);
  const res = NextResponse.redirect(url);
  res.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}

