import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { Loader2, MessageCircle, SendHorizontal, Sparkles, X } from "lucide-react";

import { CHAT_SAMPLE_QUESTIONS, type ChatMessage } from "@/lib/chatbotKnowledge";
import { sendChatMessage } from "@/lib/chatApi";
import { cn } from "@/lib/utils";

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "relative max-w-[88%] overflow-hidden rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-br-md bg-gradient-to-br from-[#3eb8cc] via-primary to-[#2a8f9e] text-primary-foreground shadow-[0_8px_24px_-6px_hsla(191,54%,40%,0.55),inset_0_1px_0_0_rgba(255,255,255,0.35)]"
            : "rounded-bl-md border border-white/70 bg-white/75 text-foreground shadow-[0_8px_28px_-10px_rgba(15,23,42,0.18),inset_0_1px_0_0_rgba(255,255,255,0.95)] backdrop-blur-xl",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent",
            !isUser && "via-white",
          )}
        />
        <p className="relative">{message.content}</p>
        {message.links && message.links.length > 0 ? (
          <ul className="relative mt-2.5 space-y-1.5">
            {message.links.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
                    isUser
                      ? "bg-white/15 text-white hover:bg-white/25"
                      : "bg-primary/10 text-primary hover:bg-primary/15",
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
          className="chat-gloss-panel relative fixed bottom-[5.25rem] right-4 z-[100] flex w-[min(calc(100vw-2rem),26rem)] flex-col overflow-hidden rounded-[1.35rem] border border-white/60 bg-gradient-to-b from-white/95 via-white/88 to-slate-50/90 shadow-[0_24px_60px_-12px_rgba(15,23,42,0.35),0_0_0_1px_rgba(255,255,255,0.5)_inset,0_1px_0_0_rgba(255,255,255,0.9)_inset] backdrop-blur-2xl sm:right-6"
          role="dialog"
          aria-label="Lay-n-Go chat assistant"
        >
          <header className="relative overflow-hidden border-b border-white/40 px-4 py-3.5">
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-br from-[#5ec9db] via-primary to-[#247a88]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.08)_38%,transparent_100%)]"
            />
            <div className="relative flex items-center justify-between gap-3 text-primary-foreground">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-sm">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-heading text-sm font-bold uppercase tracking-[0.1em] drop-shadow-sm">
                    Lay-n-Go Assistant
                  </p>
                  <p className="text-xs text-white/90">Products, shipping & returns</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/25 bg-white/15 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition-colors hover:bg-white/25"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div
            ref={scrollRef}
            className="chat-gloss-messages flex max-h-[min(26rem,52vh)] min-h-[15rem] flex-col gap-3 overflow-y-auto px-3.5 py-4"
          >
            {messages.length === 0 ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/70 bg-white/55 px-3.5 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_30px_-18px_rgba(15,23,42,0.35)] backdrop-blur-md">
                  <p className="text-sm font-medium text-foreground/90">
                    Hi — ask me anything about Lay-n-Go.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Try one of these to get started:</p>
                </div>
                <div className="flex flex-col gap-2">
                  {CHAT_SAMPLE_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      disabled={loading}
                      onClick={() => void submitQuestion(question)}
                      className="group relative overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-b from-white/90 to-white/65 px-3.5 py-3 text-left text-sm font-medium text-foreground shadow-[0_8px_22px_-14px_rgba(15,23,42,0.45),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_14px_28px_-12px_hsla(191,54%,40%,0.45)] disabled:opacity-60"
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                      />
                      <span className="relative">{question}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) => <ChatBubble key={`${message.role}-${index}`} message={message} />)
            )}

            {loading ? (
              <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-sm text-muted-foreground shadow-sm backdrop-blur-sm w-fit">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Thinking…
              </div>
            ) : null}
          </div>

          <form onSubmit={onSubmit} className="relative border-t border-white/50 bg-gradient-to-b from-white/80 to-white/95 p-3 backdrop-blur-md">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
            />
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Type your question…"
                disabled={loading}
                className="h-11 min-w-0 flex-1 rounded-full border border-white/80 bg-white/70 px-4 text-sm shadow-[inset_0_1px_2px_rgba(15,23,42,0.06),0_1px_0_rgba(255,255,255,0.9)] outline-none backdrop-blur-sm placeholder:text-muted-foreground/80 focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                aria-label="Chat message"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/30 bg-gradient-to-br from-[#5ec9db] via-primary to-[#247a88] text-primary-foreground shadow-[0_10px_22px_-8px_hsla(191,54%,40%,0.65),inset_0_1px_0_rgba(255,255,255,0.4)] transition-all hover:scale-105 hover:shadow-[0_14px_26px_-8px_hsla(191,54%,40%,0.75)] disabled:scale-100 disabled:opacity-45"
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
        className={cn(
          "fixed bottom-4 right-4 z-[100] flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full border border-white/40 text-primary-foreground shadow-[0_16px_40px_-10px_hsla(191,54%,40%,0.75),0_0_0_1px_rgba(255,255,255,0.25)_inset,inset_0_1px_0_rgba(255,255,255,0.45)] transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 sm:right-6",
          open
            ? "bg-gradient-to-br from-slate-600 to-slate-800"
            : "bg-gradient-to-br from-[#6fd4e4] via-primary to-[#1f7a88]",
        )}
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={open}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[3px] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.38)_0%,transparent_55%)]"
        />
        {open ? <X className="relative h-6 w-6" /> : <MessageCircle className="relative h-6 w-6" />}
      </button>
    </>
  );
}
