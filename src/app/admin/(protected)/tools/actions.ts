"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase-service";
import { z } from "zod";

const slugSchema = z.string().min(1).max(120);

type ActionResult = { ok: boolean; message: string };

export async function markToolHealthy(slug: string): Promise<ActionResult> {
  const parsed = slugSchema.safeParse(slug);
  if (!parsed.success) return { ok: false, message: "Invalid tool slug." };

  const admin = createServiceClient();
  if (!admin) {
    return {
      ok: false,
      message: "Server is not configured with SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const { error } = await admin
    .from("tools")
    .update({
      health_status: "healthy",
      health_fail_count: 0,
      health_last_checked: new Date().toISOString(),
    })
    .eq("slug", parsed.data);

  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/tools");
  return { ok: true, message: "" };
}

export async function confirmToolDown(slug: string): Promise<ActionResult> {
  const parsed = slugSchema.safeParse(slug);
  if (!parsed.success) return { ok: false, message: "Invalid tool slug." };

  const admin = createServiceClient();
  if (!admin) {
    return {
      ok: false,
      message: "Server is not configured with SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const { error } = await admin
    .from("tools")
    .update({ health_status: "flagged" })
    .eq("slug", parsed.data);

  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/tools");
  return { ok: true, message: "Marked for unpublish — wire up is_active later." };
}
