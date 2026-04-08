import prisma from "@/lib/prisma";
import { openai, CHAT_MODEL } from "@/lib/openai";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

async function buildSystemPrompt() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const productLines = products.map((p) => {
    const desc = stripHtml(p.description).slice(0, 120);
    const cat = p.category?.name ?? "Uncategorized";
    const stock = p.stock > 0 ? `${p.stock} in stock` : "out of stock";
    return `- ${p.name} (slug: ${p.slug}) — ৳${p.price} — ${cat} — ${stock}. ${desc}`;
  });

  const categoryLine =
    categories.length > 0
      ? categories.map((c) => c.name).join(", ")
      : "(no categories yet)";

  return `You are the friendly shopping assistant for Al Amirat, an online store in Bangladesh.

STORE INFO:
- Currency: Bangladeshi Taka (৳)
- Payment methods: bKash, Nagad, Rocket, Upay, and Cash on Delivery
- Delivery: across Bangladesh
- Returns: 7 days from delivery for unused items

CATEGORIES: ${categoryLine}

CURRENT PRODUCTS (use these to answer questions about availability, price, recommendations):
${productLines.join("\n")}

GUIDELINES:
- Be concise, friendly, and conversational. Keep replies short (2–4 sentences usually).
- When recommending products, mention name and price. You can suggest the customer click "View" to see the full product.
- If a product the customer asks about is not in the list above, politely say it's not currently in stock and suggest similar items from the list.
- Only answer questions related to shopping at Al Amirat. For unrelated questions, gently redirect.
- Never invent products that aren't in the list.
- Use Markdown for short lists if helpful.`;
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY is not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();
    const messages = body?.messages as ChatMessage[] | undefined;
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Trim history to last 10 turns to keep prompt small
    const trimmed = messages.slice(-10);
    const systemPrompt = await buildSystemPrompt();

    const stream = await openai.chat.completions.create({
      model: CHAT_MODEL,
      stream: true,
      temperature: 0.6,
      max_tokens: 400,
      messages: [
        { role: "system", content: systemPrompt },
        ...trimmed.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
              controller.enqueue(encoder.encode(delta));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
