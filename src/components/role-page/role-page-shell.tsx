import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type RolePageShellProps = {
  children: ReactNode;
};

export function RolePageShell({ children }: RolePageShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#050506]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_70%_40%_at_50%_-10%,rgba(16,185,129,0.09),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_45%_30%_at_100%_0%,rgba(139,92,246,0.05),transparent)]"
        aria-hidden
      />
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
