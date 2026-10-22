import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThemeContext = createContext({ dark: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  const savedPreference = useRef<string | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    try {
      savedPreference.current = localStorage.getItem("vantagetech-theme");
    } catch {
      /* Storage may be unavailable. */
    }
    const apply = (value: boolean) => {
      setDark(value);
      document.documentElement.classList.toggle("dark", value);
    };
    const applyPreference = () => {
      const saved = savedPreference.current;
      apply(saved === "dark" || (saved !== "light" && media.matches));
    };
    applyPreference();
    const onChange = (event: MediaQueryListEvent) => {
      if (savedPreference.current !== "light" && savedPreference.current !== "dark")
        apply(event.matches);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key !== "vantagetech-theme" && event.key !== null) return;
      savedPreference.current = event.newValue;
      applyPreference();
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
    savedPreference.current = next ? "dark" : "light";
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
