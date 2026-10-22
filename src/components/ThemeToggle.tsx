import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThemeContext = createContext({ dark: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("vantagetech-theme");
    } catch {
      /* Storage may be unavailable. */
    }
    const apply = (value: boolean) => {
      setDark(value);
      document.documentElement.classList.toggle("dark", value);
    };
    apply(saved === "dark" || (saved !== "light" && media.matches));
    const onChange = (event: MediaQueryListEvent) => {
      if (saved !== "light" && saved !== "dark") apply(event.matches);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key !== "vantagetech-theme") return;
      saved = event.newValue;
      apply(saved === "dark" || (saved !== "light" && media.matches));
    };
    media.addEventListener("change", onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("vantagetech-theme", next ? "dark" : "light");
    } catch {
      /* Keep the switch usable without storage. */
    }
  };

  return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>;
}

export function ThemeToggle() {
  const { dark, toggle } = useContext(ThemeContext);
  const label = dark ? "Switch to light mode" : "Switch to dark mode";
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="shrink-0 text-ink"
    >
      {dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </Button>
  );
}
