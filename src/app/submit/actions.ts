"use server";

import { verifyCaptchaToken } from "@/app/submit/captcha";
import { createServiceClient } from "@/lib/supabase-service";
import { z } from "zod";

export type SubmitApplicationState = {
  ok: boolean | null;
  message: string;
};

const schema = z.object({
  first_name: z.string().trim().min(1, "First name is required").max(120),
  last_name: z.string().trim().min(1, "Last name is required").max(120),
  email: z.string().trim().email("Valid email is required").max(320),
  description: z.string().trim().min(10, "Please add a bit more detail").max(8000),
});

export async function submitToolApplication(
  _prev: SubmitApplicationState,
  formData: FormData,
): Promise<SubmitApplicationState> {
  const honeypot = String(formData.get("company_website") ?? "").trim();
  if (honeypot.length > 0) {
    return { ok: true, message: "" };
  }

  const token = String(formData.get("captcha_token") ?? "");
  const captchaAnswer = String(formData.get("captcha_answer") ?? "");
  if (!verifyCaptchaToken(token, captchaAnswer)) {
    return {
      ok: false,
      message: "Captcha incorrect or expired. Please solve the math question again.",
    };
  }

  const privacy = formData.get("privacy_agreed");
  if (privacy !== "on" && privacy !== "true") {
    return {
      ok: false,
      message: "You must agree to the Privacy Policy before submitting.",
    };
  }

  const parsed = schema.safeParse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg =
      Object.values(first).flat()[0] ?? "Please check the form and try again.";
    return { ok: false, message: msg };
  }

  const row = parsed.data;
  const admin = createServiceClient();
  if (!admin) {
    return {
      ok: false,
      message:
        "Server is not configured: set SUPABASE_SERVICE_ROLE_KEY (server env, not NEXT_PUBLIC) so submissions can be saved.",
    };
  }

  const { error } = await admin.from("submissions").insert({
    first_name: row.first_name,
    last_name: row.last_name,
    email: row.email,
    description: row.description,
    status: "pending",
  });

  if (error) {
    return {
      ok: false,
      message:
        error.message ||
        "Could not save your submission. Check the database and service role key.",
    };
  }

  return {
    ok: true,
    message: "Thanks — we received your submission and will review it soon.",
  };
}
