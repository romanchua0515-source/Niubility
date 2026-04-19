import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_CLEAR_OPTIONS,
} from "@/lib/admin-auth";

export async function GET(req: Request) {
  const url = new URL("/", req.url);
  const res = NextResponse.redirect(url);
  res.cookies.set(ADMIN_COOKIE, "", ADMIN_COOKIE_CLEAR_OPTIONS);
  return res;
}
