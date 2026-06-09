import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, SendHorizontal, X } from "lucide-react";

import { CHAT_SAMPLE_QUESTIONS, type ChatMessage } from "@/lib/chatbotKnowledge";
import { sendChatMessage } from "@/lib/chatApi";
import { cn } from "@/lib/utils";

const HEADING_CLASS =
  "font-heading font-extrabold uppercase tracking-[0.04em] text-foreground";

type UiChatMessage = ChatMessage & { id: string };

function nextMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function ChatLinkItem({
  href,
  label,
  isUser,
}: {
  href: string;
  label: string;
  isUser: boolean;
}) {
  const className = cn(
    "text-xs font-bold uppercase tracking-[0.06em] underline underline-offset-2",
    isUser ? "text-primary-foreground/95" : "text-primary",
  );

  if (/^https?:\/\//i.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {label}
    </Link>
  );
}

function ChatBubble({ message }: { message: UiChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex",
        isUser ? "justify-end chat-bubble-enter-user" : "justify-start chat-bubble-enter-assistant",
      )}
    >
      <div
        className={cn(
          "chat-bubble-body max-w-[88%] rounded-2xl px-3.5 py-2.5 font-heading text-sm leading-relaxed",
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
                <ChatLinkItem href={link.href} label={link.label} isUser={isUser} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start chat-bubble-enter-assistant">
      <div className="chat-bubble-body flex items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-white px-4 py-3">
        <span className="chat-typing-dot" />
        <span className="chat-typing-dot chat-typing-dot--delay-1" />
        <span className="chat-typing-dot chat-typing-dot--delay-2" />
      </div>
    </div>
  );
}

export function SiteChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<UiChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const id = window.requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const submitQuestion = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    const userMessage: UiChatMessage = {
      id: nextMessageId(),
      role: "user",
      content: trimmed,
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(nextMessages);
      setMessages((prev) => [
        ...prev,
        {
          id: nextMessageId(),
          role: "assistant",
          content: reply.content,
          links: reply.links,
        },
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
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open ? (
        <div
          className="chat-panel-enter pointer-events-auto flex w-[min(calc(100vw-2rem),24rem)] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-[0_12px_40px_-12px_rgba(15,23,42,0.25)]"
          role="dialog"
          aria-label="Lay-n-Go chat assistant"
        >
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className={cn(HEADING_CLASS, "text-sm leading-tight")}>Lay-n-Go Assistant</p>
              <p className="mt-0.5 font-heading text-xs font-medium normal-case tracking-normal text-muted-foreground">
                Products, shipping & returns
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div
            ref={scrollRef}
            className="flex max-h-[min(22rem,45dvh)] min-h-[12rem] flex-col gap-3 overflow-y-auto overscroll-contain bg-white px-3 py-4"
          >
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="chat-bubble-enter-assistant text-center font-heading text-sm font-medium normal-case tracking-normal text-muted-foreground">
                  Ask about products, shipping, returns, or our story.
                </p>
                <div className="flex flex-col gap-2">
                  {CHAT_SAMPLE_QUESTIONS.map((question, index) => (
                    <button
                      key={question}
                      type="button"
                      disabled={loading}
                      onClick={() => void submitQuestion(question)}
                      style={{ animationDelay: `${index * 70}ms` }}
                      className="chat-sample-enter rounded-xl border border-border bg-white px-3 py-2.5 text-left font-heading text-sm font-semibold normal-case tracking-normal text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 disabled:opacity-60"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => <ChatBubble key={message.id} message={message} />)
            )}

            {loading ? <TypingBubble /> : null}
          </div>

          <form onSubmit={onSubmit} className="border-t border-border bg-white p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Type your question…"
                disabled={loading}
                className="h-10 min-w-0 flex-1 rounded-full border border-border bg-white px-4 font-heading text-sm font-medium normal-case tracking-normal outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                aria-label="Chat message"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-45"
                aria-label="Send message"
              >
                <SendHorizontal className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-[1.03] hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={open}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
