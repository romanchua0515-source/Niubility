"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { loginAction } from "./actions";

type FormState =
  | { kind: "idle" }
  | { kind: "error"; message: string }
  | { kind: "success" };

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<FormState>({ kind: "idle" });

  const locked = isPending || state.kind === "success";

  function submit(formData: FormData) {
    setState({ kind: "idle" });
    startTransition(async () => {
      try {
        const result = await loginAction(formData);
        if (result.status === "error") {
          setState({ kind: "error", message: result.message });
          return;
        }
        setState({ kind: "success" });
        // Brief success flash, then navigate. Cookie is already set on the
        // server-action response so middleware will let /admin through.
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 400);
      } catch {
        setState({ kind: "error", message: "Connection failed, try again" });
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
          disabled={locked}
          className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none transition-colors focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
          placeholder="••••••••"
        />
      </label>

      {state.kind === "error" && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-950/30 px-3 py-2 text-sm text-red-400"
        >
          {state.message}
        </p>
      )}
      {state.kind === "success" && (
        <p
          role="status"
          className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-400"
        >
          Success! Redirecting…
        </p>
      )}

      <button
        type="submit"
        disabled={locked}
        aria-busy={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Logging in…
          </>
        ) : state.kind === "success" ? (
          "Redirecting…"
        ) : (
          "Login"
        )}
      </button>
    </form>
  );
}
