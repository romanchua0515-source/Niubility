"use client";

import { submitToolApplication, type SubmitApplicationState } from "@/app/submit/actions";
import { SUBMIT_MAILTO_HREF } from "@/config/submit-form";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

const initialState: SubmitApplicationState = { ok: null, message: "" };

export type SubmitToolFormProps = {
  captcha: { a: number; b: number; token: string };
};

export function SubmitToolForm({ captcha }: SubmitToolFormProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    submitToolApplication,
    initialState,
  );

  useEffect(() => {
    if (state.ok === true) {
      router.refresh();
    }
  }, [state.ok, router]);

  const captchaLabel = t("submitFormCaptchaPrompt")
    .replace("{{a}}", String(captcha.a))
    .replace("{{b}}", String(captcha.b));

  return (
    <div className="relative rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-emerald-500/[0.08] to-zinc-950/80 p-1 shadow-[0_0_48px_-12px_rgba(16,185,129,0.35)]">
      <div className="rounded-[0.9rem] bg-zinc-950/90 px-6 py-8 sm:px-10 sm:py-10">
        <p className="text-center text-sm leading-relaxed text-zinc-400">
          {t("submitFormIntro")}
        </p>

        <form
          key={captcha.token}
          action={formAction}
          className="mt-8 space-y-5 text-left"
        >
          <input
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
            aria-hidden
          />
          <input type="hidden" name="captcha_token" value={captcha.token} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label
                htmlFor="submit-first-name"
                className="block text-xs font-medium text-zinc-400"
              >
                {t("submitFormFirstName")}
              </label>
              <input
                id="submit-first-name"
                name="first_name"
                required
                maxLength={120}
                autoComplete="given-name"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="submit-last-name"
                className="block text-xs font-medium text-zinc-400"
              >
                {t("submitFormLastName")}
              </label>
              <input
                id="submit-last-name"
                name="last_name"
                required
                maxLength={120}
                autoComplete="family-name"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="submit-email"
              className="block text-xs font-medium text-zinc-400"
            >
              {t("submitFormEmail")}
            </label>
            <input
              id="submit-email"
              name="email"
              type="email"
              required
              maxLength={320}
              autoComplete="email"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="submit-description"
              className="block text-xs font-medium text-zinc-400"
            >
              {t("submitFormDescription")}
            </label>
            <textarea
              id="submit-description"
              name="description"
              required
              rows={5}
              minLength={10}
              maxLength={8000}
              className="w-full resize-y rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
              placeholder="Tool name, URL, category, and why it’s a fit…"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="submit-captcha"
              className="block text-xs font-medium text-zinc-400"
            >
              {captchaLabel}
            </label>
            <input
              id="submit-captcha"
              name="captcha_answer"
              type="text"
              inputMode="numeric"
              required
              autoComplete="off"
              placeholder={t("submitFormCaptchaPlaceholder")}
              className="w-full max-w-[12rem] rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
            />
            <p className="text-[11px] text-zinc-600">
              {t("submitFormCaptchaHint")}
            </p>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-3 py-3">
            <input
              type="checkbox"
              name="privacy_agreed"
              required
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-600 bg-zinc-950 text-emerald-500 focus:ring-emerald-500/40"
            />
            <span className="text-xs leading-relaxed text-zinc-400">
              {t("submitFormPrivacyPrefix")}{" "}
              <Link
                href="/contact"
                className="font-medium text-emerald-400/90 underline decoration-emerald-500/30 underline-offset-2 hover:text-emerald-300"
              >
                {t("submitFormPrivacyLinkLabel")}
              </Link>
              {t("submitFormPrivacySuffix")}
            </span>
          </label>

          {state.ok === false && state.message ? (
            <p className="rounded-lg border border-red-500/35 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {state.message}
            </p>
          ) : null}
          {state.ok === true && state.message ? (
            <p className="rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">
              {state.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-6 py-3.5 text-base font-semibold text-zinc-950 shadow-[0_8px_32px_-8px_rgba(16,185,129,0.55)] transition-[transform,opacity] hover:scale-[1.01] hover:shadow-[0_12px_40px_-8px_rgba(16,185,129,0.65)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? t("submitFormSubmitting") : t("submitFormSubmit")}
          </button>
        </form>

        <p className="mt-5 text-center text-xs leading-relaxed text-zinc-500">
          {t("submitCtaNote")}
        </p>
        <p className="mt-2 text-center text-[11px] text-zinc-600">
          {t("submitFormBackHint")}
        </p>
        <p className="mt-6 border-t border-zinc-800/80 pt-6 text-center text-sm text-zinc-500">
          <a
            href={SUBMIT_MAILTO_HREF}
            className="inline-flex items-center gap-1 font-medium text-emerald-400/90 underline decoration-emerald-500/30 underline-offset-4 transition-colors hover:text-emerald-300 hover:decoration-emerald-400/50"
          >
            {t("submitMailFallback")}
          </a>
        </p>
      </div>
    </div>
  );
}
