import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight, BookOpen, Users, Inbox, Zap, Globe, MessageCircle, Instagram, Mail,
  Shirt, Sparkles, Home, ShieldCheck, Clock, HeartHandshake, ChevronDown, Menu, X,
} from "lucide-react";
import mark from "@/assets/vt-mark.png";
import { BookingProvider, useBooking } from "@/components/BookingModal";
import { ThemeProvider, ThemeToggle } from "@/components/ThemeToggle";
import { ChatWidget } from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Page,
  head: () => ({
    meta: [
      { title: "VantageTech — AI customer support for DTC brands" },
      { name: "description", content: "An AI agent trained on your real product info, with a real human one tap away. One inbox for web, WhatsApp, Instagram and email." },
      { property: "og:title", content: "VantageTech — AI customer support for DTC brands" },
      { property: "og:description", content: "Customer support that never sleeps — or sounds like a robot. Book a free demo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page() {
  useReveal();
  return (
    <ThemeProvider><BookingProvider>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Capabilities />
        <Channels />
        <HowItWorks />
        <Industries />
        <Trust />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <ChatWidget />
    </BookingProvider></ThemeProvider>
  );
}

function Stats() {
  const items = [
    { k: "24/7", v: "Always-on answers across every channel" },
    { k: "Days", v: "From kickoff to live, not months" },
    { k: "1 tap", v: "To reach a real person on your team" },
    { k: "0 code", v: "A single snippet, branded to your store" },
  ];
  return (
    <section className="border-y bg-card">
      <div className="reveal mx-auto grid max-w-6xl grid-cols-2 gap-px md:grid-cols-4">
        {items.map((s) => (
          <div key={s.k} className="px-5 py-8 text-center">
            <p className="font-display text-3xl font-extrabold text-ink md:text-4xl">{s.k}</p>
            <p className="mt-2 text-sm">{s.v}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("is-visible"), io.unobserve(e.target))),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#top" className={`flex min-w-0 items-center gap-2 ${className}`} aria-label="VantageTech home">
      <img src={mark} alt="" className="h-9 w-9 shrink-0" width={36} height={36} />
      <span className="truncate font-display text-xl font-extrabold text-ink">
        Vantage<span className="text-brand-green">Tech</span>
      </span>
    </a>
  );
}

function DemoButton({ children = "Book a Demo", size = "md" }: { children?: ReactNode; size?: "md" | "lg" }) {
  const { open } = useBooking();
  return (
    <Button
      onClick={open}
      className={`group h-auto max-w-full whitespace-normal inline-flex items-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift ${size === "lg" ? "px-7 py-4 text-lg" : "px-5 py-2.5 text-base"}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Button>
  );
}

const links = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];
function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 py-3">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-base font-medium text-ink transition-colors hover:text-brand-green">{l.label}</a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <ThemeToggle />
          <div className="hidden md:block"><DemoButton /></div>
        </div>
        <button
          className="p-2 text-ink md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav id="mobile-menu" className="border-t px-5 pb-5 md:hidden" aria-label="Mobile navigation">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-3 text-base font-medium text-ink">{l.label}</a>
          ))}
          <div className="pt-2"><DemoButton /></div>
        </nav>
      )}
    </header>
  );
}
}

function Section({ id, children, muted = false }: { id?: string; children: ReactNode; muted?: boolean }) {
  return (
    <section id={id} className={`scroll-mt-20 py-20 md:py-28 ${muted ? "bg-muted" : ""}`}>
      <div className="reveal mx-auto max-w-6xl px-5">{children}</div>
    </section>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-brand-green">{children}</p>;
}

function Hero() {
  return (
    <section id="top" className="hero-glow relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:py-28">
        <div className="reveal min-w-0">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-green-soft px-3 py-1.5 text-sm font-semibold text-ink">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-60" /><span className="relative h-2 w-2 rounded-full bg-brand-green" /></span>
            AI agents + real humans
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.08] md:text-6xl">
            Customer support that never sleeps — <span className="text-brand-green">or sounds like a robot.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed md:text-xl">
            VantageTech gives your store an AI agent trained on your real product info, with a real human always one tap away when it matters.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <DemoButton size="lg">Book a Free Demo</DemoButton>
            <a href="#how" className="text-base font-semibold text-ink underline-offset-4 hover:text-brand-green hover:underline">See how it works</a>
          </div>
        </div>
        <ChatMock />
      </div>
    </section>
  );
}

function ChatMock() {
  return (
    <div className="reveal relative mx-auto w-full max-w-md">
      <div className="rounded-3xl border bg-card p-5 shadow-lift">
        <div className="flex items-center gap-3 border-b pb-4">
          <img src={mark} alt="" className="h-9 w-9 shrink-0" />
          <div>
            <p className="text-base font-semibold text-ink">Northwind Apparel</p>
            <p className="flex items-center gap-1.5 text-sm text-brand-green"><span className="h-2 w-2 rounded-full bg-brand-green" />Online now</p>
          </div>
        </div>
        <div className="space-y-3 py-5 text-base">
          <Bubble me>Does the linen shirt run small? I'm usually a medium.</Bubble>
          <Bubble>It runs true to size — most customers your height pick a medium. Free exchanges within 30 days if it's off. 👕</Bubble>
          <Bubble me>Can I change my delivery address on order #4821?</Bubble>
          <div className="flex items-center gap-2 py-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4 text-brand-green" /> Sam from the team joined the chat
          </div>
          <Bubble human>Hi! Updated it for you — it'll ship to the new address today.</Bubble>
        </div>
        <div className="flex gap-2 border-t pt-4">
          {[Globe, MessageCircle, Instagram, Mail].map((I, i) => (
            <span key={i} className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-ink"><I className="h-4 w-4" /></span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Bubble({ children, me, human }: { children: ReactNode; me?: boolean; human?: boolean }) {
  return (
    <div className={`flex ${me ? "justify-end" : ""}`}>
      <p className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-snug ${me ? "rounded-br-sm bg-primary text-primary-foreground" : human ? "rounded-bl-sm bg-brand-green-soft text-ink" : "rounded-bl-sm bg-muted text-ink"}`}>
        {children}
      </p>
    </div>
  );
}

const features = [
  { icon: BookOpen, title: "Answers from your real content", body: "Trained on your site, FAQs, and policies, not a generic script." },
  { icon: Users, title: "Hands off to a human, seamlessly", body: "When a question needs a person, your team picks up without the customer repeating themselves." },
  { icon: Inbox, title: "One inbox, every channel", body: "Website, WhatsApp, Instagram, email — all in one place." },
  { icon: Zap, title: "Live in days, not months", body: "Set up and branded to match your store, without touching code." },
];

function Capabilities() {
  return (
    <Section id="features">
      <div className="max-w-2xl">
        <Eyebrow>Platform</Eyebrow>
        <h2 className="text-3xl font-bold md:text-5xl">Everything your support team wishes it had.</h2>
      </div>
      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {features.map(({ icon: I, title, body }) => (
          <div key={title} className="rounded-2xl border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-soft">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green-soft text-brand-green"><I className="h-6 w-6" /></span>
            <h3 className="mt-5 text-xl font-bold">{title}</h3>
            <p className="mt-2 text-base leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Channels() {
  const ch = [
    { icon: Globe, label: "Website" },
    { icon: MessageCircle, label: "WhatsApp" },
    { icon: Instagram, label: "Instagram" },
    { icon: Mail, label: "Email" },
  ];
  return (
    <section className="bg-primary py-16 text-primary-foreground">
      <div className="reveal mx-auto flex max-w-6xl flex-col items-center gap-10 px-5 lg:flex-row lg:justify-between">
        <h2 className="text-center text-2xl font-bold text-primary-foreground md:text-left md:text-3xl">
          Works across <span className="text-brand-green">every channel.</span>
        </h2>
        <div className="grid w-full max-w-xl grid-cols-2 gap-4 sm:grid-cols-4">
          {ch.map(({ icon: I, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 min-w-0 rounded-2xl bg-primary-foreground/10 px-3 py-5">
              <I className="h-7 w-7 text-brand-green" />
              <span className="text-base font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { title: "Tell us about your store", body: "We train your agent on your real product and policy info." },
  { title: "We set it up on your site", body: "A single snippet, branded to match you, live in days." },
  { title: "You stay in control", body: "The agent handles the repetitive stuff; your team handles the rest." },
];

function HowItWorks() {
  return (
    <Section id="how" muted>
      <div className="max-w-2xl">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="text-3xl font-bold md:text-5xl">Three steps. No code.</h2>
      </div>
      <ol className="mt-14 grid gap-8 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="relative">
            <span className="font-display text-6xl font-extrabold text-brand-green">0{i + 1}</span>
            <h3 className="mt-3 text-xl font-bold">{s.title}</h3>
            <p className="mt-2 text-base leading-relaxed">{s.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

const industries = [
  { icon: Shirt, title: "Apparel & fashion", body: "Sizing, returns, restock questions, instantly." },
  { icon: Sparkles, title: "Beauty & cosmetics", body: "Shade matching, ingredient questions, order status." },
  { icon: Home, title: "Home & lifestyle goods", body: "Product specs, shipping timelines, care instructions." },
];

function Industries() {
  return (
    <Section>
      <div className="max-w-2xl">
        <Eyebrow>Built for DTC</Eyebrow>
        <h2 className="text-3xl font-bold md:text-5xl">Made for the questions your customers actually ask.</h2>
      </div>
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {industries.map(({ icon: I, title, body }) => (
          <div key={title} className="rounded-2xl bg-primary-soft p-8">
            <I className="h-8 w-8 text-ink" />
            <h3 className="mt-6 text-xl font-bold">{title}</h3>
            <p className="mt-2 text-base leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

const trust = [
  { icon: ShieldCheck, text: "Accurate answers, grounded in what your store actually says." },
  { icon: Clock, text: "From kickoff to live chat in days — no dev sprint required." },
  { icon: HeartHandshake, text: "A real person always backs up the AI, so no customer gets stuck." },
];

function Trust() {
  return (
    <section className="border-y bg-muted py-14">
      <div className="reveal mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-3">
        {trust.map(({ icon: I, text }) => (
          <div key={text} className="flex items-start gap-4">
            <I className="mt-0.5 h-6 w-6 shrink-0 text-brand-green" />
            <p className="text-base font-medium leading-relaxed text-ink">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const faqs = [
  { q: "How is this different from a generic chatbot?", a: "Generic bots follow scripts. Your VantageTech agent answers from your own site, FAQs and policies — and hands off to your team the moment a real person is needed." },
  { q: "Does it work with my existing site/platform?", a: "Yes — it installs on top of your existing site, with no migration or rebuild. Specific platform questions (Shopify, WooCommerce, custom builds) are best confirmed on your demo call." },
  { q: "What happens when it doesn't know the answer?", a: "It says so honestly rather than guessing, then hands the conversation to your team with full context — or captures the customer's details for follow-up." },
  { q: "How long does setup actually take?", a: "Once we have your content, your agent can be branded and live in days — not months." },
  { q: "Is this only for big brands, or does it work for a small team too?", a: "It's built for growing brands, not just large enterprises — no heavy IT lift required to get started." },
  { q: "What channels does it support right now?", a: "A chat widget on your own website is live today. WhatsApp, Instagram and email are on the roadmap but not yet available — tell us your timeline on the demo call." },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="text-3xl font-bold md:text-5xl">Questions, answered.</h2>
        </div>
        <div className="mt-12 divide-y rounded-2xl border">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <Button variant="ghost"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="grid h-auto w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 whitespace-normal rounded-none px-5 py-5 text-left hover:bg-muted"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span className="text-lg font-semibold text-ink">{f.q}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-brand-green transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </Button>
                <div id={`faq-answer-${i}`} aria-hidden={!isOpen} className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-base leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function FinalCta() {
  return (
    <section className="px-5 pb-24">
      <div className="reveal mx-auto max-w-6xl overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center md:py-20">
        <h2 className="mx-auto max-w-3xl text-3xl font-bold text-primary-foreground md:text-5xl">
          See it answer your actual customer questions — <span className="text-brand-green">book a free demo.</span>
        </h2>
        <div className="mt-10 flex justify-center">
          <CtaInverse />
        </div>
      </div>
    </section>
  );
}

function CtaInverse() {
  const { open } = useBooking();
  return (
    <Button onClick={open} className="group h-auto max-w-full whitespace-normal inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-4 text-lg font-semibold text-brand-green-foreground transition-all hover:-translate-y-0.5">
      Book a Free Demo <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
    </Button>
  );
}

function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <a href="mailto:hello@vantagetech.me" className="mt-3 block text-base hover:text-brand-green">hello@vantagetech.me</a>
        </div>
        <div className="flex flex-wrap gap-6 text-base">
          <a href="#" className="hover:text-brand-green">LinkedIn</a>
          <a href="#" className="hover:text-brand-green">X</a>
          <a href="#" className="hover:text-brand-green">Instagram</a>
          <a href="#" className="hover:text-brand-green">Privacy</a>
          <a href="#" className="hover:text-brand-green">Terms</a>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl px-5 text-sm text-muted-foreground">© {new Date().getFullYear()} VantageTech. All rights reserved.</p>
    </footer>
  );
}
