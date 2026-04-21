"use client";

import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { loginAction } from "./actions";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      // On success, loginAction() calls redirect("/admin") on the server
      // and the framework performs the navigation. Only the error path
      // resolves with a value here. Do NOT wrap in try/catch — that would
      // swallow the NEXT_REDIRECT signal the framework uses to navigate.
      const result = await loginAction(formData);
      if (result?.status === "error") {
        setError(result.message);
      }
    });
  }

  return (
    <form action={submit} className="mt-6 space-y-4">
      <label className="block text-sm text-zinc-300">
        Password
        <input
          type="password"
          name="password"
          required
          autoFocus
          disabled={isPending}
          className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none transition-colors focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
          placeholder="••••••••"
        />
      </label>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-950/30 px-3 py-2 text-sm text-red-400"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Logging in…
          </>
        ) : (
          "Login"
        )}
      </button>
    </form>
  );
}
