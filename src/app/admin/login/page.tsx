import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_OPTIONS,
  ADMIN_COOKIE_VALUE,
} from "@/lib/admin-auth";

type LoginPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

async function loginAction(formData: FormData) {
  "use server";

  const adminPassword = process.env.ADMIN_PASSWORD;
  const password = String(formData.get("password") ?? "");

  if (!adminPassword || password !== adminPassword) {
    redirect("/admin/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, ADMIN_COOKIE_VALUE, ADMIN_COOKIE_OPTIONS);

  redirect("/admin");
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const hasError = resolvedSearchParams?.error === "1";

  return (
    <main className="min-h-screen bg-[#050506] text-zinc-100">
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
        <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950/95 p-6 shadow-2xl shadow-black/50">
        <Link
          href="/"
          aria-label="Close login modal"
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
        >
          ×
        </Link>

        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400/90">
          Admin Access
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-white">登录管理员后台</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Enter your admin password to continue.
        </p>

        <form action={loginAction} className="mt-6 space-y-4">
          <label className="block text-sm text-zinc-300">
            Password
            <input
              type="password"
              name="password"
              required
              className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none transition-colors focus:border-emerald-500"
              placeholder="••••••••"
            />
          </label>

          {hasError ? (
            <p className="rounded-lg border border-red-500/40 bg-red-950/30 px-3 py-2 text-sm text-red-300">
              Incorrect password
            </p>
          ) : null}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
          >
            Login
          </button>
        </form>
        </div>
      </div>
    </main>
  );
}
