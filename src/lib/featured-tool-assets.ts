import type { FeaturedTool } from "@/data/featured-tools";

/** Primary logo URL; falls back to Google favicon service from tool href hostname */
export function featuredToolLogoSrc(tool: FeaturedTool): string {
  if (tool.coverImage) return tool.coverImage;
  try {
    const host = new URL(tool.href).hostname;
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`;
  } catch {
    return "";
  }
}

export function featuredToolFaviconFallback(tool: FeaturedTool): string {
  try {
    const host = new URL(tool.href).hostname;
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`;
  } catch {
    return "";
  }
}
