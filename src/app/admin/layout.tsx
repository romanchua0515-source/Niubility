import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/submissions", label: "Submissions / 合作请求" },
  { href: "/admin/tools", label: "Tools (网址列表)" },
  { href: "/admin/categories", label: "Categories (分类管理)" },
  { href: "/admin/banners", label: "Banners (轮播推荐)" },
  { href: "/admin/signals", label: "Signals (热点信号)" },
  { href: "/admin/roles", label: "Roles (角色页)" },
  { href: "/admin/careers", label: "Careers (职位资源)" },
  { href: "/admin/people", label: "People (人物库)" },
  { href: "/admin/guides", label: "Guides (指南内容)" },
] as const;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050506] text-zinc-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-shrink-0 border-r border-zinc-800/80 bg-zinc-950/95 px-4 py-6 sm:flex sm:flex-col">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400/20 to-violet-500/20 ring-1 ring-white/10">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.65)]" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400/90">
                  Admin
                </p>
                <p className="text-xs text-zinc-400">Niubility Console</p>
              </div>
            </div>
          </div>
          <nav className="mt-6 flex-1 space-y-1 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-emerald-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 border-t border-zinc-800/80 pt-4">
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2 text-xs font-medium text-zinc-200 transition-colors hover:border-emerald-500/40 hover:bg-zinc-900 hover:text-emerald-300"
            >
              Return to Site
            </Link>
            <Link
              href="/admin/logout"
              className="mt-2 inline-flex w-full items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:border-red-500/60 hover:text-red-200"
            >
              Logout / 登出
            </Link>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/95 px-4 py-3 sm:hidden">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400/90">
                Admin
              </p>
              <p className="text-xs text-zinc-400">Niubility Console</p>
            </div>
            <Link
              href="/"
              className="rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
            >
              Return
            </Link>
          </header>
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

