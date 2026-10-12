import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { KNOWLEDGE, retrieve } from "./knowledge";

const RULES = `You are the VantageTech website assistant, a live demo of VantageTech's product. Answer ONLY from the CONTEXT sections provided. Be warm, concise (2-4 short sentences), plain language, never robotic. If the context doesn't cover the question, say honestly you're not sure and suggest booking a free demo. Never invent prices, stats, integrations or timelines. Be accurate about channels: only the website chat widget is live; WhatsApp, Instagram and email are on the roadmap. When relevant (pricing, fit, platforms, getting started), point to the "Book a demo with a human" button below the chat.`;

const Input = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(2000) })).min(1).max(30),
});

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { reply: "I'm offline right now — please book a demo and we'll answer you directly." };

    const lastUser = [...data.messages].reverse().find((m) => m.role === "user")?.content ?? "";
    const prevUser = data.messages.filter((m) => m.role === "user").slice(-2, -1)[0]?.content ?? "";
    const chunks = retrieve(`${lastUser} ${prevUser}`);
    const context = (chunks.length ? chunks : KNOWLEDGE.slice(0, 3)).map((c) => `## ${c.title}\n${c.text}`).join("\n\n");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "fetch", "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        instructions: `${RULES}\n\nCONTEXT:\n${context}`,
        input: data.messages.map((m) => ({ role: m.role, content: m.content })),
        reasoning: { effort: "low" },
        max_output_tokens: 1200,
        store: false,
        stream: true,
      }),
    });

    if (!res.ok || !res.body) {
      console.error("AI Gateway error", res.status, await res.text().catch(() => ""));
      if (res.status === 429) return { reply: "Lots of questions right now — please try again in a moment." };
      return { reply: "Sorry, I couldn't answer that just now. You can book a demo to talk to our team directly." };
    }

    // Consume the SSE stream server-side and return the final text.
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    let out = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const ev = JSON.parse(payload) as { type?: string; delta?: string };
          if (ev.type === "response.output_text.delta" && ev.delta) out += ev.delta;
        } catch { /* partial frame */ }
      }
    }
    return { reply: out.trim() || "I'm not sure about that one — booking a quick demo is the best way to get an answer." };
  });
