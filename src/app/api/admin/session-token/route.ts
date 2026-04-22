import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, ADMIN_COOKIE_VALUE } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Hands the already-cookie-authed admin UI a short-lived bearer token so that
 * subsequent API calls (notably the batch import loop) can authenticate via
 * `Authorization: Bearer ...` instead of relying on the cookie.
 *
 * Background: Vercel's edge → function routing was intermittently dropping
 * the admin_auth cookie mid-batch when the request crossed regions (sin1
 * edge → iad1 function), producing random 401s after the first few tools.
 * Headers survive that hop cleanly, so the client caches this token and
 * sends it on every import-tool call.
 *
 * This endpoint is itself cookie-gated — the user must already be logged in
 * when they fetch it. Token == ADMIN_PASSWORD, which is what the import-tool
 * route's bearer branch already checks against, so no new credential is
 * introduced.
 */
export async function GET() {
  const cookieStore = await cookies();
  const auth = cookieStore.get(ADMIN_COOKIE)?.value;
  if (auth !== ADMIN_COOKIE_VALUE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.ADMIN_PASSWORD;
  if (!token) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is not configured on the server" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { token },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
}
