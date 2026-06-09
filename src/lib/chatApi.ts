import {
  answerFromKnowledge,
  findKnowledgeReply,
  sampleQuestionReply,
  type ChatAssistantReply,
  type ChatMessage,
} from "@/lib/chatbotKnowledge";

type ChatApiResponse =
  | { ok: true; reply: ChatAssistantReply }
  | { ok: false; error?: string };

function chatApiUrl(): string {
  if (import.meta.env.DEV) return "/api/chat";
  return (
    (import.meta.env.VITE_CHAT_API_URL as string | undefined)?.trim() || "/api/chat"
  );
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatAssistantReply> {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const question = lastUser?.content?.trim() ?? "";

  const sampleReply = sampleQuestionReply(question);
  if (sampleReply) return sampleReply;

  const knowledgeMatch = findKnowledgeReply(question);
  if (knowledgeMatch) return knowledgeMatch;

  try {
    const res = await fetch(chatApiUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (res.ok) {
      const data = (await res.json()) as ChatApiResponse;
      if (data.ok && data.reply) return data.reply;
    }
  } catch {
    // Static hosting or offline — fall back to local message.
  }

  return answerFromKnowledge(question);
}
