export type ChatLink = { label: string; href: string };

export type ChatAssistantReply = {
  content: string;
  links?: ChatLink[];
};

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
  links?: ChatLink[];
};

export const CHAT_SAMPLE_QUESTIONS = [
  'What are our best sellers (COSMO 20")?',
  "What's your return policy?",
  "Where do you ship?",
] as const;

export const CHAT_KNOWLEDGE_TEXT = `
Lay-n-Go sells patented drawstring organizational bags for cosmetics, travel, play, pets, and more.

Best sellers:
- Lay-n-Go Cosmo 20" cosmetic bag (/product/lay-n-go-cosmo-20) — flagship makeup bag that opens flat
- Lay-n-Go Cosmo Deluxe 22" (/product/lay-n-go-cosmo-deluxe-22)
- Lay-n-Go Traveler 20" tech & travel bag (/product/lay-n-go-traveler-20)

Return policy:
- Returns accepted within 14 days of delivery
- Items must be unused with original packaging
- Email info@layngo.com with your layngo.com order number for a Return Authorization (RA) number
- Customer pays return shipping; original shipping is not refunded
- Full policy: /pages/return-policy

Shipping:
- We ship to the United States and other regions available at checkout
- Economy: 5–8 business days; Standard: 3–4 business days; Express: 1–2 business days (after order ships)
- Orders before 1:00 p.m. cutoff ship same business day when possible
- Tracking emailed when available; rates calculated at checkout
- Full policy: /policies/shipping-policy

Contact: info@layngo.com or /pages/contact
Shop all: /collections
`.trim();

const TOPIC_MATCHERS: { test: RegExp; reply: ChatAssistantReply }[] = [
  {
    test: /best\s*seller|cosmo\s*20|top\s*sell|popular|bestseller/i,
    reply: {
      content:
        'Our top seller is the Lay-n-Go Cosmo 20" — the patented cosmetic bag that opens flat so you can see everything, then cinches closed for travel. The Cosmo Deluxe 22" and Traveler 20" are customer favorites too.',
      links: [
        { label: "Shop Cosmo 20\"", href: "/product/lay-n-go-cosmo-20" },
        { label: "View all collections", href: "/collections" },
      ],
    },
  },
  {
    test: /return|refund|exchange|send\s*back/i,
    reply: {
      content:
        "We accept returns within 14 days of delivery. Items must be unused with original packaging. Email info@layngo.com with your layngo.com order number to get a Return Authorization (RA) number before shipping anything back. Return shipping is paid by the customer and original shipping charges are not refunded.",
      links: [
        { label: "Return policy", href: "/pages/return-policy" },
        { label: "Contact us", href: "/pages/contact" },
      ],
    },
  },
  {
    test: /ship|shipping|deliver|delivery|where\s*do\s*you/i,
    reply: {
      content:
        "We ship to the United States and other regions shown at checkout. After your order ships: Economy is 5–8 business days, Standard is 3–4 business days, and Express is 1–2 business days. Orders placed before 1:00 p.m. are processed the same business day when inventory allows. You'll get tracking by email when your package ships.",
      links: [
        { label: "Shipping policy", href: "/policies/shipping-policy" },
        { label: "Shop now", href: "/collections" },
      ],
    },
  },
  {
    test: /contact|email|phone|help|support/i,
    reply: {
      content:
        "We're happy to help! Email info@layngo.com with your order number or question, or use our contact form and we'll get back to you.",
      links: [{ label: "Contact page", href: "/pages/contact" }],
    },
  },
];

export function answerFromKnowledge(userMessage: string): ChatAssistantReply {
  const trimmed = userMessage.trim();
  if (!trimmed) {
    return {
      content: "Ask me about best sellers, returns, shipping, or anything else about Lay-n-Go.",
    };
  }

  for (const { test, reply } of TOPIC_MATCHERS) {
    if (test.test(trimmed)) return reply;
  }

  return {
    content:
      "I'm not sure about that one. Try asking about our best sellers, return policy, or where we ship — or email info@layngo.com and our team can help.",
    links: [
      { label: "Contact us", href: "/pages/contact" },
      { label: "Shop collections", href: "/collections" },
    ],
  };
}

export function sampleQuestionReply(question: string): ChatAssistantReply | null {
  const normalized = question.trim().toLowerCase();
  const match = CHAT_SAMPLE_QUESTIONS.find((q) => q.toLowerCase() === normalized);
  if (!match) return null;
  return answerFromKnowledge(match);
}
