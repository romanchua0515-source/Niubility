import { getAllToolSlugs, getToolDetailBySlug } from "@/lib/api";
import { buildBilingualPageMetadata, truncateMetaDescription } from "@/lib/seo-metadata";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllToolSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolDetailBySlug(slug);
  if (!tool) return { title: "Not found" };

  const enTitle = `${tool.name} — Niubility`;
  const zhName = tool.nameZh || tool.name;
  const zhTitle = `${zhName} — Niubility`;
  const enDescription = truncateMetaDescription(tool.description, 155);
  const zhDescription = tool.descriptionZh || tool.description;

  return buildBilingualPageMetadata({
    path: `/tools/${slug}`,
    enTitle,
    enDescription,
    zhTitle,
    zhDescription,
  });
}

function pricingBadgeClasses(pricing: string): string {
  const p = pricing.trim().toLowerCase();
  if (p === "free" || pricing.trim() === "免费") {
    return "bg-emerald-500/20 text-emerald-400";
  }
  if (p === "freemium") {
    return "bg-blue-500/20 text-blue-400";
  }
  return "bg-zinc-800 text-zinc-400";
}

function getDomain(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = await getToolDetailBySlug(slug);
  if (!tool) notFound();

  const domain = getDomain(tool.url);
  const categorySlug = tool.category;
  const categoryName = tool.subcategory;
  const categoryNameZh = tool.subcategoryZh;

  return (
    <div className="relative min-h-screen bg-[#050506]">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.08),transparent)]"
        aria-hidden
      />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link
          href={`/categories/${categorySlug}`}
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          ← Back to {categoryName}
          {categoryNameZh && categoryNameZh !== categoryName ? (
            <span className="ml-1 text-zinc-600">/ {categoryNameZh}</span>
          ) : null}
        </Link>

        <section className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            {domain ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                alt=""
                width={48}
                height={48}
                className="rounded-xl"
              />
            ) : null}
            <div className="min-w-0">
              <h1 className="text-3xl font-bold text-zinc-100">{tool.name}</h1>
              {tool.nameZh ? (
                <p className="mt-1 text-lg text-zinc-400">{tool.nameZh}</p>
              ) : null}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
                  {categoryName}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${pricingBadgeClasses(tool.pricing)}`}
                >
                  {tool.pricing}
                </span>
              </div>
            </div>
          </div>

          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
          >
            Visit Tool
          </a>
        </section>

        <section className="mt-10">
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            About
          </p>
          <p className="mt-2 leading-relaxed text-zinc-300">
            {tool.description}
          </p>
          {tool.descriptionZh ? (
            <p className="mt-2 text-sm text-zinc-400">{tool.descriptionZh}</p>
          ) : null}
        </section>

        <section className="mt-8">
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            Best for
          </p>
          <p className="mt-2 text-zinc-300">{tool.bestFor}</p>
          {tool.bestForZh ? (
            <p className="mt-2 text-sm text-zinc-400">{tool.bestForZh}</p>
          ) : null}
        </section>

        {tool.tags.length > 0 ? (
          <section className="mt-8">
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <Link
                  key={`${tool.slug}-${tag}`}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {tool.healthStatus !== "unknown" ? (
          <div className="mt-10 flex items-center gap-2 text-xs text-zinc-500">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                tool.healthStatus === "healthy" ? "bg-emerald-500" : "bg-orange-500"
              }`}
              aria-hidden
            />
            <span>
              {tool.healthStatus === "healthy"
                ? "Site verified working"
                : "Site may be unavailable"}
            </span>
          </div>
        ) : null}
      </main>
    </div>
  );
}
