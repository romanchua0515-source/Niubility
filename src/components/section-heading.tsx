import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  /** Tighter spacing and smaller type for hub-style layouts */
  compact?: boolean;
  action?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  compact = false,
  action,
}: SectionHeadingProps) {
  const wrap = compact ? "mb-5" : "mb-10";
  const titleCls = compact
    ? "text-lg font-semibold tracking-tight text-zinc-100 sm:text-xl"
    : "text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl";
  const eyebrowCls = compact
    ? "text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400/85"
    : "text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400/85";
  const descCls = compact
    ? "text-xs leading-relaxed text-zinc-500 sm:text-sm"
    : "text-sm leading-relaxed text-zinc-500 sm:text-base";

  if (action) {
    return (
      <div
        className={`flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${wrap} max-w-none`}
      >
        <div
          className={`min-w-0 max-w-2xl space-y-1.5 ${align === "center" ? "mx-auto text-center sm:mx-0 sm:text-left" : ""}`}
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
      className={`${wrap} max-w-2xl space-y-2 ${align === "center" ? "mx-auto text-center" : ""} ${compact ? "space-y-1.5" : "space-y-3"}`}
    >
      <p className={eyebrowCls}>{eyebrow}</p>
      <h2 className={titleCls}>{title}</h2>
      {description ? <p className={descCls}>{description}</p> : null}
    </div>
  );
}
