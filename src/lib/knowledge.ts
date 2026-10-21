// VantageTech chatbot knowledge base, chunked by section from the source document.
// Contact details use the canonical addresses (the source PDF contained typos).
export const KNOWLEDGE: { title: string; text: string }[] = [
  { title: "Company overview", text: "VantageTech is an AI customer support platform built for growing B2C/DTC ecommerce brands and online retailers in the USA, UK, and Canada. It combines an AI agent trained on a business's own real content with seamless human live-chat handoff, so customers get instant, accurate answers and a real person whenever a question needs one. VantageTech is a small, founder-led company, not an enterprise vendor. This chatbot is itself a live demonstration of the product." },
  { title: "What VantageTech does", text: "The AI support agent answers customer questions using a business's own real content (product pages, policies, FAQs) rather than a generic script. It hands off to a human when a question genuinely needs one, without the customer repeating themselves. It is branded to match the client's site and voice. It is honest about its limits: if it doesn't know, it says so and offers to connect the customer with a person." },
  { title: "How it works", text: "1. Tell us about your business: product info, policies, and the questions customers actually ask. 2. We set it up, branded to match you: a simple install, live in days, not months. 3. You stay in control: the agent handles repetitive questions; your team handles the rest and can step in on any conversation." },
  { title: "Who we serve / industries", text: "Built for growing B2C/DTC ecommerce brands, not generic enterprise support. Focus industries: apparel and fashion (sizing, returns, restock questions); beauty and cosmetics (shade matching, ingredient questions, order status); home and lifestyle goods (product specs, shipping timelines, care instructions). For industries outside this list: the current focus is DTC/ecommerce, and the best way to find out if it's a fit is to book a demo and ask directly. Don't assume yes or no." },
  { title: "What makes VantageTech different", text: "Trained on real content, not a script. Seamless human handoff: a person picks up the same conversation and the customer never starts over. Fast to launch: live in days once the business's content is in hand. Honest by design: the agent says 'I'm not sure' rather than inventing an answer." },
  { title: "Channels: live vs planned", text: "Answer accurately, don't oversell. Live today: an AI chat widget on the client's own website. On the roadmap, not yet available: WhatsApp, Instagram, and email as connected channels into the same inbox. If a prospect needs one of these now, say plainly 'that's on our roadmap but not live yet' and suggest they mention their timeline on the demo call." },
  { title: "Getting started / booking a demo", text: "No self-serve signup and no public pricing page. To get started, book a free demo call (use the 'Book a call with us' button, or https://calendly.com/ialuko-2203833-stu/30min). On the call, we learn about your business and show our agent answering real questions from your own content, not a canned demo." },
  { title: "Pricing", text: "There is no public price list. Pricing and setup are discussed on the demo call since they depend on the business's size and needs. Never invent a number or range; suggest booking the demo." },
  { title: "FAQ: different from a generic chatbot / doesn't know the answer", text: "It's trained on the business's own real content, not a generic script, and is honest when it doesn't know instead of guessing. When it doesn't know, it says so and hands off to a person or captures the customer's info for follow-up." },
  { title: "FAQ: platforms, setup time, team size", text: "It installs on top of an existing site without a migration or rebuild. Specific platform questions (Shopify, WooCommerce, custom sites) are best confirmed on the demo call. Once VantageTech has the business's content, the agent can be branded and live in days, not months. Built for growing brands and small teams, no heavy IT lift required." },
  { title: "Contact", text: "Email: hello@vantagetech.me. Book a demo: https://calendly.com/ialuko-2203833-stu/30min. Website: vantagetech.me." },
];

const STOP = new Set("the a an and or of to is it in on for with do does i my you your we our can what how are this that be".split(" "));
const words = (s: string) => s.toLowerCase().match(/[a-z0-9]+/g)?.filter((w) => w.length > 2 && !STOP.has(w)) ?? [];

/** Simple keyword retrieval: returns the most relevant sections for a query. */
export function retrieve(query: string, k = 4) {
  const q = new Set(words(query));
  return KNOWLEDGE.map((c) => {
    const w = words(c.title + " " + c.text);
    const score = w.reduce((n, x) => n + (q.has(x) ? 1 : 0), 0) + words(c.title).filter((x) => q.has(x)).length * 2;
    return { c, score };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((x) => x.c);
}
