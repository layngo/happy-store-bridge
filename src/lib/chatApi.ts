import {
  answerFromKnowledge,
  sampleQuestionReply,
  type ChatAssistantReply,
  type ChatMessage,
} from "@/lib/chatbotKnowledge";

type ChatApiResponse =
  | { ok: true; reply: ChatAssistantReply }
  | { ok: false; error?: string };

export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatAssistantReply> {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const question = lastUser?.content?.trim() ?? "";

  const sampleReply = sampleQuestionReply(question);
  if (sampleReply) return sampleReply;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (res.ok) {
      const data = (await res.json()) as ChatApiResponse;
      if (data.ok && data.reply) return data.reply;
    }
  } catch {
    // Static hosting or offline — fall back to local knowledge.
  }

  return answerFromKnowledge(question);
}
