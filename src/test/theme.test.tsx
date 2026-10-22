import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, ThemeToggle } from "@/components/ThemeToggle";

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.classList.remove("dark");
  vi.restoreAllMocks();
});

describe("Theme preferences", () => {
  it("keeps a manual choice when the system theme changes", () => {
    let onChange: ((event: MediaQueryListEvent) => void) | undefined;
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: false,
      addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
        onChange = listener;
      },
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(localStorage.getItem("vantagetech-theme")).toBe("dark");
    onChange?.({ matches: false } as MediaQueryListEvent);
    expect(document.documentElement).toHaveClass("dark");
  });

  it("returns to the system preference when storage is cleared in another tab", () => {
    localStorage.setItem("vantagetech-theme", "dark");
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(document.documentElement).toHaveClass("dark");
    fireEvent(window, new StorageEvent("storage", { key: null, newValue: null }));
    expect(document.documentElement).not.toHaveClass("dark");
  });
});
