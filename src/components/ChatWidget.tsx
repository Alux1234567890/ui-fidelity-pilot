import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Search, CalendarDays } from "lucide-react";
import mark from "@/assets/vt-mark.png";
import { useBooking } from "@/components/BookingModal";

const answers: { q: string; a: string }[] = [
  { q: "How is this different from a generic chatbot?", a: "Generic bots follow scripts. A VantageTech agent answers from your own site, FAQs and policies, and hands off to your team when a person is needed." },
  { q: "Does it work with Shopify?", a: "Yes. It works with Shopify, WooCommerce, custom builds and more. It goes live with a single snippet." },
  { q: "How long does setup take?", a: "Most stores are live within a few days. We handle the training and branding; you review and approve." },
  { q: "Which channels are supported?", a: "Website chat, WhatsApp, Instagram and email, all in one inbox." },
];

type Msg = { from: "bot" | "me"; text: string };

export function ChatWidget() {
  const { open: openBooking } = useBooking();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"chat" | "search">("chat");
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: "Hi! I'm the VantageTech assistant. Ask me anything about how we work. 🙂" }]);
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);

  const ask = (q: string) => {
    if (!q.trim()) return;
    const lower = q.toLowerCase();
    const hit = answers.find((x) => x.q.toLowerCase().split(" ").filter((w) => w.length > 4).some((w) => lower.includes(w.replace(/[?]/g, ""))));
    setTab("chat");
    setMsgs((m) => [...m, { from: "me", text: q }]);
    setText("");
    setTimeout(() => setMsgs((m) => [...m, { from: "bot", text: hit ? hit.a : "Good question! The best way to see it in action is a quick demo — tap “Book a demo” below and we'll walk you through it." }]), 600);
  };

  const filtered = answers.filter((x) => x.q.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[min(600px,calc(100vh-8rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border bg-card shadow-lift sm:right-6">
          <div className="bg-primary px-5 pb-5 pt-4 text-primary-foreground">
            <div className="mx-auto flex w-fit rounded-full bg-primary-foreground/10 p-1">
              {(["chat", "search"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${tab === t ? "bg-primary-foreground/20" : "opacity-80 hover:opacity-100"}`}>
                  {t === "chat" ? <MessageCircle className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                  {t === "chat" ? "Messages" : "Questions"}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <img src={mark} alt="" className="h-10 w-10 rounded-full bg-card p-1" />
              <span className="flex items-center gap-1.5 text-sm"><span className="h-2 w-2 rounded-full bg-brand-green" />Typically replies instantly</span>
            </div>
          </div>

          {tab === "chat" ? (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto p-4 text-base">
                {msgs.map((m, i) => (
                  <div key={i} className={`flex ${m.from === "me" ? "justify-end" : ""}`}>
                    <p className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-snug ${m.from === "me" ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-muted text-ink"}`}>{m.text}</p>
                  </div>
                ))}
                {msgs.length === 1 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {answers.slice(1).map((x) => (
                      <button key={x.q} onClick={() => ask(x.q)} className="rounded-full border px-3 py-1.5 text-sm text-ink hover:border-brand-green hover:text-brand-green">{x.q}</button>
                    ))}
                  </div>
                )}
                <div ref={endRef} />
              </div>
              <div className="border-t p-3">
                <button onClick={openBooking} className="mb-2 flex w-full items-center justify-center gap-2 rounded-full bg-brand-green-soft py-2 text-sm font-semibold text-ink hover:text-brand-green">
                  <CalendarDays className="h-4 w-4" /> Book a demo with a human
                </button>
                <form onSubmit={(e) => { e.preventDefault(); ask(text); }} className="flex items-center gap-2 rounded-2xl border px-3 py-2 focus-within:border-brand-green">
                  <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your question…" className="flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted-foreground" aria-label="Your message" />
                  <button type="submit" aria-label="Send" className="text-brand-green"><Send className="h-5 w-5" /></button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center gap-2 rounded-2xl border px-3 py-2.5 focus-within:border-brand-green">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="What are you looking for?" className="flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted-foreground" aria-label="Search questions" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Popular questions</p>
              <div className="mt-3 space-y-2">
                {filtered.map((x) => (
                  <button key={x.q} onClick={() => ask(x.q)} className="block w-full rounded-xl border px-4 py-3 text-left text-base text-ink hover:border-brand-green">{x.q}</button>
                ))}
                {!filtered.length && <p className="text-base">No matches — try the Messages tab.</p>}
              </div>
            </div>
          )}
        </div>
      )}
      <button onClick={() => setOpen(!open)} aria-label={open ? "Close chat" : "Open chat"} className="fixed bottom-5 right-4 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green text-brand-green-foreground shadow-lift transition-transform hover:scale-105 sm:right-6">
        {open ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}
      </button>
    </>
  );
}
