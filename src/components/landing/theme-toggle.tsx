"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark";

const themeStorageKey = "duta-teladan-theme";
const themeEventName = "duta-theme-change";

function getPreferredTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";

  try {
    const stored = window.localStorage.getItem(themeStorageKey);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // storage blocked: fall back to the system preference
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Topstar tokens switch on [data-theme]; the .dark class keeps shadcn's dark: variant in sync.
function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
}

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const isDark = theme === "dark";

  useEffect(() => {
    const syncTheme = () => {
      const current = getPreferredTheme();
      setTheme(current);
      applyTheme(current);
    };

    syncTheme();
    window.addEventListener(themeEventName, syncTheme);

    return () => {
      window.removeEventListener(themeEventName, syncTheme);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = isDark ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
    try {
      window.localStorage.setItem(themeStorageKey, nextTheme);
    } catch {
      // not persisted; the choice still applies for this visit
    }
    window.dispatchEvent(new Event(themeEventName));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn("lp-icon-btn", className)}
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      aria-pressed={isDark}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      )}
    </button>
  );
}
