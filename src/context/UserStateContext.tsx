"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { canonicalBookmarkKey } from "@/lib/bookmarks";

const STORAGE_BOOKMARKS = "niubility-bookmarked-slugs";
const STORAGE_RECENTS = "niubility-recent-slugs";

function readBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_BOOKMARKS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function readRecents(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_RECENTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function normalizeSlugKeys(keys: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const k of keys) {
    const c = canonicalBookmarkKey(k);
    if (!c || seen.has(c)) continue;
    seen.add(c);
    out.push(c);
  }
  return out;
}

type UserStateContextValue = {
  bookmarkedSlugs: string[];
  recentSlugs: string[];
  toggleBookmark: (slug: string) => void;
  addRecent: (slug: string) => void;
  isBookmarked: (slug: string) => boolean;
};

const UserStateContext = createContext<UserStateContextValue | null>(null);

export function UserStateProvider({ children }: { children: React.ReactNode }) {
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>([]);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  useEffect(() => {
    const rawB = readBookmarks();
    const rawR = readRecents();
    const nextB = normalizeSlugKeys(rawB);
    const nextR = normalizeSlugKeys(rawR);
    setBookmarkedSlugs(nextB);
    setRecentSlugs(nextR);
    if (JSON.stringify(rawB) !== JSON.stringify(nextB)) {
      try {
        localStorage.setItem(STORAGE_BOOKMARKS, JSON.stringify(nextB));
      } catch {
        /* ignore */
      }
    }
    if (JSON.stringify(rawR) !== JSON.stringify(nextR)) {
      try {
        localStorage.setItem(STORAGE_RECENTS, JSON.stringify(nextR));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const toggleBookmark = useCallback(
    (slug: string) => {
      const c = canonicalBookmarkKey(slug) ?? slug;
      setBookmarkedSlugs((prev) => {
        const has = prev.includes(c);
        const next = has ? prev.filter((s) => s !== c) : [...prev, c];
        try {
          localStorage.setItem(STORAGE_BOOKMARKS, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [],
  );

  const addRecent = useCallback((slug: string) => {
    const c = canonicalBookmarkKey(slug) ?? slug;
    setRecentSlugs((prev) => {
      const next = [c, ...prev.filter((s) => s !== c)].slice(0, 10);
      try {
        localStorage.setItem(STORAGE_RECENTS, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (slug: string) => {
      const c = canonicalBookmarkKey(slug) ?? slug;
      return bookmarkedSlugs.includes(c);
    },
    [bookmarkedSlugs],
  );

  const value = useMemo(
    () => ({
      bookmarkedSlugs,
      recentSlugs,
      toggleBookmark,
      addRecent,
      isBookmarked,
    }),
    [
      bookmarkedSlugs,
      recentSlugs,
      toggleBookmark,
      addRecent,
      isBookmarked,
    ],
  );

  return (
    <UserStateContext.Provider value={value}>
      {children}
    </UserStateContext.Provider>
  );
}

export function useUserState() {
  const ctx = useContext(UserStateContext);
  if (!ctx) {
    throw new Error("useUserState must be used within UserStateProvider");
  }
  return ctx;
}
