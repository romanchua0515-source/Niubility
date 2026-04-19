"use server";

import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_OPTIONS,
  ADMIN_COOKIE_VALUE,
} from "@/lib/admin-auth";

export type LoginResult =
  | { status: "success" }
  | { status: "error"; message: string };

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const password = String(formData.get("password") ?? "");

  if (!adminPassword) {
    return {
      status: "error",
      message: "Server is missing ADMIN_PASSWORD configuration",
    };
  }
  if (password !== adminPassword) {
    return { status: "error", message: "Incorrect password" };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, ADMIN_COOKIE_VALUE, ADMIN_COOKIE_OPTIONS);

  return { status: "success" };
}
