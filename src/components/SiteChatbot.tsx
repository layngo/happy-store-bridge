import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, MessageCircle, X } from "lucide-react";

import { COSMO_20_SWATCHES } from "@/components/Cosmo20ColorSelector";
import { CHAT_SAMPLE_QUESTIONS, type ChatLink, type ChatMessage } from "@/lib/chatbotKnowledge";
import { sendChatMessage } from "@/lib/chatApi";
import { useDialogA11y } from "@/hooks/useDialogA11y";
import { cn } from "@/lib/utils";

/** Closed Cosmo 20" — one hero per color, cycles while the assistant is thinking. */
const THINKING_COSMO_20_IMAGES = (() => {
  const seen = new Set<string>();
  return COSMO_20_SWATCHES.filter((s) => !s.forceUnavailable)
    .map((s) => ({ src: s.bagImageUrl, label: s.tooltip }))
    .filter((item) => {
      if (seen.has(item.src)) return false;
      seen.add(item.src);
      return true;
    });
})();

const STREAM_WORD_MS = 28;
/** Minimum time to show the thinking animation (also caps how fast FAQ replies appear). */
const MIN_THINKING_MS = 3_600;
/** Ms per Cosmo 20 color while thinking — longer = slower color scroll. */
const THINKING_CYCLE_MS = 820;
const HEADING_CLASS =
  "font-heading font-extrabold uppercase tracking-[0.04em] text-foreground";

type UiChatMessage = ChatMessage & { id: string };

function nextMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function ChatLinkItem({ href, label }: { href: string; label: string }) {
  const className =
    "font-medium text-primary underline underline-offset-2 hover:text-primary/80";

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

function MessageLinks({ links }: { links: ChatLink[] }) {
  return (
    <ul className="mt-3 flex flex-col gap-1.5 border-t border-border/60 pt-3">
      {links.map((link) => (
        <li key={link.href}>
          <ChatLinkItem href={link.href} label={link.label} />
        </li>
      ))}
    </ul>
  );
}

function CosmoThinkingIndicator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % THINKING_COSMO_20_IMAGES.length);
    }, THINKING_CYCLE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="chat-thinking-row" role="status" aria-live="polite" aria-label="Assistant is thinking">
      <div className="chat-thinking-orbit" aria-hidden>
        <div className="chat-thinking-glow" />
        <div className="chat-thinking-avatar">
          {THINKING_COSMO_20_IMAGES.map((item, i) => (
            <img
              key={item.src}
              src={item.src}
              alt=""
              title={item.label}
              className={cn("chat-thinking-img", i === index && "chat-thinking-img--visible")}
            />
          ))}
        </div>
      </div>
      <span className="chat-thinking-label">Thinking…</span>
    </div>
  );
}

function StreamingAssistantMessage({
  content,
  links,
  onComplete,
  onProgress,
}: {
  content: string;
  links?: ChatLink[];
  onComplete: () => void;
  onProgress: () => void;
}) {
  const [visible, setVisible] = useState("");
  const [finished, setFinished] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    completedRef.current = false;
    setVisible("");
    setFinished(false);

    const tokens = content.match(/\S+\s*|\s+/g) ?? [content];
    let tokenIndex = 0;
    let cancelled = false;
    let timeoutId = 0;

    const tick = () => {
      if (cancelled) return;
      if (tokenIndex >= tokens.length) {
        setVisible(content);
        setFinished(true);
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete();
        }
        return;
      }
      tokenIndex += 1;
      setVisible(tokens.slice(0, tokenIndex).join(""));
      onProgress();
      timeoutId = window.setTimeout(tick, STREAM_WORD_MS);
    };

    timeoutId = window.setTimeout(tick, 80);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [content, onComplete, onProgress]);

  return (
    <article className="chat-message chat-message--assistant">
      <div className="chat-message__body">
        <p className="chat-message__text whitespace-pre-wrap">
          {visible}
          {!finished ? <span className="chat-stream-cursor" aria-hidden /> : null}
        </p>
        {finished && links && links.length > 0 ? <MessageLinks links={links} /> : null}
      </div>
    </article>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <article className="chat-message chat-message--user">
      <p className="chat-message__text whitespace-pre-wrap">{content}</p>
    </article>
  );
}

export function SiteChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<UiChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeChat = useCallback(() => setOpen(false), []);
  const dialogRef = useDialogA11y({
    open,
    onClose: closeChat,
    returnFocusRef: toggleRef,
  });

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, []);

  const handleStreamComplete = useCallback(() => {
    setStreamingId(null);
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = window.requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking, streamingId, scrollToBottom]);

  const busy = thinking || streamingId !== null;

  const submitQuestion = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || busy) return;

    const userMessage: UiChatMessage = {
      id: nextMessageId(),
      role: "user",
      content: trimmed,
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setThinking(true);
    const thinkingStarted = Date.now();

    try {
      const reply = await sendChatMessage(nextMessages);
      const elapsed = Date.now() - thinkingStarted;
      if (elapsed < MIN_THINKING_MS) {
        await new Promise((resolve) => window.setTimeout(resolve, MIN_THINKING_MS - elapsed));
      }
      const assistantId = nextMessageId();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: reply.content,
          links: reply.links,
        },
      ]);
      setStreamingId(assistantId);
    } finally {
      setThinking(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submitQuestion(input);
  };

  const onInputKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submitQuestion(input);
    }
  };

  const resizeComposer = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    requestAnimationFrame(resizeComposer);
  };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open ? (
        <div
          ref={dialogRef}
          tabIndex={-1}
          className="chat-panel-enter pointer-events-auto flex w-[min(calc(100vw-2rem),22rem)] flex-col overflow-hidden rounded-2xl border border-border/80 bg-white shadow-[0_16px_48px_-12px_rgba(15,23,42,0.22)] outline-none sm:w-[min(calc(100vw-2rem),28rem)]"
          role="dialog"
          aria-modal="true"
          aria-label="Lay-n-Go chat assistant"
        >
          <header className="flex shrink-0 items-center justify-between border-b border-border/70 px-4 py-3">
            <div>
              <p className={cn(HEADING_CLASS, "text-sm leading-tight sm:text-base")}>Lay-n-Go Assistant</p>
            </div>
            <button
              type="button"
              onClick={closeChat}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div
            ref={scrollRef}
            className="chat-conversation flex min-h-[14rem] max-h-[min(28rem,52dvh)] flex-1 flex-col overflow-y-auto overscroll-contain px-4 py-5 sm:px-5"
          >
            {messages.length === 0 && !thinking ? (
              <div className="flex flex-1 flex-col justify-end gap-3 pb-2">
                <p className="font-sans text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
                  Ask about products, shipping, returns, or anything Lay-n-Go.
                </p>
                <div className="flex flex-col gap-2">
                  {CHAT_SAMPLE_QUESTIONS.map((question, index) => (
                    <button
                      key={question}
                      type="button"
                      disabled={busy}
                      onClick={() => void submitQuestion(question)}
                      style={{ animationDelay: `${index * 60}ms` }}
                      className="chat-sample-enter text-left font-sans text-[0.9375rem] font-medium leading-snug text-primary transition-opacity hover:opacity-80 disabled:opacity-50 sm:text-base"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {messages.map((message) =>
                  message.role === "user" ? (
                    <UserMessage key={message.id} content={message.content} />
                  ) : message.id === streamingId ? (
                    <StreamingAssistantMessage
                      key={message.id}
                      content={message.content}
                      links={message.links}
                      onComplete={handleStreamComplete}
                      onProgress={scrollToBottom}
                    />
                  ) : (
                    <article key={message.id} className="chat-message chat-message--assistant">
                      <div className="chat-message__body">
                        <p className="chat-message__text whitespace-pre-wrap">{message.content}</p>
                        {message.links && message.links.length > 0 ? (
                          <MessageLinks links={message.links} />
                        ) : null}
                      </div>
                    </article>
                  ),
                )}
                {thinking ? <CosmoThinkingIndicator /> : null}
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="chat-composer shrink-0 border-t border-border/70 px-3 py-3 sm:px-4">
            <div className="chat-composer-inner">
              <label htmlFor="chat-composer-input" className="sr-only">
                Message Lay-n-Go assistant
              </label>
              <textarea
                id="chat-composer-input"
                ref={inputRef}
                rows={1}
                value={input}
                onChange={onInputChange}
                onKeyDown={onInputKeyDown}
                placeholder="Message Lay-n-Go…"
                disabled={busy}
                className="chat-composer-input"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="chat-composer-send"
                aria-label="Send message"
              >
                <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <button
        ref={toggleRef}
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
