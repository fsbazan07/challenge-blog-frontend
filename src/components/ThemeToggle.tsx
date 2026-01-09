import { useEffect, useState } from "react";
import { MdLightMode, MdDarkMode } from "react-icons/md";

type Theme = "light" | "dark";
const KEY = "theme";

function getInitialTheme(): Theme {
  // Si llega a renderizar en SSR algún día, evitamos window/localStorage
  if (typeof window === "undefined") return "light";

  const saved = localStorage.getItem(KEY);
  if (saved === "light" || saved === "dark") return saved;

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  localStorage.setItem(KEY, theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  // Aplicar tema cada vez que cambie (incluye el inicial)
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const isDark = theme === "dark";

  function toggle() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Cambiar tema"
      className="
        relative inline-flex h-9 w-16 items-center
        rounded-full border border-border
        bg-muted transition-colors hover:bg-accent
      "
    >
      <span
        className={`
          absolute left-1 flex h-7 w-7 items-center justify-center
          rounded-full bg-background shadow-sm transition-transform
          ${isDark ? "translate-x-7" : "translate-x-0"}
        `}
      >
        {isDark ? (
          <MdDarkMode className="h-4 w-4 text-foreground" />
        ) : (
          <MdLightMode className="h-4 w-4 text-foreground" />
        )}
      </span>
    </button>
  );
}
