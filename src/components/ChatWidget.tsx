import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Search, CalendarDays } from "lucide-react";
import mark from "@/assets/vt-mark.png";
import { useBooking } from "@/components/BookingModal";
import { askAssistant } from "@/lib/chat.functions";
import { Button } from "@/components/ui/button";
import { useServerFn } from "@tanstack/react-start";

const answers: { q: string; a: string }[] = [
  { q: "How is this different from a generic chatbot?", a: "Generic bots follow scripts. A VantageTech agent answers from your own site, FAQs and policies, and hands off to your team when a person is needed." },
  { q: "Does it work with Shopify?", a: "" },
  { q: "How long does setup take?", a: "" },
  { q: "Which channels are supported?", a: "" },
  { q: "How much does it cost?", a: "" },
];

type Msg = { from: "bot" | "me"; text: string };

export function ChatWidget() {
  const { open: openBooking } = useBooking();
  const askTeam = useServerFn(askAssistant);
  const [open, setOpen] = useState(false);
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const [tab, setTab] = useState<"chat" | "search">("chat");
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: "Hi there! Welcome to VantageTech. I'm our AI assistant — what would you like to know about how we can help your store?" }]);
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = endRef.current?.parentElement;
    container?.scrollTo({ top: container.scrollHeight, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }, [msgs]);

  const [busy, setBusy] = useState(false);
  const ask = async (q: string) => {
    if (!q.trim() || busy) return;
    const next: Msg[] = [...msgs, { from: "me", text: q.trim().slice(0, 2000) }];
    setTab("chat");
    setMsgs([...next, { from: "bot", text: "…" }]);
    setText("");
    setBusy(true);
    try {
      const { reply } = await askTeam({
        data: { messages: next.slice(1).slice(-30).map((m) => ({ role: m.from === "me" ? "user" : "assistant", content: m.text })) },
      });
      setMsgs([...next, { from: "bot", text: reply }]);
    } catch {
      setMsgs([...next, { from: "bot", text: "Sorry, we couldn't get an answer through just now. Please try again, or book a call with us." }]);
    } finally {
      setBusy(false);
    }
  };

  const filtered = answers.filter((x) => x.q.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      {!open && !welcomeDismissed && (
        <div className="fixed bottom-[6.5rem] right-6 z-[55] flex max-w-[calc(100vw-3rem)] items-center gap-1 rounded-3xl border bg-card p-2 text-card-foreground shadow-soft motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 sm:right-8">
          <span aria-hidden="true" className="absolute -bottom-1.5 right-5 h-3 w-3 rotate-45 border-b border-r bg-card" />
          <Button
            variant="ghost"
            onClick={() => { setWelcomeDismissed(true); setOpen(true); }}
            className="relative h-auto whitespace-normal rounded-2xl px-3 py-2 text-left text-sm text-ink hover:bg-muted"
          >
            How can I assist you today?
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setWelcomeDismissed(true)}
            aria-label="Dismiss welcome message"
            title="Dismiss welcome message"
            className="relative h-7 w-7 shrink-0 rounded-full text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {open && (
        <div role="dialog" aria-label="VantageTech chat" className="fixed bottom-24 right-4 z-[55] flex h-[min(600px,calc(100dvh-8rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border bg-card shadow-lift sm:right-6">
          <div className="bg-primary px-5 pb-5 pt-4 text-primary-foreground">
            <div className="mx-auto flex w-fit rounded-full bg-primary-foreground/10 p-1" role="tablist">
              {(["chat", "search"] as const).map((t) => (
                <Button variant="ghost" key={t} onClick={() => setTab(t)} role="tab" aria-selected={tab === t} aria-pressed={tab === t} className={`h-auto rounded-full px-4 py-1.5 text-sm font-semibold hover:bg-primary-foreground/20 hover:text-primary-foreground ${tab === t ? "bg-primary-foreground/20" : "opacity-80 hover:opacity-100"}`}>
                  {t === "chat" ? <MessageCircle className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                  {t === "chat" ? "Messages" : "Questions"}
                </Button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <img src={mark} alt="" className="h-10 w-10 rounded-full bg-card p-1" />
              <span className="flex items-center gap-1.5 text-sm"><span className="h-2 w-2 rounded-full bg-brand-green" />Typically replies instantly</span>
            </div>
          </div>

          {tab === "chat" ? (
            <>
              <div aria-live="polite" aria-busy={busy} className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-4 text-base">
                {msgs.map((m, i) => (
                  <div key={i} className={`flex ${m.from === "me" ? "justify-end" : ""}`}>
                    <p className={`max-w-[85%] break-words [overflow-wrap:anywhere] rounded-2xl px-4 py-2.5 leading-snug ${m.from === "me" ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-muted text-ink"}`}>{m.text}</p>
                  </div>
                ))}
                {msgs.length === 1 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {answers.slice(1).map((x) => (
                      <Button variant="outline" key={x.q} onClick={() => ask(x.q)} disabled={busy} className="h-auto whitespace-normal rounded-full px-3 py-1.5 text-left text-sm text-ink hover:border-brand-green hover:text-brand-green">{x.q}</Button>
                    ))}
                  </div>
                )}
                <div ref={endRef} />
              </div>
              <div className="shrink-0 border-t p-3">
                <Button variant="ghost" onClick={() => { setOpen(false); openBooking(); }} className="mb-2 h-auto w-full whitespace-normal rounded-full bg-brand-green-soft py-2 text-sm font-semibold text-ink hover:text-brand-green">
                  <CalendarDays className="h-4 w-4" /> Book a call with us
                </Button>
                <form onSubmit={(e) => { e.preventDefault(); ask(text); }} className="flex items-center gap-2 rounded-2xl border px-3 py-2 focus-within:border-brand-green">
                  <input value={text} maxLength={2000} onChange={(e) => setText(e.target.value)} placeholder="Type your question…" className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted-foreground" aria-label="Your message" />
                  <Button variant="ghost" size="icon" type="submit" aria-label="Send" disabled={busy || !text.trim()} className="shrink-0 text-brand-green"><Send className="h-5 w-5" /></Button>
                </form>
              </div>
            </>
          ) : (
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
              <div className="flex items-center gap-2 rounded-2xl border px-3 py-2.5 focus-within:border-brand-green">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="What are you looking for?" className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted-foreground" aria-label="Search questions" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Popular questions</p>
              <div className="mt-3 space-y-2">
                {filtered.map((x) => (
                  <Button variant="outline" key={x.q} disabled={busy} onClick={() => ask(x.q)} className="h-auto w-full justify-start whitespace-normal rounded-xl px-4 py-3 text-left text-base text-ink hover:border-brand-green">{x.q}</Button>
                ))}
                {!filtered.length && <p className="text-base">No matches — try the Messages tab.</p>}
              </div>
            </div>
          )}
        </div>
      )}
      <Button onClick={() => { setWelcomeDismissed(true); setOpen(!open); }} aria-label={open ? "Close chat" : "Open chat"} className="fixed bottom-5 right-4 z-[55] flex h-16 w-16 items-center justify-center rounded-full bg-brand-green text-brand-green-foreground shadow-lift transition-transform hover:bg-brand-green/90 hover:scale-105 [&_svg]:size-7 sm:right-6">
        {open ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}
      </Button>
    </>
  );
}
