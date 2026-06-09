import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { Loader2, MessageCircle, SendHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CHAT_SAMPLE_QUESTIONS, type ChatMessage } from "@/lib/chatbotKnowledge";
import { sendChatMessage } from "@/lib/chatApi";
import { cn } from "@/lib/utils";

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md border border-border bg-white text-foreground",
        )}
      >
        <p>{message.content}</p>
        {message.links && message.links.length > 0 ? (
          <ul className="mt-2 space-y-1">
            {message.links.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={cn(
                    "text-xs font-semibold underline underline-offset-2",
                    isUser ? "text-primary-foreground/95" : "text-primary",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

export function SiteChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const submitQuestion = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(nextMessages);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply.content, links: reply.links },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submitQuestion(input);
  };

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submitQuestion(input);
    }
  };

  return (
    <>
      {open ? (
        <div
          className="fixed bottom-[5.25rem] right-4 z-[100] flex w-[min(calc(100vw-2rem),24rem)] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl sm:right-6"
          role="dialog"
          aria-label="Lay-n-Go chat assistant"
        >
          <header className="flex items-center justify-between border-b border-border bg-primary px-4 py-3 text-primary-foreground">
            <div>
              <p className="font-heading text-sm font-bold uppercase tracking-[0.08em]">Lay-n-Go Assistant</p>
              <p className="text-xs text-primary-foreground/85">Ask about products, shipping & returns</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-primary-foreground/90 transition-colors hover:bg-primary-foreground/15"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div ref={scrollRef} className="flex max-h-[min(24rem,50vh)] min-h-[14rem] flex-col gap-3 overflow-y-auto bg-muted/15 px-3 py-4">
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-center text-sm text-muted-foreground">
                  Hi! I can help with best sellers, returns, shipping, and more.
                </p>
                <div className="flex flex-col gap-2">
                  {CHAT_SAMPLE_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      disabled={loading}
                      onClick={() => void submitQuestion(question)}
                      className="rounded-xl border border-border bg-white px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 disabled:opacity-60"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) => <ChatBubble key={`${message.role}-${index}`} message={message} />)
            )}

            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking…
              </div>
            ) : null}
          </div>

          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-border bg-white p-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Type your question…"
              disabled={loading}
              className="h-10 min-w-0 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none ring-primary/30 placeholder:text-muted-foreground focus:border-primary focus:ring-2"
              aria-label="Chat message"
            />
            <Button
              type="submit"
              size="icon"
              disabled={loading || !input.trim()}
              className="h-10 w-10 shrink-0 rounded-full"
              aria-label="Send message"
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-4 right-4 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:right-6"
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={open}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
}
