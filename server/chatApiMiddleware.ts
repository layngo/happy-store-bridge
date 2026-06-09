import type { IncomingMessage, ServerResponse } from "http";
import {
  CHAT_KNOWLEDGE_TEXT,
  answerFromKnowledge,
  findKnowledgeReply,
  type ChatAssistantReply,
  type ChatMessage,
} from "../src/lib/chatbotKnowledge";

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

async function answerWithOpenAi(
  apiKey: string,
  messages: ChatMessage[],
  model: string,
): Promise<ChatAssistantReply> {
  const systemPrompt = `You are a friendly, warm customer service assistant for Lay-n-Go (layngo.com), a brand that sells patented drawstring organizational bags.

Respond naturally to greetings, thanks, and casual small talk (keep it brief, then offer to help with Lay-n-Go).
Use ONLY the facts below for product, policy, and company questions. If you don't know something, direct the customer to info@layngo.com or /pages/contact.
Keep answers to 2–4 short sentences. Do not invent policies, prices, or products.

${CHAT_KNOWLEDGE_TEXT}`;

  const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_tokens: 280,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!upstream.ok) {
    const errText = await upstream.text().catch(() => "");
    throw new Error(`OpenAI ${upstream.status}: ${errText.slice(0, 200)}`);
  }

  const data = (await upstream.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("Empty OpenAI response");

  const knowledgeFallback = answerFromKnowledge(messages[messages.length - 1]?.content ?? "");
  return {
    content,
    links: knowledgeFallback.links,
  };
}

export function createChatApiMiddleware(env: Record<string, string>) {
  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (req.url !== "/api/chat" || req.method !== "POST") {
      next();
      return;
    }

    try {
      const body = await readBody(req);
      const payload = body ? JSON.parse(body) : {};
      const messages = Array.isArray(payload.messages) ? (payload.messages as ChatMessage[]) : [];
      const lastUser = [...messages].reverse().find((m) => m.role === "user");

      if (!lastUser?.content?.trim()) {
        sendJson(res, 400, { ok: false, error: "Message is required." });
        return;
      }

      const apiKey = env.OPENAI_API_KEY?.trim();
      const model = env.OPENAI_CHAT_MODEL?.trim() || "gpt-4o-mini";

      const knowledgeMatch = findKnowledgeReply(lastUser.content);
      let reply: ChatAssistantReply;

      if (knowledgeMatch) {
        reply = knowledgeMatch;
      } else if (apiKey) {
        try {
          reply = await answerWithOpenAi(apiKey, messages, model);
        } catch (err) {
          console.error("[chat-api] OpenAI failed, using knowledge fallback:", err);
          reply = answerFromKnowledge(lastUser.content);
        }
      } else {
        reply = answerFromKnowledge(lastUser.content);
      }

      sendJson(res, 200, { ok: true, reply });
    } catch (err) {
      console.error("[chat-api]", err);
      sendJson(res, 500, {
        ok: false,
        error: "Could not get a reply. Please try again or email info@layngo.com.",
      });
    }
  };
}
