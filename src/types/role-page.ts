/**
 * Content model for curated role pages (second-level hub templates).
 */

export type RoleQuickLink = {
  label: string;
  href: string;
  hint?: string;
  labelZh?: string;
  hintZh?: string;
};

/** One tool row inside a scenario group */
export type RoleScenarioTool = {
  name: string;
  url: string;
  /** One-line purpose */
  purpose: string;
  /** Optional label e.g. “Analytics”, “Quest” */
  tag?: string;
  purposeZh?: string;
  tagZh?: string;
};

/** Tools grouped by how this role spends time day-to-day */
export type RoleToolGroup = {
  id: string;
  title: string;
  titleZh?: string;
  tools: RoleScenarioTool[];
};

export type RoleReadingKind =
  | "Docs"
  | "Newsletter"
  | "Guide"
  | "Forum"
  | "Framework"
  | "Case study";

export type RoleReadingItem = {
  title: string;
  url: string;
  kind: RoleReadingKind;
  note: string;
  titleZh?: string;
  noteZh?: string;
  /** Display label for the kind badge when UI language is Chinese */
  kindZh?: string;
};

/** Operators, writers, or teams worth following for frameworks & case studies */
export type RoleLearnFrom = {
  name: string;
  url: string;
  /** What they publish or why they matter */
  note: string;
  kind?: "Operator" | "Writer" | "Newsletter" | "Collective" | "Fund";
  noteZh?: string;
  kindZh?: string;
};

/** Curated sections for a role; base title/icon come from @/data/roles */
export type RolePageDetail = {
  slug: string;
  /** Hero body copy (curated; not the short card blurb from roles.ts) */
  lede: string;
  ledeZh?: string;
  quickStart: RoleQuickLink[];
  /** Recommended tools by daily work scenario */
  toolGroups: RoleToolGroup[];
  reading: RoleReadingItem[];
  /** People, newsletters, or orgs to learn patterns from */
  learnFrom: RoleLearnFrom[];
  relatedCategorySlugs: string[];
};
