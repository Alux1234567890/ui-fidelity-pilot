import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SYSTEM = `You are the VantageTech website assistant. VantageTech is an AI customer support platform for growing DTC brands and online retailers (US, UK, Canada): AI agents trained on a store's real site, FAQs and policies, seamless handoff to human live chat, and one inbox for website, WhatsApp, Instagram and email. Platform-agnostic (Shopify, WooCommerce, custom), live in days via a single snippet, no code. Be warm, concise (2-4 sentences), never robotic. Never invent pricing, stats or guarantees; for pricing or anything you are unsure of, suggest booking a free demo using the "Book a demo with a human" button. Contact: hello@vantagetech.me.`;

const Input = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(2000) })).max(30),
});

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.OPENAI_API_KEY;
    if (!key) return { reply: "Sorry, I'm offline right now — please book a demo and we'll answer you directly." };
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 300,
        messages: [{ role: "system", content: SYSTEM }, ...data.messages],
      }),
    });
    if (!res.ok) {
      console.error("OpenAI error", res.status, await res.text());
      return { reply: "Sorry, I couldn't answer that just now. Try again, or book a demo to talk to our team." };
    }
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return { reply: json.choices?.[0]?.message?.content?.trim() || "Could you rephrase that?" };
  });
