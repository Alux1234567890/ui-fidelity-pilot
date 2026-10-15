import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";

export const CALENDLY_URL = "https://calendly.com/founder-vantagetech/30min";
const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";

type Ctx = { open: () => void };
const BookingContext = createContext<Ctx>({ open: () => {} });
export const useBooking = () => useContext(BookingContext);

declare global {
  interface Window {
    Calendly?: { initInlineWidget: (o: { url: string; parentElement: HTMLElement }) => void };
  }
}

function loadScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.Calendly) return resolve();
    let s = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (!s) {
      s = document.createElement("script");
      s.src = SCRIPT_SRC;
      s.async = true;
      document.body.appendChild(s);
    }
    s.addEventListener("load", () => resolve(), { once: true });
  });
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const open = useCallback(() => setOpen(true), []);

  useEffect(() => {
    void loadScript();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    loadScript().then(() => {
      const el = widgetRef.current;
      if (el && window.Calendly && !el.querySelector("iframe")) {
        window.Calendly.initInlineWidget({ url: CALENDLY_URL, parentElement: el });
      }
    });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <BookingContext.Provider value={{ open }}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 p-3 backdrop-blur-sm animate-in fade-in"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-title"
        >
          <div
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-card shadow-lift animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 id="booking-title" className="text-lg font-bold">Book a call on Calendly</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-full p-2 text-ink transition-colors hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto">
              <div
                ref={widgetRef}
                className="calendly-inline-widget"
                data-url={CALENDLY_URL}
                style={{ minWidth: "100%", height: 650 }}
              />
            </div>
          </div>
        </div>
      )}
    </BookingContext.Provider>
  );
}
