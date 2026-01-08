import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const KEY = "theme";

function getInitialTheme(): Theme {
  const saved = localStorage.getItem(KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  localStorage.setItem(KEY, theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const t = getInitialTheme();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(t);
    applyTheme(t);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900"
      aria-label="Cambiar tema"
    >
      {theme === "dark" ? "☾ Oscuro" : "☀ Claro"}
    </button>
  );
}
