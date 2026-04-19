"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

function linkActive(href: string, pathname: string): boolean {
  if (href === "/admin") {
    return pathname === "/admin" || pathname === "/admin/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNavLinks() {
  const pathname = usePathname() ?? "";

  return (
    <>
      {navItems.map((item) => {
        const active = linkActive(item.href, pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? "block rounded-r-lg border-l-2 border-emerald-400 bg-emerald-500/10 py-2 pl-3 pr-3 text-sm font-medium text-emerald-400"
                : "block rounded-lg border-l-2 border-transparent py-2 pl-3 pr-3 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
