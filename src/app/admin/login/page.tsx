import Link from "next/link";
import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
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
          <h1 className="mt-2 text-2xl font-semibold text-white">
            登录管理员后台
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Enter your admin password to continue.
          </p>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
