
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-slate-50 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">404</p>
      <h1 className="text-2xl font-bold text-navy-900">Page not found</h1>
      <p className="text-sm text-navy-400">The page you're looking for doesn't exist.</p>
      <Link
        href="/dashboard"
        className="mt-4 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}