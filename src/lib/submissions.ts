import { cache } from "react";
import { createServiceClient } from "@/lib/supabase-service";

export type SubmissionRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  description: string;
  status: "pending" | "reviewed" | "approved";
  created_at: string;
};

async function loadSubmissions(): Promise<SubmissionRow[]> {
  const admin = createServiceClient();
  if (!admin) return [];
  const { data, error } = await admin
    .from("submissions")
    .select("id, first_name, last_name, email, description, status, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as SubmissionRow[];
}

export const getSubmissions = cache(loadSubmissions);
