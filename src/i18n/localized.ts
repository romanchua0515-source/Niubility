import type { Lang } from "@/i18n/dictionary";
import type {
  Category,
  ExploreCategory,
  HotItem,
  QuickPick,
  Role,
  TopSearchTerm,
} from "@/types/data";
import type {
  RoleLearnFrom,
  RolePageDetail,
  RoleQuickLink,
  RoleReadingItem,
  RoleScenarioTool,
  RoleToolGroup,
} from "@/types/role-page";

export function exploreCategoryText(group: ExploreCategory, lang: Lang) {
  return {
    title: lang === "zh" ? group.titleZh : group.title,
    description: lang === "zh" ? group.descriptionZh : group.description,
  };
}

export function exploreSubcategoryLabel(
  sub: { name: string; nameZh: string },
  lang: Lang,
): string {
  return lang === "zh" ? sub.nameZh : sub.name;
}

export function categoryText(category: Category, lang: Lang) {
  return {
    title:
      lang === "zh" && category.titleZh ? category.titleZh : category.title,
    description:
      lang === "zh" && category.descriptionZh
        ? category.descriptionZh
        : category.description,
  };
}

export function roleText(role: Role, lang: Lang) {
  return {
    title: lang === "zh" && role.titleZh ? role.titleZh : role.title,
    description:
      lang === "zh" && role.descriptionZh ? role.descriptionZh : role.description,
  };
}

export function rolePageLede(detail: RolePageDetail, lang: Lang): string {
  return lang === "zh" && detail.ledeZh ? detail.ledeZh : detail.lede;
}

export function roleQuickLinkText(link: RoleQuickLink, lang: Lang) {
  return {
    label: lang === "zh" && link.labelZh ? link.labelZh : link.label,
    hint:
      link.hint === undefined
        ? undefined
        : lang === "zh" && link.hintZh
          ? link.hintZh
          : link.hint,
  };
}

export function roleToolGroupTitle(group: RoleToolGroup, lang: Lang): string {
  return lang === "zh" && group.titleZh ? group.titleZh : group.title;
}

export function roleScenarioToolText(tool: RoleScenarioTool, lang: Lang) {
  return {
    purpose: lang === "zh" && tool.purposeZh ? tool.purposeZh : tool.purpose,
    tag:
      tool.tag === undefined
        ? undefined
        : lang === "zh" && tool.tagZh
          ? tool.tagZh
          : tool.tag,
  };
}

export function roleReadingItemText(item: RoleReadingItem, lang: Lang) {
  return {
    title: lang === "zh" && item.titleZh ? item.titleZh : item.title,
    note: lang === "zh" && item.noteZh ? item.noteZh : item.note,
    kind: lang === "zh" && item.kindZh ? item.kindZh : item.kind,
  };
}

export function roleLearnFromText(person: RoleLearnFrom, lang: Lang) {
  return {
    note: lang === "zh" && person.noteZh ? person.noteZh : person.note,
    kind:
      person.kind === undefined
        ? undefined
        : lang === "zh" && person.kindZh
          ? person.kindZh
          : person.kind,
  };
}

export function hotItemText(item: HotItem, lang: Lang) {
  return {
    title: lang === "zh" && item.titleZh ? item.titleZh : item.title,
    context:
      lang === "zh" && item.contextZh ? item.contextZh : item.context,
  };
}

export function quickPickText(pick: QuickPick, lang: Lang) {
  return {
    title: lang === "zh" && pick.titleZh ? pick.titleZh : pick.title,
    subtitle:
      lang === "zh" && pick.subtitleZh ? pick.subtitleZh : pick.subtitle,
  };
}

export function topSearchLabel(term: TopSearchTerm, lang: Lang): string {
  if (lang === "zh" && term.labelZh) return term.labelZh;
  return term.label;
}
