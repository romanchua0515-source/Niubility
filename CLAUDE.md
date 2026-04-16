# Niubility - Project Guidelines & AI Instructions

## 1. Project Overview
Niubility is a premium, dual-language (EN/ZH) Web3 and AI tools aggregator. It focuses on zero-friction user experience, high-converting affiliate routing, and a sleek, dark-mode magazine aesthetic.

## 2. Tech Stack & Core Libraries
- **Framework**: Next.js 16+ (App Router strictly)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS v4 (Dark mode by default, zinc/emerald color palette)
- **Database & Backend**: Supabase (PostgreSQL), `@supabase/supabase-js`
- **Icons**: `lucide-react`
- **Form Handling**: React Server Actions, native `<form>` or `react-hook-form`+`zod`
- **i18n**: Custom lightweight `LanguageContext` (no heavy third-party i18n libs)

## 3. Architecture & Data Flow
- **Public Data**: Fetched server-side from Supabase.
- **User Personalization**: Stored entirely in browser `localStorage` (Bookmarks, Recent views). DO NOT implement user login/auth for public users.
- **Admin Dashboard (`/admin`)**: Protected by Next.js `middleware.ts` checking for a custom password cookie (`ADMIN_PASSWORD` in `.env.local`). Uses `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS for admin operations.
- **Submissions (`/submit`)**: Handled via Server Actions to prevent DB credential leakage. Uses a simple math captcha honeypot.

## 4. Coding Standards (CRITICAL)
- **Server Components First**: Always default to Server Components. Only use `"use client"` when hooks (`useState`, `useEffect`) or browser APIs (`localStorage`, `window`) are strictly required.
- **Tailwind Conventions**: 
  - Backgrounds: `bg-zinc-950`, `bg-zinc-900/50`
  - Text: `text-zinc-100` (primary), `text-zinc-400` (secondary)
  - Accents: `emerald-400` / `emerald-500`
  - Borders: `border-zinc-800/60`
  - Modals: Always use true overlay portals (`fixed inset-0 z-50 backdrop-blur-sm bg-black/80`), never inline accordion expansion.
- **i18n Requirement**: When adding new features or tables, ALWAYS account for bilingual data (e.g., `name` and `name_zh`, `description` and `description_zh`). Components must consume `LanguageContext` and render the correct field dynamically.
- **No Deprecated Code**: Never use `getServerSideProps` or Next.js `Pages Router` paradigms. Do not use generic `<img />`; use `next/image` unless it's a dynamic external cover image where standard `<img>` is cleaner for layouts.

## 5. Workflow Execution
- Read `JARVIS_PROMPT.md` for the current active task.
- Ensure all UI matches the premium, magazine-like "Flipboard" aesthetic before submitting.
- Avoid introducing new `npm` dependencies unless absolutely necessary. Keep the bundle lightweight.