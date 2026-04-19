/**
 * Re-export static job/careers module data for the category detail page.
 * This data is also seeded into the `job_careers` Supabase table.
 * The component uses the richer module structure (grouped resources)
 * that the flat DB table doesn't provide.
 */
export {
  jobsAndCareersModules,
  jobsAndCareersFeatured,
} from "@/data/job-careers";
