export type ChatLink = { label: string; href: string };

export type ChatProduct = {
  title: string;
  subtitle?: string;
  href: string;
  image: string;
};

export type ChatAssistantReply = {
  content: string;
  links?: ChatLink[];
  products?: ChatProduct[];
};

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
  links?: ChatLink[];
  products?: ChatProduct[];
};

/** Clickable product cards shown in chat (local images for fast load). */
export const CHAT_PRODUCTS = {
  cosmo20: {
    title: 'Lay-n-Go Cosmo 20"',
    subtitle: "Best seller · Cosmetic bag",
    href: "/product/lay-n-go-cosmo-20",
    image: "/cosmetic-bags-v2/cosmo-20.png",
  },
  cosmoDeluxe22: {
    title: 'Lay-n-Go Cosmo Deluxe 22"',
    subtitle: "Extra room · Cosmetic bag",
    href: "/product/lay-n-go-cosmo-deluxe-22",
    image: "/cosmetic-bags-v2/cosmo-22.png",
  },
  traveler20: {
    title: 'Lay-n-Go Traveler 20"',
    subtitle: "Tech & travel organizer",
    href: "/product/lay-n-go-traveler-20",
    image: "/products/lay-n-go-traveler-20/traveler-gallery-1.png",
  },
  nailspa18: {
    title: 'Lay-n-Go Nailspa 18"',
    subtitle: "Salon & at-home manicures",
    href: "/product/lay-n-go-nailspa-18",
    image: "/products/lay-n-go-nailspa-18/heroes/dot-calm.png",
  },
  dogBed44: {
    title: 'Lay-n-Go Travel Dog Bed 44"',
    subtitle: "Portable pet bed",
    href: "/product/lay-n-go-travel-dog-bed-44",
    image: "/products/lay-n-go-travel-dog-bed-44/gallery-1.png",
  },
} as const satisfies Record<string, ChatProduct>;

const CHAT_BEST_SELLERS: ChatProduct[] = [
  CHAT_PRODUCTS.cosmo20,
  CHAT_PRODUCTS.cosmoDeluxe22,
  CHAT_PRODUCTS.traveler20,
];

export const CHAT_SAMPLE_QUESTIONS = [
  "What are our best sellers?",
  "What's your return policy?",
  "Where do you ship?",
] as const;

export const CHAT_KNOWLEDGE_TEXT = `
Lay-n-Go (layngo.com): patented drawstring organizational solutions. Products open flat for full visibility, then cinch closed for storage and travel. Founded by Amy and Adam Fazackerley; 16+ years in business.

BRAND PITCH: "Organizational Solutions for Life, Play, and Travel." Homepage tagline for Cosmo: "The last bag you'll ever need."

CATEGORIES & COLLECTIONS:
- Cosmetic Bags / COSMO: /shop/cosmetic-bags: makeup & beauty bags (Cosmo 16", 20", Deluxe 22")
- Nail Solutions / NAILSPA: /product/lay-n-go-nailspa-18
- Play (toy cleanup, play mats): /collections/play
- Tech & Travel / TRAVELER: /product/lay-n-go-traveler-20
- Pet Solutions: /product/lay-n-go-travel-dog-bed-44
- Outdoor / Tactical / Military & First Responder: /collections/military-first-responder
- All collections: /collections

TOP PRODUCTS:
- Lay-n-Go Cosmo 20" (/product/lay-n-go-cosmo-20): flagship cosmetic bag, best seller
- Lay-n-Go Cosmo Deluxe 22" (/product/lay-n-go-cosmo-deluxe-22)
- Lay-n-Go Traveler 20" (/product/lay-n-go-traveler-20): tech & travel
- Lay-n-Go Nailspa 18" (/product/lay-n-go-nailspa-18)
- Lay-n-Go Travel Dog Bed 44" (/product/lay-n-go-travel-dog-bed-44)

HOW IT WORKS: Patented drawstring mat design: lay flat to see and use everything, pull drawstrings to cinch into a bag. Utility patents include U.S. 9,084,459; 10,016,036; 10,561,213; 11,116,298. Patents page: /pages/lay-n-go-patents

ABOUT / OUR STORY: /pages/about-us. Founders Amy & Adam. Started from solving everyday organization problems (toy cleanup, cosmetics, travel). 16+ years in business, 100k+ customers, 200+ wholesale partners.

PRESS: Featured in BuzzFeed, Parents, People, Today Show, Lifehacker, Condé Nast Traveler, Oprah Daily, GMA, and more. Press page: /pages/press

SHIPPING (/policies/shipping-policy):
- Ships to U.S. and regions available at checkout
- Economy 5–8 business days; Standard 3–4; Express 1–2 (after order ships)
- Same-day processing for orders before 1:00 p.m. cutoff when inventory allows
- Tracking emailed when carrier number available; rates at checkout

RETURNS (/pages/return-policy):
- 14 days from delivery; unused with original packaging
- Email info@layngo.com with layngo.com order number for Return Authorization (RA)
- Customer pays return shipping; original shipping not refunded

CONTACT: info@layngo.com | Fax 703.995.4916 | /pages/contact
WHOLESALE: Inquiries via contact form at /pages/contact#wholesale: 16+ years, 200+ wholesale partners

SMS (/policies/sms-policy): Transactional, marketing, and service texts. Opt out anytime by replying STOP. Reply START to opt back in. HELP for support. Message/data rates may apply.

TERMS & PRIVACY: /policies/terms-of-service (combined terms and privacy)

ACCOUNT / ORDERS: Login at https://www.layngo.com/account/login for order history

DISCOUNT: First-visit popup on homepage may offer signup discount with email/phone verification.

SEARCH: /search to find products on site.
`.trim();

const TOPIC_MATCHERS: { test: RegExp; reply: ChatAssistantReply }[] = [
  {
    test:
      /^(hi|hey|hello|howdy|greetings|good\s+(morning|afternoon|evening)|sup|yo|hiya|heya)\b[\s!.,?]*$|^(hi|hey|hello|howdy)\b[\s,]+(there|everyone|folks|team|lay-n-go)/i,
    reply: {
      content:
        "Hi there! Welcome to Lay-n-Go. I can help with our products (Cosmo cosmetic bags, Play mats, Traveler, and more), shipping, returns, or our story. What can I help you with today?",
      links: [{ label: "Shop collections", href: "/collections" }],
    },
  },
  {
    test: /^(thanks|thank\s+you|thx|ty|appreciate\s+it|much\s+appreciated)\b/i,
    reply: {
      content: "You're welcome! If you have any other questions about Lay-n-Go, just ask.",
    },
  },
  {
    test: /^(bye|goodbye|see\s+ya|see\s+you|later|take\s+care|good\s+night)\b/i,
    reply: {
      content:
        "Goodbye! Feel free to come back anytime: or email info@layngo.com if you need a hand from our team.",
      links: [{ label: "Contact us", href: "/pages/contact" }],
    },
  },
  {
    test: /what\s+can\s+you\s+(do|help)|how\s+can\s+you\s+help|who\s+are\s+you|what\s+are\s+you|help\s+me/i,
    reply: {
      content:
        "I'm the Lay-n-Go assistant. Ask me about best sellers, product categories, shipping, returns, wholesale, or how our patented open-flat, cinch-closed bags work: I'll point you to the right page or policy.",
      links: [
        { label: "Best seller: Cosmo 20\"", href: "/product/lay-n-go-cosmo-20" },
        { label: "Contact support", href: "/pages/contact" },
      ],
    },
  },
  {
    test: /how\s+are\s+you|how\s+is\s+it\s+going|what'?s\s+up|whats\s+up/i,
    reply: {
      content:
        "Doing great, thanks for asking! I'm here to help with Lay-n-Go products and orders. What would you like to know?",
    },
  },
  {
    test: /^(ok|okay|cool|great|perfect|awesome|got\s+it|understood|nice)\b[\s!.,?]*$/i,
    reply: {
      content: "Glad that helps! Let me know if you want to explore products, shipping, or anything else.",
    },
  },
  {
    test: /best\s*seller|top\s*sell|popular|bestseller|most\s*popular|what\s*should\s*i\s*buy/i,
    reply: {
      content:
        'Our #1 best seller is the Lay-n-Go Cosmo 20": the patented cosmetic bag that opens flat so you can see everything, then cinches closed for travel. The Cosmo Deluxe 22" and Traveler 20" are also customer favorites.',
      products: CHAT_BEST_SELLERS,
      links: [{ label: "Browse all collections", href: "/collections" }],
    },
  },
  {
    test: /cosmo|makeup\s*bag|cosmetic\s*bag|beauty\s*bag|make\s*up/i,
    reply: {
      content:
        'Cosmo is our signature cosmetic line. The Cosmo 20" is our best seller: opens flat like a mat, cinches into a bag. The Cosmo Deluxe 22" offers extra room. Both come in multiple colors and patterns.',
      products: [CHAT_PRODUCTS.cosmo20, CHAT_PRODUCTS.cosmoDeluxe22],
      links: [{ label: "Cosmetic bags", href: "/shop/cosmetic-bags" }],
    },
  },
  {
    test: /traveler|tech\s*(\+|and)\s*travel|tech\s*travel|laptop|charger|cable|electronic/i,
    reply: {
      content:
        'The Lay-n-Go Traveler 20" is built for tech and travel: opens flat so you can see cables, chargers, and gadgets, then cinches closed. Great for work trips and everyday carry.',
      products: [CHAT_PRODUCTS.traveler20],
      links: [{ label: "Tech & travel collection", href: "/collections/technology" }],
    },
  },
  {
    test: /play|toy|lego|cleanup|clean\s*up|kids/i,
    reply: {
      content:
        'Our Play collection uses the same patented open-flat, cinch-closed design for toy cleanup: spread toys out on the mat, then pull the drawstring to gather everything in seconds. Perfect for LEGO and playroom organization.',
      links: [{ label: "Shop Play", href: "/collections/play" }],
    },
  },
  {
    test: /pet|dog|cat|travel\s*bed|animal/i,
    reply: {
      content:
        'Pet Solutions include the Lay-n-Go Travel Dog Bed (44"): a portable bed that packs down for travel. Browse our pet collection for gear designed to go wherever your pet goes.',
      products: [CHAT_PRODUCTS.dogBed44],
      links: [{ label: "Pet collection", href: "/collections/pet-solutions" }],
    },
  },
  {
    test: /nail|nailspa|manicure|salon/i,
    reply: {
      content:
        'The Lay-n-Go Nailspa 18" is designed for nail techs and at-home manicures: opens flat for tools and polish, cinches closed for storage and travel between clients or appointments.',
      products: [CHAT_PRODUCTS.nailspa18],
    },
  },
  {
    test: /tactical|military|first\s*responder|outdoor|defender|duty/i,
    reply: {
      content:
        'Our Outdoor / Tactical line includes military and first-responder gear: organized storage that opens flat in the field and cinches for transport. See the full collection for Defender and tactical options.',
      links: [{ label: "Outdoor / Tactical", href: "/collections/military-first-responder" }],
    },
  },
  {
    test: /how\s*(does|do)\s*(it|they)\s*work|drawstring|open\s*flat|patent|invention|what\s*is\s*lay.?n.?go/i,
    reply: {
      content:
        'Lay-n-Go is a patented drawstring mat that opens flat so you can see and use everything, then cinches closed into a bag for storage or travel. It started with toy cleanup and now covers cosmetics, tech, travel, pets, nails, and tactical gear.',
      links: [
        { label: "Our story", href: "/pages/about-us" },
        { label: "Patents", href: "/pages/lay-n-go-patents" },
      ],
    },
  },
  {
    test: /about|story|founder|amy|adam|history|years\s*in\s*business|who\s*(are|is)\s*lay/i,
    reply: {
      content:
        'Lay-n-Go was founded by Amy and Adam Fazackerley: 16+ years in business, 100k+ customers served. It started with a simple idea: "There has to be a better way to do this." Read the full founder story on our About page.',
      links: [
        { label: "Our story", href: "/pages/about-us" },
        { label: "Contact", href: "/pages/contact" },
      ],
    },
  },
  {
    test: /press|featured|magazine|media|buzzfeed|today\s*show|traveler\s*mag/i,
    reply: {
      content:
        'Lay-n-Go has been featured in BuzzFeed, Parents, People, the Today Show, Lifehacker, Condé Nast Traveler, Oprah Daily, Good Morning America, and many more. Browse press highlights and articles on our Press page.',
      links: [{ label: "Press & media", href: "/pages/press" }],
    },
  },
  {
    test: /wholesale|retail\s*partner|carry\s*lay|distributor|bulk|store\s*order/i,
    reply: {
      content:
        'We work with 200+ wholesale partners. For wholesale inquiries, use our contact form and select the wholesale topic: include your company details and our team will follow up.',
      links: [{ label: "Wholesale inquiry", href: "/pages/contact#wholesale" }],
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
    test: /ship|shipping|deliver|delivery|how\s*long|when\s*will|track|tracking/i,
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
    test: /sms|text\s*message|stop|start|opt.?out|subscribe.*text|phone\s*number/i,
    reply: {
      content:
        "We may send transactional texts (orders, shipping, OTP codes) and marketing texts if you opt in. Reply STOP anytime to unsubscribe: you'll get one confirmation message. Reply START to opt back in, or HELP for support. Message and data rates may apply.",
      links: [{ label: "SMS policy", href: "/policies/sms-policy" }],
    },
  },
  {
    test: /discount|coupon|promo|code|sale|off\s*percent|first\s*visit|signup/i,
    reply: {
      content:
        "We occasionally offer promotional discounts: including a first-visit signup offer on our homepage. Enter your email (and verify your phone when prompted) to receive a discount code. Promotions and free-shipping offers, when active, appear at checkout.",
      links: [{ label: "Shop collections", href: "/collections" }],
    },
  },
  {
    test: /order|account|login|where\s*is\s*my|status/i,
    reply: {
      content:
        "For order status and history, log in to your Lay-n-Go account. If you need help with a specific order, email info@layngo.com with your order number and we'll assist you.",
      links: [
        { label: "Account login", href: "https://www.layngo.com/account/login" },
        { label: "Contact support", href: "/pages/contact" },
      ],
    },
  },
  {
    test: /privacy|terms|personal\s*data|gdpr|cookie/i,
    reply: {
      content:
        "Our combined Terms of Service and Privacy Policy explains how we handle your data, orders, and communications. You can read the full policy on our site.",
      links: [{ label: "Terms & privacy", href: "/policies/terms-of-service" }],
    },
  },
  {
    test: /patent|license|intellectual/i,
    reply: {
      content:
        "Lay-n-Go products are protected by U.S. utility patents including 9,084,459; 10,016,036; 10,561,213; and 11,116,298. For licensing inquiries, email info@layngo.com.",
      links: [{ label: "Patents page", href: "/pages/lay-n-go-patents" }],
    },
  },
  {
    test: /collection|category|categories|shop|browse|product\s*line|what\s*do\s*you\s*sell/i,
    reply: {
      content:
        "We organize solutions by category: Cosmetic Bags, Nail Solutions, Play, Tech & Travel, Pet Solutions, and Outdoor / Tactical. Each uses our patented open-flat, cinch-closed design for a different use case.",
      links: [
        { label: "Shop all collections", href: "/collections" },
        { label: "Cosmetic bags", href: "/shop/cosmetic-bags" },
      ],
    },
  },
  {
    test: /contact|email|phone|fax|help|support|reach|talk\s*to/i,
    reply: {
      content:
        "Reach us at info@layngo.com or fax 703.995.4916. Use our contact form for orders, products, or wholesale inquiries: we typically respond as soon as possible.",
      links: [{ label: "Contact page", href: "/pages/contact" }],
    },
  },
  {
    test: /price|cost|how\s*much|expensive|afford/i,
    reply: {
      content:
        "Prices vary by product and are shown on each product page. Select your color or size to see the current price at checkout. Browse collections to compare options.",
      products: [CHAT_PRODUCTS.cosmo20],
      links: [{ label: "Shop collections", href: "/collections" }],
    },
  },
];

export function findKnowledgeReply(userMessage: string): ChatAssistantReply | null {
  const trimmed = userMessage.trim();
  if (!trimmed) return null;
  for (const { test, reply } of TOPIC_MATCHERS) {
    if (test.test(trimmed)) return reply;
  }
  return null;
}

export function answerFromKnowledge(userMessage: string): ChatAssistantReply {
  const trimmed = userMessage.trim();
  if (!trimmed) {
    return {
      content:
        "Ask me about products, collections, shipping, returns, our story, wholesale, or anything else about Lay-n-Go.",
    };
  }

  const match = findKnowledgeReply(trimmed);
  if (match) return match;

  return {
    content:
      "I'm not sure I caught that. I'm best at Lay-n-Go product questions, shipping, returns, and our story: try something like \"What are your best sellers?\" or say hi and I'll help you get started.",
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
