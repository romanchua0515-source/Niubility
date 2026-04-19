import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  /** Tighter spacing and smaller type for hub-style layouts */
  compact?: boolean;
  /** Homepage section rhythm (label / title / subtitle spacing) */
  home?: boolean;
  action?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  compact = false,
  home = false,
  action,
}: SectionHeadingProps) {
  const wrap = home ? "" : compact ? "mb-6" : "mb-8";
  const titleCls = home
    ? "mb-1 text-2xl font-bold text-zinc-100"
    : compact
      ? "text-lg font-semibold tracking-tight text-zinc-100 sm:text-xl"
      : "text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl";
  const eyebrowCls = home
    ? "mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-400"
    : compact
      ? "text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400/85"
      : "text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400/85";
  const descCls = home
    ? "mb-8 text-sm text-zinc-400"
    : compact
      ? "text-xs leading-relaxed text-zinc-400 sm:text-sm"
      : "text-sm leading-relaxed text-zinc-400 sm:text-base";

  if (action) {
    return (
      <div
        className={`flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${wrap} max-w-none`}
      >
        <div
          className={`min-w-0 max-w-2xl ${home ? "space-y-0" : "space-y-1.5"} ${align === "center" ? "mx-auto text-center sm:mx-0 sm:text-left" : ""}`}
        >
          <p className={eyebrowCls}>{eyebrow}</p>
          <h2 className={titleCls}>{title}</h2>
          {description ? <p className={descCls}>{description}</p> : null}
        </div>
        <div className="shrink-0">{action}</div>
      </div>
    );
  }

  return (
    <div
      className={`${wrap} max-w-2xl ${home ? "space-y-0" : compact ? "space-y-1.5" : "space-y-3"} ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      <p className={eyebrowCls}>{eyebrow}</p>
      <h2 className={titleCls}>{title}</h2>
      {description ? <p className={descCls}>{description}</p> : null}
    </div>
  );
}
