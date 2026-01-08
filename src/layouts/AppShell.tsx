import { Outlet, Link } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";

export default function AppShell() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900 dark:bg-slate-100" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Blog</p>
              <p className="text-lg font-semibold leading-5">Challenge Blog</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900"
            >
              Login
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
