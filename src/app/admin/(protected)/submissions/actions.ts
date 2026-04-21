"use server";

import { createServiceClient } from "@/lib/supabase-service";
import { z } from "zod";

const statusSchema = z.enum(["pending", "reviewed", "approved"]);

export async function updateSubmissionStatus(
  id: string,
  status: z.infer<typeof statusSchema>,
): Promise<{ ok: boolean; message: string }> {
  const idParsed = z.string().uuid().safeParse(id);
  const st = statusSchema.safeParse(status);
  if (!idParsed.success || !st.success) {
    return { ok: false, message: "Invalid request." };
  }

  const admin = createServiceClient();
  if (!admin) {
    return {
      ok: false,
      message: "Server is not configured with SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const { error } = await admin
    .from("submissions")
    .update({ status: st.data })
    .eq("id", idParsed.data);

  if (error) {
    return { ok: false, message: error.message };
  }
  return { ok: true, message: "" };
}
