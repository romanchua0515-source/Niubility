import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="flex flex-col items-center text-center">
        <p className="text-8xl font-bold text-zinc-800">404</p>
        <h1 className="mt-4 text-2xl text-zinc-100">Page not found</h1>
        <p className="mt-2 max-w-sm text-center text-zinc-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-emerald-500 px-6 py-2.5 text-zinc-950 transition-colors hover:bg-emerald-400"
          >
            Go Home
          </Link>
          <Link
            href="/categories"
            className="rounded-lg border border-zinc-700 px-6 py-2.5 text-zinc-300 transition-colors hover:border-zinc-500"
          >
            Browse Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
