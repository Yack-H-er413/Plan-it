"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "planit_theme";

type Theme = "light" | "dark";

function getThemeFromDom(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeToggle({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const [theme, setTheme] = React.useState<Theme>("light");

  React.useEffect(() => {
    setTheme(getThemeFromDom());

    // Keep state in sync if something else toggles the class.
    const observer = new MutationObserver(() => setTheme(getThemeFromDom()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const toggle = React.useCallback(() => {
    const next: Theme = getThemeFromDom() === "dark" ? "light" : "dark";
    if (next === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
    setTheme(next);
  }, []);

  const isDark = theme === "dark";

  return (
    <Button
      variant="secondary"
      size={size}
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
