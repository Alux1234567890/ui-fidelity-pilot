import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
  return new Promise((resolve, reject) => {
    if (window.Calendly) return resolve();
    let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
    const element = script;
    element.addEventListener("load", () => resolve(), { once: true });
    element.addEventListener("error", () => { element.remove(); reject(new Error("Calendar unavailable")); }, { once: true });
  });
}
export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const open = useCallback(() => setOpen(true), []);
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setFailed(false);
    loadScript().then(() => {
      if (cancelled) return;
      const element = widgetRef.current;
      if (element && window.Calendly && !element.querySelector("iframe")) {
        window.Calendly.initInlineWidget({ url: CALENDLY_URL, parentElement: element });
      }
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [isOpen]);
  return (
    <BookingContext.Provider value={{ open }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent className="z-[60] flex max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-3xl flex-col gap-0 overflow-hidden rounded-2xl bg-card p-0 shadow-lift">
          <div className="shrink-0 border-b px-5 py-5 pr-14">
            <DialogTitle className="text-lg leading-snug font-bold">Book a call with us</DialogTitle>
            <DialogDescription className="sr-only">Choose a time for your free VantageTech demo on Calendly.</DialogDescription>
          </div>
          <div className="min-h-0 overflow-y-auto overscroll-contain">
            {failed && <div className="p-6 text-center"><p>We couldn't load the calendar here.</p><Button asChild variant="outline" className="mt-4"><a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a call with us<span className="sr-only"> on Calendly in a new tab</span></a></Button></div>}
            <div ref={widgetRef} className="calendly-inline-widget h-[650px] min-w-0" data-url={CALENDLY_URL} />
          </div>
        </DialogContent>
      </Dialog>
    </BookingContext.Provider>
  );
}
