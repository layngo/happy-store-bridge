var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/reviewStore.ts
var reviewStore_exports = {};
__export(reviewStore_exports, {
  listReviewsForProduct: () => listReviewsForProduct,
  storedToCustomerReview: () => storedToCustomerReview,
  submitReview: () => submitReview
});
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
async function readAll() {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
async function writeAll(reviews) {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(reviews, null, 2), "utf8");
}
async function listReviewsForProduct(productHandle) {
  const all = await readAll();
  const wanted = productHandle.toLowerCase();
  return all.filter((r) => r.productHandle.toLowerCase() === wanted);
}
async function submitReview(input) {
  const name = input.name.trim();
  const text = input.text.trim();
  if (name.length < 2) return { ok: false, error: "Please enter your name." };
  if (text.length < 10) return { ok: false, error: "Please write at least a few words in your review." };
  const rating = Math.round(input.rating * 2) / 2;
  if (rating < 1 || rating > 5) {
    return { ok: false, error: "Rating must be between 1 and 5 stars." };
  }
  let images;
  if (input.imageBase64) {
    if (input.imageBase64.length > 25e5) {
      return { ok: false, error: "Photo is too large. Please use an image under 2MB." };
    }
    images = [input.imageBase64];
  }
  const review = {
    id: `submitted-${randomUUID()}`,
    productHandle: input.productHandle,
    name,
    orderName: "",
    rating,
    title: input.title?.trim() || void 0,
    text,
    images,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const all = await readAll();
  all.push(review);
  await writeAll(all);
  return { ok: true, review };
}
function storedToCustomerReview(r) {
  return {
    id: r.id,
    name: r.name,
    rating: r.rating,
    title: r.title,
    text: r.text,
    images: r.images
  };
}
var STORE_PATH;
var init_reviewStore = __esm({
  "server/reviewStore.ts"() {
    STORE_PATH = path.join(process.cwd(), "data", "submitted-reviews.json");
  }
});

// vite.config.ts
import { defineConfig } from "file:///Users/tombro/happy-store-bridge-1/node_modules/vite/dist/node/index.js";
import react from "file:///Users/tombro/happy-store-bridge-1/node_modules/@vitejs/plugin-react-swc/index.js";
import path2 from "path";
import { componentTagger } from "file:///Users/tombro/happy-store-bridge-1/node_modules/lovable-tagger/dist/index.js";

// plugins/vite-plugin-review-api.ts
import { loadEnv } from "file:///Users/tombro/happy-store-bridge-1/node_modules/vite/dist/node/index.js";

// server/reviewApiMiddleware.ts
import { URL } from "url";
var DEFAULT_REVIEW_SUBMIT_WEBHOOK = "https://layngo.app.n8n.cloud/webhook/layngo-review-submit";
var DEFAULT_REVIEWS_LIST_WEBHOOK = "https://layngo.app.n8n.cloud/webhook/layngo-reviews-list";
function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}
function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}
async function fetchPublishedReviews(productHandle, webhookUrl) {
  const url = `${webhookUrl}?productHandle=${encodeURIComponent(productHandle)}`;
  const upstream = await fetch(url, { method: "GET" });
  if (!upstream.ok) return [];
  const data = await upstream.json().catch(() => null);
  return data?.reviews ?? [];
}
function createReviewApiMiddleware(env) {
  const submitWebhook = env.REVIEW_SUBMIT_WEBHOOK_URL || DEFAULT_REVIEW_SUBMIT_WEBHOOK;
  const listWebhook = env.REVIEWS_LIST_WEBHOOK_URL || DEFAULT_REVIEWS_LIST_WEBHOOK;
  return async (req, res, next) => {
    if (!req.url || !req.url.startsWith("/api/reviews")) {
      next();
      return;
    }
    try {
      const url = new URL(req.url, "http://localhost");
      const pathname = url.pathname;
      if (req.method === "GET" && pathname === "/api/reviews") {
        const productHandle = url.searchParams.get("productHandle") ?? "";
        const { listReviewsForProduct: listReviewsForProduct2, storedToCustomerReview: storedToCustomerReview2 } = await Promise.resolve().then(() => (init_reviewStore(), reviewStore_exports));
        const local = await listReviewsForProduct2(productHandle);
        const remote = await fetchPublishedReviews(productHandle, listWebhook);
        const merged = [...local.map(storedToCustomerReview2), ...remote];
        sendJson(res, 200, { reviews: merged });
        return;
      }
      if (req.method === "POST") {
        const body = await readBody(req);
        const json = body ? JSON.parse(body) : {};
        if (pathname === "/api/reviews/submit") {
          const productHandle = String(json.productHandle ?? "");
          const name = String(json.name ?? "").trim();
          const text = String(json.text ?? "").trim();
          const rating = Number(json.rating);
          const title = json.title ? String(json.title).trim() : void 0;
          const imageBase64 = json.imageBase64 ? String(json.imageBase64) : void 0;
          if (name.length < 2) {
            sendJson(res, 400, { ok: false, error: "Please enter your name." });
            return;
          }
          if (text.length < 10) {
            sendJson(res, 400, {
              ok: false,
              error: "Please write at least a few words in your review."
            });
            return;
          }
          const normalizedRating = Math.round(rating * 2) / 2;
          if (normalizedRating < 1 || normalizedRating > 5) {
            sendJson(res, 400, { ok: false, error: "Rating must be between 1 and 5 stars." });
            return;
          }
          if (imageBase64 && imageBase64.length > 25e5) {
            sendJson(res, 400, {
              ok: false,
              error: "Photo is too large. Please use an image under 2MB."
            });
            return;
          }
          const upstream = await fetch(submitWebhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productHandle,
              name,
              rating: normalizedRating,
              title,
              text,
              hasImage: Boolean(imageBase64)
            })
          });
          const data = await upstream.json().catch(() => null);
          if (!upstream.ok) {
            sendJson(res, upstream.status, {
              ok: false,
              error: data?.error ?? "Could not submit your review. Please try again."
            });
            return;
          }
          sendJson(res, 200, {
            ok: true,
            pending: true,
            message: data?.message ?? "Thank you! Your review will be published shortly."
          });
          return;
        }
      }
      sendJson(res, 404, { error: "Not found" });
    } catch (err) {
      console.error("[review-api]", err);
      sendJson(res, 500, { error: "Something went wrong. Please try again." });
    }
  };
}

// server/contactApiMiddleware.ts
var DEFAULT_CONTACT_FORM_WEBHOOK_URL = "https://layngo.app.n8n.cloud/webhook/layngo-contact-form";
function readBody2(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}
function sendJson2(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}
function createContactApiMiddleware(env) {
  return async (req, res, next) => {
    if (req.url !== "/api/contact" || req.method !== "POST") {
      next();
      return;
    }
    try {
      const body = await readBody2(req);
      const payload = body ? JSON.parse(body) : {};
      const webhookUrl = env.CONTACT_FORM_WEBHOOK_URL || DEFAULT_CONTACT_FORM_WEBHOOK_URL;
      const upstream = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await upstream.json().catch(() => null);
      if (!upstream.ok) {
        sendJson2(res, upstream.status, {
          ok: false,
          error: data?.error ?? "Could not send your message. Please try again or email info@layngo.com."
        });
        return;
      }
      sendJson2(res, 200, {
        ok: true,
        message: data?.message ?? "Thanks \u2014 we received your message and will get back to you soon."
      });
    } catch (err) {
      console.error("[contact-api]", err);
      sendJson2(res, 500, {
        ok: false,
        error: "Could not send your message. Please try again or email info@layngo.com."
      });
    }
  };
}

// server/discountOtpStore.ts
var store = /* @__PURE__ */ new Map();
function normalizePhone(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return digits;
  if (digits.length === 10) return `1${digits}`;
  return digits;
}
function otpKey(phone) {
  return normalizePhone(phone);
}
function saveOtp(phone, email, marketingConsent, code, ttlMs = 10 * 60 * 1e3) {
  const key = otpKey(phone);
  store.set(key, {
    email: email.trim().toLowerCase(),
    phone: key,
    marketingConsent,
    code,
    expiresAt: Date.now() + ttlMs
  });
}
function verifyOtp(phone, email, code) {
  const key = otpKey(phone);
  const record = store.get(key);
  if (!record) {
    return { ok: false, error: "No verification code found. Request a new code." };
  }
  if (Date.now() > record.expiresAt) {
    store.delete(key);
    return { ok: false, error: "That code expired. Request a new one." };
  }
  if (record.email !== email.trim().toLowerCase()) {
    return { ok: false, error: "Email does not match this verification." };
  }
  if (record.code !== code.trim()) {
    return { ok: false, error: "Incorrect code. Try again." };
  }
  store.delete(key);
  return { ok: true, record };
}
function generateOtpCode() {
  return String(Math.floor(1e5 + Math.random() * 9e5));
}

// server/shopifyDiscountCodes.ts
var ADMIN_API_VERSION = "2025-07";
var CREATE_DISCOUNT_MUTATION = `
  mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
    discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
      codeDiscountNode { id }
      userErrors { field message }
    }
  }
`;
function generatePopupCode() {
  return `LNG${Math.floor(1e5 + Math.random() * 9e5)}`;
}
async function createShopifyDiscountCode(options, env) {
  const token = env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const shop = env.SHOPIFY_STORE_DOMAIN || "layngo-new.myshopify.com";
  if (!token) {
    return {
      ok: false,
      error: "Shopify discount creation is not configured."
    };
  }
  const startsAt = (/* @__PURE__ */ new Date()).toISOString();
  const endsAt = new Date(Date.now() + options.validDays * 24 * 60 * 60 * 1e3).toISOString();
  const response = await fetch(`https://${shop}/admin/api/${ADMIN_API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token
    },
    body: JSON.stringify({
      query: CREATE_DISCOUNT_MUTATION,
      variables: {
        basicCodeDiscount: {
          title: options.title,
          code: options.code,
          startsAt,
          endsAt,
          customerSelection: { all: true },
          customerGets: {
            value: { percentage: options.percentage },
            items: { all: true }
          },
          usageLimit: 1,
          appliesOncePerCustomer: true
        }
      }
    })
  });
  if (!response.ok) {
    return { ok: false, error: "Could not reach Shopify to create your discount code." };
  }
  const payload = await response.json();
  if (payload.errors?.length) {
    return { ok: false, error: payload.errors.map((e) => e.message).join(", ") };
  }
  const result = payload.data?.discountCodeBasicCreate;
  const userErrors = result?.userErrors ?? [];
  if (userErrors.length) {
    return { ok: false, error: userErrors.map((e) => e.message).join(", ") };
  }
  const shopifyId = result?.codeDiscountNode?.id;
  if (!shopifyId) {
    return { ok: false, error: "Shopify did not create the discount code." };
  }
  return { ok: true, shopifyId };
}
async function createPopupSignupDiscount(env, code = generatePopupCode()) {
  const result = await createShopifyDiscountCode(
    {
      code,
      title: `Popup signup ${code}`,
      percentage: 0.15,
      validDays: 10
    },
    env
  );
  if (!result.ok) {
    return { ...result, code };
  }
  return { ...result, code };
}

// server/discountApiMiddleware.ts
var DEFAULT_SEND_CODE_WEBHOOK = "https://layngo.app.n8n.cloud/webhook/layngo-discount-send-code";
var DEFAULT_VERIFY_CODE_WEBHOOK = "https://layngo.app.n8n.cloud/webhook/layngo-discount-verify";
function readBody3(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}
function sendJson3(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPhone(phone) {
  return phone.replace(/\D/g, "").length >= 10;
}
async function proxyToN8n(webhookUrl, payload) {
  const upstream = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await upstream.json().catch(() => null);
  return { upstream, data };
}
function createDiscountApiMiddleware(env) {
  const sendWebhook = env.DISCOUNT_SEND_CODE_WEBHOOK_URL || DEFAULT_SEND_CODE_WEBHOOK;
  const verifyWebhook = env.DISCOUNT_VERIFY_CODE_WEBHOOK_URL || DEFAULT_VERIFY_CODE_WEBHOOK;
  const useN8nOtp = env.DISCOUNT_OTP_VIA_N8N === "true";
  return async (req, res, next) => {
    const url = req.url?.split("?")[0];
    if (req.method !== "POST") {
      next();
      return;
    }
    if (url === "/api/discount/send-code") {
      try {
        const body = await readBody3(req);
        const payload = body ? JSON.parse(body) : {};
        const email = String(payload.email ?? "").trim();
        const phone = String(payload.phone ?? "").trim();
        const marketingConsent = payload.marketingConsent === true;
        if (!isValidEmail(email)) {
          sendJson3(res, 400, { ok: false, error: "Please enter a valid email." });
          return;
        }
        if (!isValidPhone(phone)) {
          sendJson3(res, 400, { ok: false, error: "Please enter a valid phone number." });
          return;
        }
        if (!marketingConsent) {
          sendJson3(res, 400, {
            ok: false,
            error: "Please agree to receive texts and marketing emails."
          });
          return;
        }
        if (useN8nOtp) {
          const { upstream: upstream2, data: data2 } = await proxyToN8n(sendWebhook, {
            email,
            phone,
            marketingConsent
          });
          if (!upstream2.ok) {
            sendJson3(res, upstream2.status, {
              ok: false,
              error: data2?.error ?? "Could not send verification code."
            });
            return;
          }
          sendJson3(res, 200, {
            ok: true,
            message: data2?.message ?? "Verification code sent."
          });
          return;
        }
        const code = generateOtpCode();
        saveOtp(phone, email, marketingConsent, code);
        if (env.NODE_ENV !== "production") {
          console.info(`[discount-otp] ${phone} \u2192 ${code}`);
        }
        const { upstream, data } = await proxyToN8n(sendWebhook, {
          email,
          phone,
          marketingConsent,
          code,
          devMode: true
        }).catch(() => ({ upstream: { ok: true }, data: null }));
        if (!upstream.ok) {
          console.warn("[discount-api] n8n send-code webhook failed; OTP still stored locally");
        }
        sendJson3(res, 200, {
          ok: true,
          message: data?.message ?? "Check your email for the code."
        });
      } catch (err) {
        console.error("[discount-api] send-code", err);
        sendJson3(res, 500, { ok: false, error: "Could not send verification code." });
      }
      return;
    }
    if (url === "/api/discount/verify-code") {
      try {
        const body = await readBody3(req);
        const payload = body ? JSON.parse(body) : {};
        const email = String(payload.email ?? "").trim();
        const phone = String(payload.phone ?? "").trim();
        const code = String(payload.code ?? "").trim();
        if (!isValidEmail(email) || !isValidPhone(phone) || code.length < 4) {
          sendJson3(res, 400, { ok: false, error: "Invalid verification request." });
          return;
        }
        if (!useN8nOtp) {
          const result = verifyOtp(phone, email, code);
          if (!result.ok) {
            sendJson3(res, 400, result);
            return;
          }
          const shopifyResult = await createPopupSignupDiscount(env);
          if (!shopifyResult.ok) {
            sendJson3(res, 500, { ok: false, error: shopifyResult.error });
            return;
          }
          const { upstream: upstream2, data: data2 } = await proxyToN8n(verifyWebhook, {
            email: result.record.email,
            phone: result.record.phone,
            marketingConsent: result.record.marketingConsent,
            verified: true,
            discountCode: shopifyResult.code,
            shopifyCreated: true,
            shopifyDiscountId: shopifyResult.shopifyId
          });
          if (!upstream2.ok) {
            sendJson3(res, upstream2.status, {
              ok: false,
              error: data2?.error ?? "Could not complete signup."
            });
            return;
          }
          sendJson3(res, 200, {
            ok: true,
            message: data2?.message ?? "You're verified! Your code lasts 10 days \u2014 use it at checkout.",
            discountCode: shopifyResult.code
          });
          return;
        }
        const { upstream, data } = await proxyToN8n(verifyWebhook, {
          email,
          phone,
          code
        });
        if (!upstream.ok) {
          sendJson3(res, upstream.status, {
            ok: false,
            error: data?.error ?? "Incorrect or expired code."
          });
          return;
        }
        sendJson3(res, 200, {
          ok: true,
          message: data?.message ?? "You're verified! Use your code at checkout.",
          discountCode: data?.discountCode
        });
      } catch (err) {
        console.error("[discount-api] verify-code", err);
        sendJson3(res, 500, { ok: false, error: "Could not verify code." });
      }
      return;
    }
    next();
  };
}

// server/newsletterApiMiddleware.ts
var DEFAULT_NEWSLETTER_WEBHOOK_URL = "https://layngo.app.n8n.cloud/webhook/layngo-newsletter-signup";
function readBody4(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}
function sendJson4(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}
function isValidEmail2(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function createNewsletterApiMiddleware(env) {
  return async (req, res, next) => {
    if (req.url !== "/api/newsletter" || req.method !== "POST") {
      next();
      return;
    }
    try {
      const body = await readBody4(req);
      const payload = body ? JSON.parse(body) : {};
      const email = String(payload.email ?? "").trim();
      if (!isValidEmail2(email)) {
        sendJson4(res, 400, { ok: false, error: "Please enter a valid email address." });
        return;
      }
      const webhookUrl = env.NEWSLETTER_WEBHOOK_URL || DEFAULT_NEWSLETTER_WEBHOOK_URL;
      const upstream = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await upstream.json().catch(() => null);
      if (!upstream.ok) {
        sendJson4(res, upstream.status, {
          ok: false,
          error: data?.error ?? "Could not join the newsletter. Please try again."
        });
        return;
      }
      sendJson4(res, 200, {
        ok: true,
        message: data?.message ?? "You are on the list! Watch your inbox for Lay-n-Go updates."
      });
    } catch (err) {
      console.error("[newsletter-api]", err);
      sendJson4(res, 500, {
        ok: false,
        error: "Could not join the newsletter. Please try again."
      });
    }
  };
}

// src/lib/chatbotKnowledge.ts
var CHAT_PRODUCTS = {
  cosmo20: {
    title: 'Lay-n-Go Cosmo 20"',
    subtitle: "Best seller \xB7 Cosmetic bag",
    href: "/product/lay-n-go-cosmo-20",
    image: "/cosmetic-bags-v2/cosmo-20.png"
  },
  cosmoDeluxe22: {
    title: 'Lay-n-Go Cosmo Deluxe 22"',
    subtitle: "Extra room \xB7 Cosmetic bag",
    href: "/product/lay-n-go-cosmo-deluxe-22",
    image: "/cosmetic-bags-v2/cosmo-22.png"
  },
  traveler20: {
    title: 'Lay-n-Go Traveler 20"',
    subtitle: "Tech & travel organizer",
    href: "/product/lay-n-go-traveler-20",
    image: "/products/lay-n-go-traveler-20/traveler-gallery-1.png"
  },
  nailspa18: {
    title: 'Lay-n-Go Nailspa 18"',
    subtitle: "Salon & at-home manicures",
    href: "/product/lay-n-go-nailspa-18",
    image: "/products/lay-n-go-nailspa-18/heroes/dot-calm.png"
  },
  dogBed44: {
    title: 'Lay-n-Go Travel Dog Bed 44"',
    subtitle: "Portable pet bed",
    href: "/product/lay-n-go-travel-dog-bed-44",
    image: "/products/lay-n-go-travel-dog-bed-44/gallery-1.png"
  }
};
var CHAT_BEST_SELLERS = [
  CHAT_PRODUCTS.cosmo20,
  CHAT_PRODUCTS.cosmoDeluxe22,
  CHAT_PRODUCTS.traveler20
];
var CHAT_KNOWLEDGE_TEXT = `
Lay-n-Go (layngo.com) \u2014 patented drawstring organizational solutions. Products open flat for full visibility, then cinch closed for storage and travel. Founded by Amy and Adam Fazackerley; 16+ years in business.

BRAND PITCH: "Organizational Solutions for Life, Play, and Travel." Homepage tagline for Cosmo: "The last bag you'll ever need."

CATEGORIES & COLLECTIONS:
- Cosmetic Bags / COSMO: /shop/cosmetic-bags-v2 \u2014 makeup & beauty bags (Cosmo 16", 20", Deluxe 22")
- Nail Solutions / NAILSPA: /product/lay-n-go-nailspa-18
- Play (toy cleanup, play mats): /collections/play
- Tech & Travel / TRAVELER: /product/lay-n-go-traveler-20
- Pet Solutions: /product/lay-n-go-travel-dog-bed-44
- Outdoor / Tactical / Military & First Responder: /collections/military-first-responder
- All collections: /collections

TOP PRODUCTS:
- Lay-n-Go Cosmo 20" (/product/lay-n-go-cosmo-20) \u2014 flagship cosmetic bag, best seller
- Lay-n-Go Cosmo Deluxe 22" (/product/lay-n-go-cosmo-deluxe-22)
- Lay-n-Go Traveler 20" (/product/lay-n-go-traveler-20) \u2014 tech & travel
- Lay-n-Go Nailspa 18" (/product/lay-n-go-nailspa-18)
- Lay-n-Go Travel Dog Bed 44" (/product/lay-n-go-travel-dog-bed-44)

HOW IT WORKS: Patented drawstring mat design \u2014 lay flat to see and use everything, pull drawstrings to cinch into a bag. Utility patents include U.S. 9,084,459; 10,016,036; 10,561,213; 11,116,298. Patents page: /pages/lay-n-go-patents

ABOUT / OUR STORY: /pages/about-us. Founders Amy & Adam. Started from solving everyday organization problems (toy cleanup, cosmetics, travel). 16+ years in business, 100k+ customers, 200+ wholesale partners.

PRESS: Featured in BuzzFeed, Parents, People, Today Show, Lifehacker, Cond\xE9 Nast Traveler, Oprah Daily, GMA, and more. Press page: /pages/press

SHIPPING (/policies/shipping-policy):
- Ships to U.S. and regions available at checkout
- Economy 5\u20138 business days; Standard 3\u20134; Express 1\u20132 (after order ships)
- Same-day processing for orders before 1:00 p.m. cutoff when inventory allows
- Tracking emailed when carrier number available; rates at checkout

RETURNS (/pages/return-policy):
- 14 days from delivery; unused with original packaging
- Email info@layngo.com with layngo.com order number for Return Authorization (RA)
- Customer pays return shipping; original shipping not refunded

CONTACT: info@layngo.com | Fax 703.995.4916 | /pages/contact
WHOLESALE: Inquiries via contact form at /pages/contact#wholesale \u2014 16+ years, 200+ wholesale partners

SMS (/policies/sms-policy): Transactional, marketing, and service texts. Opt out anytime by replying STOP. Reply START to opt back in. HELP for support. Message/data rates may apply.

TERMS & PRIVACY: /policies/terms-of-service (combined terms and privacy)

ACCOUNT / ORDERS: Login at https://www.layngo.com/account/login for order history

DISCOUNT: First-visit popup on homepage may offer signup discount with email/phone verification.

SEARCH: /search to find products on site.
`.trim();
var TOPIC_MATCHERS = [
  {
    test: /^(hi|hey|hello|howdy|greetings|good\s+(morning|afternoon|evening)|sup|yo|hiya|heya)\b[\s!.,?]*$|^(hi|hey|hello|howdy)\b[\s,]+(there|everyone|folks|team|lay-n-go)/i,
    reply: {
      content: "Hi there! Welcome to Lay-n-Go. I can help with our products (Cosmo cosmetic bags, Play mats, Traveler, and more), shipping, returns, or our story. What can I help you with today?",
      links: [{ label: "Shop collections", href: "/collections" }]
    }
  },
  {
    test: /^(thanks|thank\s+you|thx|ty|appreciate\s+it|much\s+appreciated)\b/i,
    reply: {
      content: "You're welcome! If you have any other questions about Lay-n-Go, just ask."
    }
  },
  {
    test: /^(bye|goodbye|see\s+ya|see\s+you|later|take\s+care|good\s+night)\b/i,
    reply: {
      content: "Goodbye! Feel free to come back anytime \u2014 or email info@layngo.com if you need a hand from our team.",
      links: [{ label: "Contact us", href: "/pages/contact" }]
    }
  },
  {
    test: /what\s+can\s+you\s+(do|help)|how\s+can\s+you\s+help|who\s+are\s+you|what\s+are\s+you|help\s+me/i,
    reply: {
      content: "I'm the Lay-n-Go assistant. Ask me about best sellers, product categories, shipping, returns, wholesale, or how our patented open-flat, cinch-closed bags work \u2014 I'll point you to the right page or policy.",
      links: [
        { label: 'Best seller \u2014 Cosmo 20"', href: "/product/lay-n-go-cosmo-20" },
        { label: "Contact support", href: "/pages/contact" }
      ]
    }
  },
  {
    test: /how\s+are\s+you|how\s+is\s+it\s+going|what'?s\s+up|whats\s+up/i,
    reply: {
      content: "Doing great, thanks for asking! I'm here to help with Lay-n-Go products and orders. What would you like to know?"
    }
  },
  {
    test: /^(ok|okay|cool|great|perfect|awesome|got\s+it|understood|nice)\b[\s!.,?]*$/i,
    reply: {
      content: "Glad that helps! Let me know if you want to explore products, shipping, or anything else."
    }
  },
  {
    test: /best\s*seller|top\s*sell|popular|bestseller|most\s*popular|what\s*should\s*i\s*buy/i,
    reply: {
      content: 'Our #1 best seller is the Lay-n-Go Cosmo 20" \u2014 the patented cosmetic bag that opens flat so you can see everything, then cinches closed for travel. The Cosmo Deluxe 22" and Traveler 20" are also customer favorites.',
      products: CHAT_BEST_SELLERS,
      links: [{ label: "Browse all collections", href: "/collections" }]
    }
  },
  {
    test: /cosmo|makeup\s*bag|cosmetic\s*bag|beauty\s*bag|make\s*up/i,
    reply: {
      content: 'Cosmo is our signature cosmetic line. The Cosmo 20" is our best seller \u2014 opens flat like a mat, cinches into a bag. The Cosmo Deluxe 22" offers extra room. Both come in multiple colors and patterns.',
      products: [CHAT_PRODUCTS.cosmo20, CHAT_PRODUCTS.cosmoDeluxe22],
      links: [{ label: "Cosmetic bags", href: "/shop/cosmetic-bags-v2" }]
    }
  },
  {
    test: /traveler|tech\s*(\+|and)\s*travel|tech\s*travel|laptop|charger|cable|electronic/i,
    reply: {
      content: 'The Lay-n-Go Traveler 20" is built for tech and travel \u2014 opens flat so you can see cables, chargers, and gadgets, then cinches closed. Great for work trips and everyday carry.',
      products: [CHAT_PRODUCTS.traveler20],
      links: [{ label: "Tech & travel collection", href: "/collections/technology" }]
    }
  },
  {
    test: /play|toy|lego|cleanup|clean\s*up|kids/i,
    reply: {
      content: "Our Play collection uses the same patented open-flat, cinch-closed design for toy cleanup \u2014 spread toys out on the mat, then pull the drawstring to gather everything in seconds. Perfect for LEGO and playroom organization.",
      links: [{ label: "Shop Play", href: "/collections/play" }]
    }
  },
  {
    test: /pet|dog|cat|travel\s*bed|animal/i,
    reply: {
      content: 'Pet Solutions include the Lay-n-Go Travel Dog Bed (44") \u2014 a portable bed that packs down for travel. Browse our pet collection for gear designed to go wherever your pet goes.',
      products: [CHAT_PRODUCTS.dogBed44],
      links: [{ label: "Pet collection", href: "/collections/pet-solutions" }]
    }
  },
  {
    test: /nail|nailspa|manicure|salon/i,
    reply: {
      content: 'The Lay-n-Go Nailspa 18" is designed for nail techs and at-home manicures \u2014 opens flat for tools and polish, cinches closed for storage and travel between clients or appointments.',
      products: [CHAT_PRODUCTS.nailspa18]
    }
  },
  {
    test: /tactical|military|first\s*responder|outdoor|defender|duty/i,
    reply: {
      content: "Our Outdoor / Tactical line includes military and first-responder gear \u2014 organized storage that opens flat in the field and cinches for transport. See the full collection for Defender and tactical options.",
      links: [{ label: "Outdoor / Tactical", href: "/collections/military-first-responder" }]
    }
  },
  {
    test: /how\s*(does|do)\s*(it|they)\s*work|drawstring|open\s*flat|patent|invention|what\s*is\s*lay.?n.?go/i,
    reply: {
      content: "Lay-n-Go is a patented drawstring mat that opens flat so you can see and use everything, then cinches closed into a bag for storage or travel. It started with toy cleanup and now covers cosmetics, tech, travel, pets, nails, and tactical gear.",
      links: [
        { label: "Our story", href: "/pages/about-us" },
        { label: "Patents", href: "/pages/lay-n-go-patents" }
      ]
    }
  },
  {
    test: /about|story|founder|amy|adam|history|years\s*in\s*business|who\s*(are|is)\s*lay/i,
    reply: {
      content: 'Lay-n-Go was founded by Amy and Adam Fazackerley \u2014 16+ years in business, 100k+ customers served. It started with a simple idea: "There has to be a better way to do this." Read the full founder story on our About page.',
      links: [
        { label: "Our story", href: "/pages/about-us" },
        { label: "Contact", href: "/pages/contact" }
      ]
    }
  },
  {
    test: /press|featured|magazine|media|buzzfeed|today\s*show|traveler\s*mag/i,
    reply: {
      content: "Lay-n-Go has been featured in BuzzFeed, Parents, People, the Today Show, Lifehacker, Cond\xE9 Nast Traveler, Oprah Daily, Good Morning America, and many more. Browse press highlights and articles on our Press page.",
      links: [{ label: "Press & media", href: "/pages/press" }]
    }
  },
  {
    test: /wholesale|retail\s*partner|carry\s*lay|distributor|bulk|store\s*order/i,
    reply: {
      content: "We work with 200+ wholesale partners. For wholesale inquiries, use our contact form and select the wholesale topic \u2014 include your company details and our team will follow up.",
      links: [{ label: "Wholesale inquiry", href: "/pages/contact#wholesale" }]
    }
  },
  {
    test: /return|refund|exchange|send\s*back/i,
    reply: {
      content: "We accept returns within 14 days of delivery. Items must be unused with original packaging. Email info@layngo.com with your layngo.com order number to get a Return Authorization (RA) number before shipping anything back. Return shipping is paid by the customer and original shipping charges are not refunded.",
      links: [
        { label: "Return policy", href: "/pages/return-policy" },
        { label: "Contact us", href: "/pages/contact" }
      ]
    }
  },
  {
    test: /ship|shipping|deliver|delivery|how\s*long|when\s*will|track|tracking/i,
    reply: {
      content: "We ship to the United States and other regions shown at checkout. After your order ships: Economy is 5\u20138 business days, Standard is 3\u20134 business days, and Express is 1\u20132 business days. Orders placed before 1:00 p.m. are processed the same business day when inventory allows. You'll get tracking by email when your package ships.",
      links: [
        { label: "Shipping policy", href: "/policies/shipping-policy" },
        { label: "Shop now", href: "/collections" }
      ]
    }
  },
  {
    test: /sms|text\s*message|stop|start|opt.?out|subscribe.*text|phone\s*number/i,
    reply: {
      content: "We may send transactional texts (orders, shipping, OTP codes) and marketing texts if you opt in. Reply STOP anytime to unsubscribe \u2014 you'll get one confirmation message. Reply START to opt back in, or HELP for support. Message and data rates may apply.",
      links: [{ label: "SMS policy", href: "/policies/sms-policy" }]
    }
  },
  {
    test: /discount|coupon|promo|code|sale|off\s*percent|first\s*visit|signup/i,
    reply: {
      content: "We occasionally offer promotional discounts \u2014 including a first-visit signup offer on our homepage. Enter your email (and verify your phone when prompted) to receive a discount code. Promotions and free-shipping offers, when active, appear at checkout.",
      links: [{ label: "Shop collections", href: "/collections" }]
    }
  },
  {
    test: /order|account|login|where\s*is\s*my|status/i,
    reply: {
      content: "For order status and history, log in to your Lay-n-Go account. If you need help with a specific order, email info@layngo.com with your order number and we'll assist you.",
      links: [
        { label: "Account login", href: "https://www.layngo.com/account/login" },
        { label: "Contact support", href: "/pages/contact" }
      ]
    }
  },
  {
    test: /privacy|terms|personal\s*data|gdpr|cookie/i,
    reply: {
      content: "Our combined Terms of Service and Privacy Policy explains how we handle your data, orders, and communications. You can read the full policy on our site.",
      links: [{ label: "Terms & privacy", href: "/policies/terms-of-service" }]
    }
  },
  {
    test: /patent|license|intellectual/i,
    reply: {
      content: "Lay-n-Go products are protected by U.S. utility patents including 9,084,459; 10,016,036; 10,561,213; and 11,116,298. For licensing inquiries, email info@layngo.com.",
      links: [{ label: "Patents page", href: "/pages/lay-n-go-patents" }]
    }
  },
  {
    test: /collection|category|categories|shop|browse|product\s*line|what\s*do\s*you\s*sell/i,
    reply: {
      content: "We organize solutions by category: Cosmetic Bags, Nail Solutions, Play, Tech & Travel, Pet Solutions, and Outdoor / Tactical. Each uses our patented open-flat, cinch-closed design for a different use case.",
      links: [
        { label: "Shop all collections", href: "/collections" },
        { label: "Cosmetic bags", href: "/shop/cosmetic-bags-v2" }
      ]
    }
  },
  {
    test: /contact|email|phone|fax|help|support|reach|talk\s*to/i,
    reply: {
      content: "Reach us at info@layngo.com or fax 703.995.4916. Use our contact form for orders, products, or wholesale inquiries \u2014 we typically respond as soon as possible.",
      links: [{ label: "Contact page", href: "/pages/contact" }]
    }
  },
  {
    test: /price|cost|how\s*much|expensive|afford/i,
    reply: {
      content: "Prices vary by product and are shown on each product page. Select your color or size to see the current price at checkout. Browse collections to compare options.",
      products: [CHAT_PRODUCTS.cosmo20],
      links: [{ label: "Shop collections", href: "/collections" }]
    }
  }
];
function findKnowledgeReply(userMessage) {
  const trimmed = userMessage.trim();
  if (!trimmed) return null;
  for (const { test, reply } of TOPIC_MATCHERS) {
    if (test.test(trimmed)) return reply;
  }
  return null;
}
function answerFromKnowledge(userMessage) {
  const trimmed = userMessage.trim();
  if (!trimmed) {
    return {
      content: "Ask me about products, collections, shipping, returns, our story, wholesale, or anything else about Lay-n-Go."
    };
  }
  const match = findKnowledgeReply(trimmed);
  if (match) return match;
  return {
    content: `I'm not sure I caught that. I'm best at Lay-n-Go product questions, shipping, returns, and our story \u2014 try something like "What are your best sellers?" or say hi and I'll help you get started.`,
    links: [
      { label: "Contact us", href: "/pages/contact" },
      { label: "Shop collections", href: "/collections" }
    ]
  };
}

// server/chatApiMiddleware.ts
function readBody5(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}
function sendJson5(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}
async function answerWithOpenAi(apiKey, messages, model) {
  const systemPrompt = `You are a friendly, warm customer service assistant for Lay-n-Go (layngo.com), a brand that sells patented drawstring organizational bags.

Respond naturally to greetings, thanks, and casual small talk (keep it brief, then offer to help with Lay-n-Go).
Use ONLY the facts below for product, policy, and company questions. If you don't know something, direct the customer to info@layngo.com or /pages/contact.
Keep answers to 2\u20134 short sentences. Do not invent policies, prices, or products.

${CHAT_KNOWLEDGE_TEXT}`;
  const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_tokens: 280,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content }))
      ]
    })
  });
  if (!upstream.ok) {
    const errText = await upstream.text().catch(() => "");
    throw new Error(`OpenAI ${upstream.status}: ${errText.slice(0, 200)}`);
  }
  const data = await upstream.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("Empty OpenAI response");
  const userMessage = messages[messages.length - 1]?.content ?? "";
  const knowledgeMatch = findKnowledgeReply(userMessage);
  const knowledgeFallback = answerFromKnowledge(userMessage);
  return {
    content,
    links: knowledgeMatch?.links ?? knowledgeFallback.links,
    products: knowledgeMatch?.products
  };
}
function createChatApiMiddleware(env) {
  return async (req, res, next) => {
    if (req.url !== "/api/chat" || req.method !== "POST") {
      next();
      return;
    }
    try {
      const body = await readBody5(req);
      const payload = body ? JSON.parse(body) : {};
      const messages = Array.isArray(payload.messages) ? payload.messages : [];
      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      if (!lastUser?.content?.trim()) {
        sendJson5(res, 400, { ok: false, error: "Message is required." });
        return;
      }
      const apiKey = env.OPENAI_API_KEY?.trim();
      const model = env.OPENAI_CHAT_MODEL?.trim() || "gpt-4o-mini";
      const knowledgeMatch = findKnowledgeReply(lastUser.content);
      let reply;
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
      sendJson5(res, 200, { ok: true, reply });
    } catch (err) {
      console.error("[chat-api]", err);
      sendJson5(res, 500, {
        ok: false,
        error: "Could not get a reply. Please try again or email info@layngo.com."
      });
    }
  };
}

// plugins/vite-plugin-review-api.ts
function reviewApiPlugin() {
  return {
    name: "review-api",
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), "");
      server.middlewares.use(createContactApiMiddleware(env));
      server.middlewares.use(createNewsletterApiMiddleware(env));
      server.middlewares.use(createDiscountApiMiddleware(env));
      server.middlewares.use(createReviewApiMiddleware(env));
      server.middlewares.use(createChatApiMiddleware(env));
    },
    configurePreviewServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), "");
      server.middlewares.use(createContactApiMiddleware(env));
      server.middlewares.use(createNewsletterApiMiddleware(env));
      server.middlewares.use(createDiscountApiMiddleware(env));
      server.middlewares.use(createReviewApiMiddleware(env));
      server.middlewares.use(createChatApiMiddleware(env));
    }
  };
}

// vite.config.ts
var __vite_injected_original_dirname = "/Users/tombro/happy-store-bridge-1";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false
    }
  },
  plugins: [react(), reviewApiPlugin(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path2.resolve(__vite_injected_original_dirname, "./src")
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2VydmVyL3Jldmlld1N0b3JlLnRzIiwgInZpdGUuY29uZmlnLnRzIiwgInBsdWdpbnMvdml0ZS1wbHVnaW4tcmV2aWV3LWFwaS50cyIsICJzZXJ2ZXIvcmV2aWV3QXBpTWlkZGxld2FyZS50cyIsICJzZXJ2ZXIvY29udGFjdEFwaU1pZGRsZXdhcmUudHMiLCAic2VydmVyL2Rpc2NvdW50T3RwU3RvcmUudHMiLCAic2VydmVyL3Nob3BpZnlEaXNjb3VudENvZGVzLnRzIiwgInNlcnZlci9kaXNjb3VudEFwaU1pZGRsZXdhcmUudHMiLCAic2VydmVyL25ld3NsZXR0ZXJBcGlNaWRkbGV3YXJlLnRzIiwgInNyYy9saWIvY2hhdGJvdEtub3dsZWRnZS50cyIsICJzZXJ2ZXIvY2hhdEFwaU1pZGRsZXdhcmUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvdG9tYnJvL2hhcHB5LXN0b3JlLWJyaWRnZS0xL3NlcnZlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3RvbWJyby9oYXBweS1zdG9yZS1icmlkZ2UtMS9zZXJ2ZXIvcmV2aWV3U3RvcmUudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3RvbWJyby9oYXBweS1zdG9yZS1icmlkZ2UtMS9zZXJ2ZXIvcmV2aWV3U3RvcmUudHNcIjtpbXBvcnQgeyByYW5kb21VVUlEIH0gZnJvbSBcImNyeXB0b1wiO1xuaW1wb3J0IGZzIGZyb20gXCJmcy9wcm9taXNlc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcblxuZXhwb3J0IHR5cGUgU3RvcmVkQ3VzdG9tZXJSZXZpZXcgPSB7XG4gIGlkOiBzdHJpbmc7XG4gIHByb2R1Y3RIYW5kbGU6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBvcmRlck5hbWU6IHN0cmluZztcbiAgcmF0aW5nOiBudW1iZXI7XG4gIHRpdGxlPzogc3RyaW5nO1xuICB0ZXh0OiBzdHJpbmc7XG4gIGltYWdlcz86IHN0cmluZ1tdO1xuICBjcmVhdGVkQXQ6IHN0cmluZztcbn07XG5cbmNvbnN0IFNUT1JFX1BBVEggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgXCJkYXRhXCIsIFwic3VibWl0dGVkLXJldmlld3MuanNvblwiKTtcblxuYXN5bmMgZnVuY3Rpb24gcmVhZEFsbCgpOiBQcm9taXNlPFN0b3JlZEN1c3RvbWVyUmV2aWV3W10+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCByYXcgPSBhd2FpdCBmcy5yZWFkRmlsZShTVE9SRV9QQVRILCBcInV0ZjhcIik7XG4gICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShyYXcpIGFzIFN0b3JlZEN1c3RvbWVyUmV2aWV3W107XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkocGFyc2VkKSA/IHBhcnNlZCA6IFtdO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gW107XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gd3JpdGVBbGwocmV2aWV3czogU3RvcmVkQ3VzdG9tZXJSZXZpZXdbXSk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBmcy5ta2RpcihwYXRoLmRpcm5hbWUoU1RPUkVfUEFUSCksIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICBhd2FpdCBmcy53cml0ZUZpbGUoU1RPUkVfUEFUSCwgSlNPTi5zdHJpbmdpZnkocmV2aWV3cywgbnVsbCwgMiksIFwidXRmOFwiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxpc3RSZXZpZXdzRm9yUHJvZHVjdChwcm9kdWN0SGFuZGxlOiBzdHJpbmcpOiBQcm9taXNlPFN0b3JlZEN1c3RvbWVyUmV2aWV3W10+IHtcbiAgY29uc3QgYWxsID0gYXdhaXQgcmVhZEFsbCgpO1xuICBjb25zdCB3YW50ZWQgPSBwcm9kdWN0SGFuZGxlLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiBhbGwuZmlsdGVyKChyKSA9PiByLnByb2R1Y3RIYW5kbGUudG9Mb3dlckNhc2UoKSA9PT0gd2FudGVkKTtcbn1cblxuZXhwb3J0IHR5cGUgU3VibWl0UmV2aWV3SW5wdXQgPSB7XG4gIHByb2R1Y3RIYW5kbGU6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICByYXRpbmc6IG51bWJlcjtcbiAgdGl0bGU/OiBzdHJpbmc7XG4gIHRleHQ6IHN0cmluZztcbiAgaW1hZ2VCYXNlNjQ/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3VibWl0UmV2aWV3KFxuICBpbnB1dDogU3VibWl0UmV2aWV3SW5wdXQsXG4pOiBQcm9taXNlPHsgb2s6IHRydWU7IHJldmlldzogU3RvcmVkQ3VzdG9tZXJSZXZpZXcgfSB8IHsgb2s6IGZhbHNlOyBlcnJvcjogc3RyaW5nIH0+IHtcbiAgY29uc3QgbmFtZSA9IGlucHV0Lm5hbWUudHJpbSgpO1xuICBjb25zdCB0ZXh0ID0gaW5wdXQudGV4dC50cmltKCk7XG4gIGlmIChuYW1lLmxlbmd0aCA8IDIpIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6IFwiUGxlYXNlIGVudGVyIHlvdXIgbmFtZS5cIiB9O1xuICBpZiAodGV4dC5sZW5ndGggPCAxMCkgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogXCJQbGVhc2Ugd3JpdGUgYXQgbGVhc3QgYSBmZXcgd29yZHMgaW4geW91ciByZXZpZXcuXCIgfTtcblxuICBjb25zdCByYXRpbmcgPSBNYXRoLnJvdW5kKGlucHV0LnJhdGluZyAqIDIpIC8gMjtcbiAgaWYgKHJhdGluZyA8IDEgfHwgcmF0aW5nID4gNSkge1xuICAgIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6IFwiUmF0aW5nIG11c3QgYmUgYmV0d2VlbiAxIGFuZCA1IHN0YXJzLlwiIH07XG4gIH1cblxuICBsZXQgaW1hZ2VzOiBzdHJpbmdbXSB8IHVuZGVmaW5lZDtcbiAgaWYgKGlucHV0LmltYWdlQmFzZTY0KSB7XG4gICAgaWYgKGlucHV0LmltYWdlQmFzZTY0Lmxlbmd0aCA+IDJfNTAwXzAwMCkge1xuICAgICAgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogXCJQaG90byBpcyB0b28gbGFyZ2UuIFBsZWFzZSB1c2UgYW4gaW1hZ2UgdW5kZXIgMk1CLlwiIH07XG4gICAgfVxuICAgIGltYWdlcyA9IFtpbnB1dC5pbWFnZUJhc2U2NF07XG4gIH1cblxuICBjb25zdCByZXZpZXc6IFN0b3JlZEN1c3RvbWVyUmV2aWV3ID0ge1xuICAgIGlkOiBgc3VibWl0dGVkLSR7cmFuZG9tVVVJRCgpfWAsXG4gICAgcHJvZHVjdEhhbmRsZTogaW5wdXQucHJvZHVjdEhhbmRsZSxcbiAgICBuYW1lLFxuICAgIG9yZGVyTmFtZTogXCJcIixcbiAgICByYXRpbmcsXG4gICAgdGl0bGU6IGlucHV0LnRpdGxlPy50cmltKCkgfHwgdW5kZWZpbmVkLFxuICAgIHRleHQsXG4gICAgaW1hZ2VzLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICB9O1xuXG4gIGNvbnN0IGFsbCA9IGF3YWl0IHJlYWRBbGwoKTtcbiAgYWxsLnB1c2gocmV2aWV3KTtcbiAgYXdhaXQgd3JpdGVBbGwoYWxsKTtcblxuICByZXR1cm4geyBvazogdHJ1ZSwgcmV2aWV3IH07XG59XG5cbmV4cG9ydCB0eXBlIEN1c3RvbWVyUmV2aWV3RHRvID0ge1xuICBpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIHJhdGluZzogbnVtYmVyO1xuICB0aXRsZT86IHN0cmluZztcbiAgdGV4dDogc3RyaW5nO1xuICBpbWFnZXM/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBzdG9yZWRUb0N1c3RvbWVyUmV2aWV3KHI6IFN0b3JlZEN1c3RvbWVyUmV2aWV3KTogQ3VzdG9tZXJSZXZpZXdEdG8ge1xuICByZXR1cm4ge1xuICAgIGlkOiByLmlkLFxuICAgIG5hbWU6IHIubmFtZSxcbiAgICByYXRpbmc6IHIucmF0aW5nLFxuICAgIHRpdGxlOiByLnRpdGxlLFxuICAgIHRleHQ6IHIudGV4dCxcbiAgICBpbWFnZXM6IHIuaW1hZ2VzLFxuICB9O1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvdG9tYnJvL2hhcHB5LXN0b3JlLWJyaWRnZS0xXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvdG9tYnJvL2hhcHB5LXN0b3JlLWJyaWRnZS0xL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy90b21icm8vaGFwcHktc3RvcmUtYnJpZGdlLTEvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcbmltcG9ydCB7IHJldmlld0FwaVBsdWdpbiB9IGZyb20gXCIuL3BsdWdpbnMvdml0ZS1wbHVnaW4tcmV2aWV3LWFwaVwiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCI6OlwiLFxuICAgIHBvcnQ6IDgwODAsXG4gICAgaG1yOiB7XG4gICAgICBvdmVybGF5OiBmYWxzZSxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbcmVhY3QoKSwgcmV2aWV3QXBpUGx1Z2luKCksIG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIiAmJiBjb21wb25lbnRUYWdnZXIoKV0uZmlsdGVyKEJvb2xlYW4pLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gICAgZGVkdXBlOiBbXCJyZWFjdFwiLCBcInJlYWN0LWRvbVwiLCBcInJlYWN0L2pzeC1ydW50aW1lXCIsIFwicmVhY3QvanN4LWRldi1ydW50aW1lXCIsIFwiQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5XCIsIFwiQHRhbnN0YWNrL3F1ZXJ5LWNvcmVcIl0sXG4gIH0sXG59KSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy90b21icm8vaGFwcHktc3RvcmUtYnJpZGdlLTEvcGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3RvbWJyby9oYXBweS1zdG9yZS1icmlkZ2UtMS9wbHVnaW5zL3ZpdGUtcGx1Z2luLXJldmlldy1hcGkudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3RvbWJyby9oYXBweS1zdG9yZS1icmlkZ2UtMS9wbHVnaW5zL3ZpdGUtcGx1Z2luLXJldmlldy1hcGkudHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgeyBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IGNyZWF0ZVJldmlld0FwaU1pZGRsZXdhcmUgfSBmcm9tIFwiLi4vc2VydmVyL3Jldmlld0FwaU1pZGRsZXdhcmVcIjtcbmltcG9ydCB7IGNyZWF0ZUNvbnRhY3RBcGlNaWRkbGV3YXJlIH0gZnJvbSBcIi4uL3NlcnZlci9jb250YWN0QXBpTWlkZGxld2FyZVwiO1xuaW1wb3J0IHsgY3JlYXRlRGlzY291bnRBcGlNaWRkbGV3YXJlIH0gZnJvbSBcIi4uL3NlcnZlci9kaXNjb3VudEFwaU1pZGRsZXdhcmVcIjtcbmltcG9ydCB7IGNyZWF0ZU5ld3NsZXR0ZXJBcGlNaWRkbGV3YXJlIH0gZnJvbSBcIi4uL3NlcnZlci9uZXdzbGV0dGVyQXBpTWlkZGxld2FyZVwiO1xuaW1wb3J0IHsgY3JlYXRlQ2hhdEFwaU1pZGRsZXdhcmUgfSBmcm9tIFwiLi4vc2VydmVyL2NoYXRBcGlNaWRkbGV3YXJlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiByZXZpZXdBcGlQbHVnaW4oKTogUGx1Z2luIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBcInJldmlldy1hcGlcIixcbiAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICBjb25zdCBlbnYgPSBsb2FkRW52KHNlcnZlci5jb25maWcubW9kZSwgcHJvY2Vzcy5jd2QoKSwgXCJcIik7XG4gICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKGNyZWF0ZUNvbnRhY3RBcGlNaWRkbGV3YXJlKGVudikpO1xuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShjcmVhdGVOZXdzbGV0dGVyQXBpTWlkZGxld2FyZShlbnYpKTtcbiAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoY3JlYXRlRGlzY291bnRBcGlNaWRkbGV3YXJlKGVudikpO1xuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShjcmVhdGVSZXZpZXdBcGlNaWRkbGV3YXJlKGVudikpO1xuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShjcmVhdGVDaGF0QXBpTWlkZGxld2FyZShlbnYpKTtcbiAgICB9LFxuICAgIGNvbmZpZ3VyZVByZXZpZXdTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICBjb25zdCBlbnYgPSBsb2FkRW52KHNlcnZlci5jb25maWcubW9kZSwgcHJvY2Vzcy5jd2QoKSwgXCJcIik7XG4gICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKGNyZWF0ZUNvbnRhY3RBcGlNaWRkbGV3YXJlKGVudikpO1xuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShjcmVhdGVOZXdzbGV0dGVyQXBpTWlkZGxld2FyZShlbnYpKTtcbiAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoY3JlYXRlRGlzY291bnRBcGlNaWRkbGV3YXJlKGVudikpO1xuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShjcmVhdGVSZXZpZXdBcGlNaWRkbGV3YXJlKGVudikpO1xuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShjcmVhdGVDaGF0QXBpTWlkZGxld2FyZShlbnYpKTtcbiAgICB9LFxuICB9O1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvdG9tYnJvL2hhcHB5LXN0b3JlLWJyaWRnZS0xL3NlcnZlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3RvbWJyby9oYXBweS1zdG9yZS1icmlkZ2UtMS9zZXJ2ZXIvcmV2aWV3QXBpTWlkZGxld2FyZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvdG9tYnJvL2hhcHB5LXN0b3JlLWJyaWRnZS0xL3NlcnZlci9yZXZpZXdBcGlNaWRkbGV3YXJlLnRzXCI7aW1wb3J0IHR5cGUgeyBJbmNvbWluZ01lc3NhZ2UsIFNlcnZlclJlc3BvbnNlIH0gZnJvbSBcImh0dHBcIjtcbmltcG9ydCB7IFVSTCB9IGZyb20gXCJ1cmxcIjtcblxuY29uc3QgREVGQVVMVF9SRVZJRVdfU1VCTUlUX1dFQkhPT0sgPVxuICBcImh0dHBzOi8vbGF5bmdvLmFwcC5uOG4uY2xvdWQvd2ViaG9vay9sYXluZ28tcmV2aWV3LXN1Ym1pdFwiO1xuY29uc3QgREVGQVVMVF9SRVZJRVdTX0xJU1RfV0VCSE9PSyA9XG4gIFwiaHR0cHM6Ly9sYXluZ28uYXBwLm44bi5jbG91ZC93ZWJob29rL2xheW5nby1yZXZpZXdzLWxpc3RcIjtcblxuZnVuY3Rpb24gcmVhZEJvZHkocmVxOiBJbmNvbWluZ01lc3NhZ2UpOiBQcm9taXNlPHN0cmluZz4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGNodW5rczogQnVmZmVyW10gPSBbXTtcbiAgICByZXEub24oXCJkYXRhXCIsIChjKSA9PiBjaHVua3MucHVzaChjKSk7XG4gICAgcmVxLm9uKFwiZW5kXCIsICgpID0+IHJlc29sdmUoQnVmZmVyLmNvbmNhdChjaHVua3MpLnRvU3RyaW5nKFwidXRmOFwiKSkpO1xuICAgIHJlcS5vbihcImVycm9yXCIsIHJlamVjdCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzZW5kSnNvbihyZXM6IFNlcnZlclJlc3BvbnNlLCBzdGF0dXM6IG51bWJlciwgZGF0YTogdW5rbm93bikge1xuICByZXMuc3RhdHVzQ29kZSA9IHN0YXR1cztcbiAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBmZXRjaFB1Ymxpc2hlZFJldmlld3MoXG4gIHByb2R1Y3RIYW5kbGU6IHN0cmluZyxcbiAgd2ViaG9va1VybDogc3RyaW5nLFxuKTogUHJvbWlzZTx1bmtub3duW10+IHtcbiAgY29uc3QgdXJsID0gYCR7d2ViaG9va1VybH0/cHJvZHVjdEhhbmRsZT0ke2VuY29kZVVSSUNvbXBvbmVudChwcm9kdWN0SGFuZGxlKX1gO1xuICBjb25zdCB1cHN0cmVhbSA9IGF3YWl0IGZldGNoKHVybCwgeyBtZXRob2Q6IFwiR0VUXCIgfSk7XG4gIGlmICghdXBzdHJlYW0ub2spIHJldHVybiBbXTtcbiAgY29uc3QgZGF0YSA9IChhd2FpdCB1cHN0cmVhbS5qc29uKCkuY2F0Y2goKCkgPT4gbnVsbCkpIGFzIHsgcmV2aWV3cz86IHVua25vd25bXSB9IHwgbnVsbDtcbiAgcmV0dXJuIGRhdGE/LnJldmlld3MgPz8gW107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSZXZpZXdBcGlNaWRkbGV3YXJlKGVudjogUmVjb3JkPHN0cmluZywgc3RyaW5nPikge1xuICBjb25zdCBzdWJtaXRXZWJob29rID0gZW52LlJFVklFV19TVUJNSVRfV0VCSE9PS19VUkwgfHwgREVGQVVMVF9SRVZJRVdfU1VCTUlUX1dFQkhPT0s7XG4gIGNvbnN0IGxpc3RXZWJob29rID0gZW52LlJFVklFV1NfTElTVF9XRUJIT09LX1VSTCB8fCBERUZBVUxUX1JFVklFV1NfTElTVF9XRUJIT09LO1xuXG4gIHJldHVybiBhc3luYyAocmVxOiBJbmNvbWluZ01lc3NhZ2UsIHJlczogU2VydmVyUmVzcG9uc2UsIG5leHQ6ICgpID0+IHZvaWQpID0+IHtcbiAgICBpZiAoIXJlcS51cmwgfHwgIXJlcS51cmwuc3RhcnRzV2l0aChcIi9hcGkvcmV2aWV3c1wiKSkge1xuICAgICAgbmV4dCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHJlcS51cmwsIFwiaHR0cDovL2xvY2FsaG9zdFwiKTtcbiAgICAgIGNvbnN0IHBhdGhuYW1lID0gdXJsLnBhdGhuYW1lO1xuXG4gICAgICBpZiAocmVxLm1ldGhvZCA9PT0gXCJHRVRcIiAmJiBwYXRobmFtZSA9PT0gXCIvYXBpL3Jldmlld3NcIikge1xuICAgICAgICBjb25zdCBwcm9kdWN0SGFuZGxlID0gdXJsLnNlYXJjaFBhcmFtcy5nZXQoXCJwcm9kdWN0SGFuZGxlXCIpID8/IFwiXCI7XG4gICAgICAgIGNvbnN0IHsgbGlzdFJldmlld3NGb3JQcm9kdWN0LCBzdG9yZWRUb0N1c3RvbWVyUmV2aWV3IH0gPSBhd2FpdCBpbXBvcnQoXCIuL3Jldmlld1N0b3JlXCIpO1xuICAgICAgICBjb25zdCBsb2NhbCA9IGF3YWl0IGxpc3RSZXZpZXdzRm9yUHJvZHVjdChwcm9kdWN0SGFuZGxlKTtcbiAgICAgICAgY29uc3QgcmVtb3RlID0gKGF3YWl0IGZldGNoUHVibGlzaGVkUmV2aWV3cyhwcm9kdWN0SGFuZGxlLCBsaXN0V2ViaG9vaykpIGFzIFJldHVyblR5cGU8XG4gICAgICAgICAgdHlwZW9mIHN0b3JlZFRvQ3VzdG9tZXJSZXZpZXdcbiAgICAgICAgPltdO1xuICAgICAgICBjb25zdCBtZXJnZWQgPSBbLi4ubG9jYWwubWFwKHN0b3JlZFRvQ3VzdG9tZXJSZXZpZXcpLCAuLi5yZW1vdGVdO1xuICAgICAgICBzZW5kSnNvbihyZXMsIDIwMCwgeyByZXZpZXdzOiBtZXJnZWQgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlcS5tZXRob2QgPT09IFwiUE9TVFwiKSB7XG4gICAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCByZWFkQm9keShyZXEpO1xuICAgICAgICBjb25zdCBqc29uID0gYm9keSA/IChKU09OLnBhcnNlKGJvZHkpIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA6IHt9O1xuXG4gICAgICAgIGlmIChwYXRobmFtZSA9PT0gXCIvYXBpL3Jldmlld3Mvc3VibWl0XCIpIHtcbiAgICAgICAgICBjb25zdCBwcm9kdWN0SGFuZGxlID0gU3RyaW5nKGpzb24ucHJvZHVjdEhhbmRsZSA/PyBcIlwiKTtcbiAgICAgICAgICBjb25zdCBuYW1lID0gU3RyaW5nKGpzb24ubmFtZSA/PyBcIlwiKS50cmltKCk7XG4gICAgICAgICAgY29uc3QgdGV4dCA9IFN0cmluZyhqc29uLnRleHQgPz8gXCJcIikudHJpbSgpO1xuICAgICAgICAgIGNvbnN0IHJhdGluZyA9IE51bWJlcihqc29uLnJhdGluZyk7XG4gICAgICAgICAgY29uc3QgdGl0bGUgPSBqc29uLnRpdGxlID8gU3RyaW5nKGpzb24udGl0bGUpLnRyaW0oKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICBjb25zdCBpbWFnZUJhc2U2NCA9IGpzb24uaW1hZ2VCYXNlNjQgPyBTdHJpbmcoanNvbi5pbWFnZUJhc2U2NCkgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICBpZiAobmFtZS5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICBzZW5kSnNvbihyZXMsIDQwMCwgeyBvazogZmFsc2UsIGVycm9yOiBcIlBsZWFzZSBlbnRlciB5b3VyIG5hbWUuXCIgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0ZXh0Lmxlbmd0aCA8IDEwKSB7XG4gICAgICAgICAgICBzZW5kSnNvbihyZXMsIDQwMCwge1xuICAgICAgICAgICAgICBvazogZmFsc2UsXG4gICAgICAgICAgICAgIGVycm9yOiBcIlBsZWFzZSB3cml0ZSBhdCBsZWFzdCBhIGZldyB3b3JkcyBpbiB5b3VyIHJldmlldy5cIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRSYXRpbmcgPSBNYXRoLnJvdW5kKHJhdGluZyAqIDIpIC8gMjtcbiAgICAgICAgICBpZiAobm9ybWFsaXplZFJhdGluZyA8IDEgfHwgbm9ybWFsaXplZFJhdGluZyA+IDUpIHtcbiAgICAgICAgICAgIHNlbmRKc29uKHJlcywgNDAwLCB7IG9rOiBmYWxzZSwgZXJyb3I6IFwiUmF0aW5nIG11c3QgYmUgYmV0d2VlbiAxIGFuZCA1IHN0YXJzLlwiIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpbWFnZUJhc2U2NCAmJiBpbWFnZUJhc2U2NC5sZW5ndGggPiAyXzUwMF8wMDApIHtcbiAgICAgICAgICAgIHNlbmRKc29uKHJlcywgNDAwLCB7XG4gICAgICAgICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgICAgICAgZXJyb3I6IFwiUGhvdG8gaXMgdG9vIGxhcmdlLiBQbGVhc2UgdXNlIGFuIGltYWdlIHVuZGVyIDJNQi5cIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHVwc3RyZWFtID0gYXdhaXQgZmV0Y2goc3VibWl0V2ViaG9vaywge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgcHJvZHVjdEhhbmRsZSxcbiAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgcmF0aW5nOiBub3JtYWxpemVkUmF0aW5nLFxuICAgICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgICAgdGV4dCxcbiAgICAgICAgICAgICAgaGFzSW1hZ2U6IEJvb2xlYW4oaW1hZ2VCYXNlNjQpLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjb25zdCBkYXRhID0gKGF3YWl0IHVwc3RyZWFtLmpzb24oKS5jYXRjaCgoKSA9PiBudWxsKSkgYXMge1xuICAgICAgICAgICAgb2s/OiBib29sZWFuO1xuICAgICAgICAgICAgcGVuZGluZz86IGJvb2xlYW47XG4gICAgICAgICAgICBtZXNzYWdlPzogc3RyaW5nO1xuICAgICAgICAgICAgZXJyb3I/OiBzdHJpbmc7XG4gICAgICAgICAgfSB8IG51bGw7XG5cbiAgICAgICAgICBpZiAoIXVwc3RyZWFtLm9rKSB7XG4gICAgICAgICAgICBzZW5kSnNvbihyZXMsIHVwc3RyZWFtLnN0YXR1cywge1xuICAgICAgICAgICAgICBvazogZmFsc2UsXG4gICAgICAgICAgICAgIGVycm9yOiBkYXRhPy5lcnJvciA/PyBcIkNvdWxkIG5vdCBzdWJtaXQgeW91ciByZXZpZXcuIFBsZWFzZSB0cnkgYWdhaW4uXCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzZW5kSnNvbihyZXMsIDIwMCwge1xuICAgICAgICAgICAgb2s6IHRydWUsXG4gICAgICAgICAgICBwZW5kaW5nOiB0cnVlLFxuICAgICAgICAgICAgbWVzc2FnZTpcbiAgICAgICAgICAgICAgZGF0YT8ubWVzc2FnZSA/PyBcIlRoYW5rIHlvdSEgWW91ciByZXZpZXcgd2lsbCBiZSBwdWJsaXNoZWQgc2hvcnRseS5cIixcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc2VuZEpzb24ocmVzLCA0MDQsIHsgZXJyb3I6IFwiTm90IGZvdW5kXCIgfSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiW3Jldmlldy1hcGldXCIsIGVycik7XG4gICAgICBzZW5kSnNvbihyZXMsIDUwMCwgeyBlcnJvcjogXCJTb21ldGhpbmcgd2VudCB3cm9uZy4gUGxlYXNlIHRyeSBhZ2Fpbi5cIiB9KTtcbiAgICB9XG4gIH07XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy90b21icm8vaGFwcHktc3RvcmUtYnJpZGdlLTEvc2VydmVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvdG9tYnJvL2hhcHB5LXN0b3JlLWJyaWRnZS0xL3NlcnZlci9jb250YWN0QXBpTWlkZGxld2FyZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvdG9tYnJvL2hhcHB5LXN0b3JlLWJyaWRnZS0xL3NlcnZlci9jb250YWN0QXBpTWlkZGxld2FyZS50c1wiO2ltcG9ydCB0eXBlIHsgSW5jb21pbmdNZXNzYWdlLCBTZXJ2ZXJSZXNwb25zZSB9IGZyb20gXCJodHRwXCI7XG5cbmNvbnN0IERFRkFVTFRfQ09OVEFDVF9GT1JNX1dFQkhPT0tfVVJMID1cbiAgXCJodHRwczovL2xheW5nby5hcHAubjhuLmNsb3VkL3dlYmhvb2svbGF5bmdvLWNvbnRhY3QtZm9ybVwiO1xuXG5mdW5jdGlvbiByZWFkQm9keShyZXE6IEluY29taW5nTWVzc2FnZSk6IFByb21pc2U8c3RyaW5nPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgY2h1bmtzOiBCdWZmZXJbXSA9IFtdO1xuICAgIHJlcS5vbihcImRhdGFcIiwgKGMpID0+IGNodW5rcy5wdXNoKGMpKTtcbiAgICByZXEub24oXCJlbmRcIiwgKCkgPT4gcmVzb2x2ZShCdWZmZXIuY29uY2F0KGNodW5rcykudG9TdHJpbmcoXCJ1dGY4XCIpKSk7XG4gICAgcmVxLm9uKFwiZXJyb3JcIiwgcmVqZWN0KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNlbmRKc29uKHJlczogU2VydmVyUmVzcG9uc2UsIHN0YXR1czogbnVtYmVyLCBkYXRhOiB1bmtub3duKSB7XG4gIHJlcy5zdGF0dXNDb2RlID0gc3RhdHVzO1xuICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb250YWN0QXBpTWlkZGxld2FyZShlbnY6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pIHtcbiAgcmV0dXJuIGFzeW5jIChyZXE6IEluY29taW5nTWVzc2FnZSwgcmVzOiBTZXJ2ZXJSZXNwb25zZSwgbmV4dDogKCkgPT4gdm9pZCkgPT4ge1xuICAgIGlmIChyZXEudXJsICE9PSBcIi9hcGkvY29udGFjdFwiIHx8IHJlcS5tZXRob2QgIT09IFwiUE9TVFwiKSB7XG4gICAgICBuZXh0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCByZWFkQm9keShyZXEpO1xuICAgICAgY29uc3QgcGF5bG9hZCA9IGJvZHkgPyBKU09OLnBhcnNlKGJvZHkpIDoge307XG4gICAgICBjb25zdCB3ZWJob29rVXJsID0gZW52LkNPTlRBQ1RfRk9STV9XRUJIT09LX1VSTCB8fCBERUZBVUxUX0NPTlRBQ1RfRk9STV9XRUJIT09LX1VSTDtcblxuICAgICAgY29uc3QgdXBzdHJlYW0gPSBhd2FpdCBmZXRjaCh3ZWJob29rVXJsLCB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocGF5bG9hZCksXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgZGF0YSA9IChhd2FpdCB1cHN0cmVhbS5qc29uKCkuY2F0Y2goKCkgPT4gbnVsbCkpIGFzIHtcbiAgICAgICAgb2s/OiBib29sZWFuO1xuICAgICAgICBtZXNzYWdlPzogc3RyaW5nO1xuICAgICAgICBlcnJvcj86IHN0cmluZztcbiAgICAgIH0gfCBudWxsO1xuXG4gICAgICBpZiAoIXVwc3RyZWFtLm9rKSB7XG4gICAgICAgIHNlbmRKc29uKHJlcywgdXBzdHJlYW0uc3RhdHVzLCB7XG4gICAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICAgIGVycm9yOiBkYXRhPy5lcnJvciA/PyBcIkNvdWxkIG5vdCBzZW5kIHlvdXIgbWVzc2FnZS4gUGxlYXNlIHRyeSBhZ2FpbiBvciBlbWFpbCBpbmZvQGxheW5nby5jb20uXCIsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNlbmRKc29uKHJlcywgMjAwLCB7XG4gICAgICAgIG9rOiB0cnVlLFxuICAgICAgICBtZXNzYWdlOiBkYXRhPy5tZXNzYWdlID8/IFwiVGhhbmtzIFx1MjAxNCB3ZSByZWNlaXZlZCB5b3VyIG1lc3NhZ2UgYW5kIHdpbGwgZ2V0IGJhY2sgdG8geW91IHNvb24uXCIsXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJbY29udGFjdC1hcGldXCIsIGVycik7XG4gICAgICBzZW5kSnNvbihyZXMsIDUwMCwge1xuICAgICAgICBvazogZmFsc2UsXG4gICAgICAgIGVycm9yOiBcIkNvdWxkIG5vdCBzZW5kIHlvdXIgbWVzc2FnZS4gUGxlYXNlIHRyeSBhZ2FpbiBvciBlbWFpbCBpbmZvQGxheW5nby5jb20uXCIsXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy90b21icm8vaGFwcHktc3RvcmUtYnJpZGdlLTEvc2VydmVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvdG9tYnJvL2hhcHB5LXN0b3JlLWJyaWRnZS0xL3NlcnZlci9kaXNjb3VudE90cFN0b3JlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy90b21icm8vaGFwcHktc3RvcmUtYnJpZGdlLTEvc2VydmVyL2Rpc2NvdW50T3RwU3RvcmUudHNcIjt0eXBlIE90cFJlY29yZCA9IHtcbiAgZW1haWw6IHN0cmluZztcbiAgcGhvbmU6IHN0cmluZztcbiAgbWFya2V0aW5nQ29uc2VudDogYm9vbGVhbjtcbiAgY29kZTogc3RyaW5nO1xuICBleHBpcmVzQXQ6IG51bWJlcjtcbn07XG5cbmNvbnN0IHN0b3JlID0gbmV3IE1hcDxzdHJpbmcsIE90cFJlY29yZD4oKTtcblxuZnVuY3Rpb24gbm9ybWFsaXplUGhvbmUocGhvbmU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGRpZ2l0cyA9IHBob25lLnJlcGxhY2UoL1xcRC9nLCBcIlwiKTtcbiAgaWYgKGRpZ2l0cy5sZW5ndGggPT09IDExICYmIGRpZ2l0cy5zdGFydHNXaXRoKFwiMVwiKSkgcmV0dXJuIGRpZ2l0cztcbiAgaWYgKGRpZ2l0cy5sZW5ndGggPT09IDEwKSByZXR1cm4gYDEke2RpZ2l0c31gO1xuICByZXR1cm4gZGlnaXRzO1xufVxuXG5mdW5jdGlvbiBvdHBLZXkocGhvbmU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBub3JtYWxpemVQaG9uZShwaG9uZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlT3RwKFxuICBwaG9uZTogc3RyaW5nLFxuICBlbWFpbDogc3RyaW5nLFxuICBtYXJrZXRpbmdDb25zZW50OiBib29sZWFuLFxuICBjb2RlOiBzdHJpbmcsXG4gIHR0bE1zID0gMTAgKiA2MCAqIDEwMDAsXG4pOiB2b2lkIHtcbiAgY29uc3Qga2V5ID0gb3RwS2V5KHBob25lKTtcbiAgc3RvcmUuc2V0KGtleSwge1xuICAgIGVtYWlsOiBlbWFpbC50cmltKCkudG9Mb3dlckNhc2UoKSxcbiAgICBwaG9uZToga2V5LFxuICAgIG1hcmtldGluZ0NvbnNlbnQsXG4gICAgY29kZSxcbiAgICBleHBpcmVzQXQ6IERhdGUubm93KCkgKyB0dGxNcyxcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2ZXJpZnlPdHAoXG4gIHBob25lOiBzdHJpbmcsXG4gIGVtYWlsOiBzdHJpbmcsXG4gIGNvZGU6IHN0cmluZyxcbik6IHsgb2s6IHRydWU7IHJlY29yZDogT3RwUmVjb3JkIH0gfCB7IG9rOiBmYWxzZTsgZXJyb3I6IHN0cmluZyB9IHtcbiAgY29uc3Qga2V5ID0gb3RwS2V5KHBob25lKTtcbiAgY29uc3QgcmVjb3JkID0gc3RvcmUuZ2V0KGtleSk7XG5cbiAgaWYgKCFyZWNvcmQpIHtcbiAgICByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiBcIk5vIHZlcmlmaWNhdGlvbiBjb2RlIGZvdW5kLiBSZXF1ZXN0IGEgbmV3IGNvZGUuXCIgfTtcbiAgfVxuXG4gIGlmIChEYXRlLm5vdygpID4gcmVjb3JkLmV4cGlyZXNBdCkge1xuICAgIHN0b3JlLmRlbGV0ZShrZXkpO1xuICAgIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6IFwiVGhhdCBjb2RlIGV4cGlyZWQuIFJlcXVlc3QgYSBuZXcgb25lLlwiIH07XG4gIH1cblxuICBpZiAocmVjb3JkLmVtYWlsICE9PSBlbWFpbC50cmltKCkudG9Mb3dlckNhc2UoKSkge1xuICAgIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6IFwiRW1haWwgZG9lcyBub3QgbWF0Y2ggdGhpcyB2ZXJpZmljYXRpb24uXCIgfTtcbiAgfVxuXG4gIGlmIChyZWNvcmQuY29kZSAhPT0gY29kZS50cmltKCkpIHtcbiAgICByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiBcIkluY29ycmVjdCBjb2RlLiBUcnkgYWdhaW4uXCIgfTtcbiAgfVxuXG4gIHN0b3JlLmRlbGV0ZShrZXkpO1xuICByZXR1cm4geyBvazogdHJ1ZSwgcmVjb3JkIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZU90cENvZGUoKTogc3RyaW5nIHtcbiAgcmV0dXJuIFN0cmluZyhNYXRoLmZsb29yKDEwMDAwMCArIE1hdGgucmFuZG9tKCkgKiA5MDAwMDApKTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3RvbWJyby9oYXBweS1zdG9yZS1icmlkZ2UtMS9zZXJ2ZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy90b21icm8vaGFwcHktc3RvcmUtYnJpZGdlLTEvc2VydmVyL3Nob3BpZnlEaXNjb3VudENvZGVzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy90b21icm8vaGFwcHktc3RvcmUtYnJpZGdlLTEvc2VydmVyL3Nob3BpZnlEaXNjb3VudENvZGVzLnRzXCI7Y29uc3QgQURNSU5fQVBJX1ZFUlNJT04gPSBcIjIwMjUtMDdcIjtcblxuY29uc3QgQ1JFQVRFX0RJU0NPVU5UX01VVEFUSU9OID0gYFxuICBtdXRhdGlvbiBkaXNjb3VudENvZGVCYXNpY0NyZWF0ZSgkYmFzaWNDb2RlRGlzY291bnQ6IERpc2NvdW50Q29kZUJhc2ljSW5wdXQhKSB7XG4gICAgZGlzY291bnRDb2RlQmFzaWNDcmVhdGUoYmFzaWNDb2RlRGlzY291bnQ6ICRiYXNpY0NvZGVEaXNjb3VudCkge1xuICAgICAgY29kZURpc2NvdW50Tm9kZSB7IGlkIH1cbiAgICAgIHVzZXJFcnJvcnMgeyBmaWVsZCBtZXNzYWdlIH1cbiAgICB9XG4gIH1cbmA7XG5cbmV4cG9ydCB0eXBlIENyZWF0ZURpc2NvdW50Q29kZU9wdGlvbnMgPSB7XG4gIGNvZGU6IHN0cmluZztcbiAgdGl0bGU6IHN0cmluZztcbiAgcGVyY2VudGFnZTogbnVtYmVyO1xuICB2YWxpZERheXM6IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIENyZWF0ZURpc2NvdW50Q29kZVJlc3VsdCA9XG4gIHwgeyBvazogdHJ1ZTsgc2hvcGlmeUlkOiBzdHJpbmcgfVxuICB8IHsgb2s6IGZhbHNlOyBlcnJvcjogc3RyaW5nIH07XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUG9wdXBDb2RlKCk6IHN0cmluZyB7XG4gIHJldHVybiBgTE5HJHtNYXRoLmZsb29yKDEwMDAwMCArIE1hdGgucmFuZG9tKCkgKiA5MDAwMDApfWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVVuaXF1ZURpc2NvdW50Q29kZShwcmVmaXg6IFwiTE5HXCIgfCBcIkxOUlwiID0gXCJMTkdcIik6IHN0cmluZyB7XG4gIGNvbnN0IHN1ZmZpeCA9IE1hdGguZmxvb3IoMTAwMDAwICsgTWF0aC5yYW5kb20oKSAqIDkwMDAwMCk7XG4gIHJldHVybiBgJHtwcmVmaXh9JHtzdWZmaXh9YDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVNob3BpZnlEaXNjb3VudENvZGUoXG4gIG9wdGlvbnM6IENyZWF0ZURpc2NvdW50Q29kZU9wdGlvbnMsXG4gIGVudjogUmVjb3JkPHN0cmluZywgc3RyaW5nPixcbik6IFByb21pc2U8Q3JlYXRlRGlzY291bnRDb2RlUmVzdWx0PiB7XG4gIGNvbnN0IHRva2VuID0gZW52LlNIT1BJRllfQURNSU5fQUNDRVNTX1RPS0VOO1xuICBjb25zdCBzaG9wID0gZW52LlNIT1BJRllfU1RPUkVfRE9NQUlOIHx8IFwibGF5bmdvLW5ldy5teXNob3BpZnkuY29tXCI7XG5cbiAgaWYgKCF0b2tlbikge1xuICAgIHJldHVybiB7XG4gICAgICBvazogZmFsc2UsXG4gICAgICBlcnJvcjogXCJTaG9waWZ5IGRpc2NvdW50IGNyZWF0aW9uIGlzIG5vdCBjb25maWd1cmVkLlwiLFxuICAgIH07XG4gIH1cblxuICBjb25zdCBzdGFydHNBdCA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgY29uc3QgZW5kc0F0ID0gbmV3IERhdGUoRGF0ZS5ub3coKSArIG9wdGlvbnMudmFsaWREYXlzICogMjQgKiA2MCAqIDYwICogMTAwMCkudG9JU09TdHJpbmcoKTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovLyR7c2hvcH0vYWRtaW4vYXBpLyR7QURNSU5fQVBJX1ZFUlNJT059L2dyYXBocWwuanNvbmAsIHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgXCJYLVNob3BpZnktQWNjZXNzLVRva2VuXCI6IHRva2VuLFxuICAgIH0sXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgcXVlcnk6IENSRUFURV9ESVNDT1VOVF9NVVRBVElPTixcbiAgICAgIHZhcmlhYmxlczoge1xuICAgICAgICBiYXNpY0NvZGVEaXNjb3VudDoge1xuICAgICAgICAgIHRpdGxlOiBvcHRpb25zLnRpdGxlLFxuICAgICAgICAgIGNvZGU6IG9wdGlvbnMuY29kZSxcbiAgICAgICAgICBzdGFydHNBdCxcbiAgICAgICAgICBlbmRzQXQsXG4gICAgICAgICAgY3VzdG9tZXJTZWxlY3Rpb246IHsgYWxsOiB0cnVlIH0sXG4gICAgICAgICAgY3VzdG9tZXJHZXRzOiB7XG4gICAgICAgICAgICB2YWx1ZTogeyBwZXJjZW50YWdlOiBvcHRpb25zLnBlcmNlbnRhZ2UgfSxcbiAgICAgICAgICAgIGl0ZW1zOiB7IGFsbDogdHJ1ZSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdXNhZ2VMaW1pdDogMSxcbiAgICAgICAgICBhcHBsaWVzT25jZVBlckN1c3RvbWVyOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6IFwiQ291bGQgbm90IHJlYWNoIFNob3BpZnkgdG8gY3JlYXRlIHlvdXIgZGlzY291bnQgY29kZS5cIiB9O1xuICB9XG5cbiAgY29uc3QgcGF5bG9hZCA9IChhd2FpdCByZXNwb25zZS5qc29uKCkpIGFzIHtcbiAgICBkYXRhPzoge1xuICAgICAgZGlzY291bnRDb2RlQmFzaWNDcmVhdGU/OiB7XG4gICAgICAgIGNvZGVEaXNjb3VudE5vZGU/OiB7IGlkOiBzdHJpbmcgfSB8IG51bGw7XG4gICAgICAgIHVzZXJFcnJvcnM/OiBBcnJheTx7IGZpZWxkPzogc3RyaW5nW107IG1lc3NhZ2U6IHN0cmluZyB9PjtcbiAgICAgIH07XG4gICAgfTtcbiAgICBlcnJvcnM/OiBBcnJheTx7IG1lc3NhZ2U6IHN0cmluZyB9PjtcbiAgfTtcblxuICBpZiAocGF5bG9hZC5lcnJvcnM/Lmxlbmd0aCkge1xuICAgIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6IHBheWxvYWQuZXJyb3JzLm1hcCgoZSkgPT4gZS5tZXNzYWdlKS5qb2luKFwiLCBcIikgfTtcbiAgfVxuXG4gIGNvbnN0IHJlc3VsdCA9IHBheWxvYWQuZGF0YT8uZGlzY291bnRDb2RlQmFzaWNDcmVhdGU7XG4gIGNvbnN0IHVzZXJFcnJvcnMgPSByZXN1bHQ/LnVzZXJFcnJvcnMgPz8gW107XG4gIGlmICh1c2VyRXJyb3JzLmxlbmd0aCkge1xuICAgIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6IHVzZXJFcnJvcnMubWFwKChlKSA9PiBlLm1lc3NhZ2UpLmpvaW4oXCIsIFwiKSB9O1xuICB9XG5cbiAgY29uc3Qgc2hvcGlmeUlkID0gcmVzdWx0Py5jb2RlRGlzY291bnROb2RlPy5pZDtcbiAgaWYgKCFzaG9waWZ5SWQpIHtcbiAgICByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiBcIlNob3BpZnkgZGlkIG5vdCBjcmVhdGUgdGhlIGRpc2NvdW50IGNvZGUuXCIgfTtcbiAgfVxuXG4gIHJldHVybiB7IG9rOiB0cnVlLCBzaG9waWZ5SWQgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVBvcHVwU2lnbnVwRGlzY291bnQoXG4gIGVudjogUmVjb3JkPHN0cmluZywgc3RyaW5nPixcbiAgY29kZSA9IGdlbmVyYXRlUG9wdXBDb2RlKCksXG4pOiBQcm9taXNlPENyZWF0ZURpc2NvdW50Q29kZVJlc3VsdCAmIHsgY29kZTogc3RyaW5nIH0+IHtcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY3JlYXRlU2hvcGlmeURpc2NvdW50Q29kZShcbiAgICB7XG4gICAgICBjb2RlLFxuICAgICAgdGl0bGU6IGBQb3B1cCBzaWdudXAgJHtjb2RlfWAsXG4gICAgICBwZXJjZW50YWdlOiAwLjE1LFxuICAgICAgdmFsaWREYXlzOiAxMCxcbiAgICB9LFxuICAgIGVudixcbiAgKTtcblxuICBpZiAoIXJlc3VsdC5vaykge1xuICAgIHJldHVybiB7IC4uLnJlc3VsdCwgY29kZSB9O1xuICB9XG5cbiAgcmV0dXJuIHsgLi4ucmVzdWx0LCBjb2RlIH07XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy90b21icm8vaGFwcHktc3RvcmUtYnJpZGdlLTEvc2VydmVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvdG9tYnJvL2hhcHB5LXN0b3JlLWJyaWRnZS0xL3NlcnZlci9kaXNjb3VudEFwaU1pZGRsZXdhcmUudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3RvbWJyby9oYXBweS1zdG9yZS1icmlkZ2UtMS9zZXJ2ZXIvZGlzY291bnRBcGlNaWRkbGV3YXJlLnRzXCI7aW1wb3J0IHR5cGUgeyBJbmNvbWluZ01lc3NhZ2UsIFNlcnZlclJlc3BvbnNlIH0gZnJvbSBcImh0dHBcIjtcbmltcG9ydCB7IGdlbmVyYXRlT3RwQ29kZSwgc2F2ZU90cCwgdmVyaWZ5T3RwIH0gZnJvbSBcIi4vZGlzY291bnRPdHBTdG9yZVwiO1xuaW1wb3J0IHsgY3JlYXRlUG9wdXBTaWdudXBEaXNjb3VudCB9IGZyb20gXCIuL3Nob3BpZnlEaXNjb3VudENvZGVzXCI7XG5cbmNvbnN0IERFRkFVTFRfU0VORF9DT0RFX1dFQkhPT0sgPVxuICBcImh0dHBzOi8vbGF5bmdvLmFwcC5uOG4uY2xvdWQvd2ViaG9vay9sYXluZ28tZGlzY291bnQtc2VuZC1jb2RlXCI7XG5jb25zdCBERUZBVUxUX1ZFUklGWV9DT0RFX1dFQkhPT0sgPVxuICBcImh0dHBzOi8vbGF5bmdvLmFwcC5uOG4uY2xvdWQvd2ViaG9vay9sYXluZ28tZGlzY291bnQtdmVyaWZ5XCI7XG5cbmZ1bmN0aW9uIHJlYWRCb2R5KHJlcTogSW5jb21pbmdNZXNzYWdlKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBjaHVua3M6IEJ1ZmZlcltdID0gW107XG4gICAgcmVxLm9uKFwiZGF0YVwiLCAoYykgPT4gY2h1bmtzLnB1c2goYykpO1xuICAgIHJlcS5vbihcImVuZFwiLCAoKSA9PiByZXNvbHZlKEJ1ZmZlci5jb25jYXQoY2h1bmtzKS50b1N0cmluZyhcInV0ZjhcIikpKTtcbiAgICByZXEub24oXCJlcnJvclwiLCByZWplY3QpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gc2VuZEpzb24ocmVzOiBTZXJ2ZXJSZXNwb25zZSwgc3RhdHVzOiBudW1iZXIsIGRhdGE6IHVua25vd24pIHtcbiAgcmVzLnN0YXR1c0NvZGUgPSBzdGF0dXM7XG4gIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZEVtYWlsKGVtYWlsOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIC9eW15cXHNAXStAW15cXHNAXStcXC5bXlxcc0BdKyQvLnRlc3QoZW1haWwpO1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkUGhvbmUocGhvbmU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gcGhvbmUucmVwbGFjZSgvXFxEL2csIFwiXCIpLmxlbmd0aCA+PSAxMDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcHJveHlUb044bih3ZWJob29rVXJsOiBzdHJpbmcsIHBheWxvYWQ6IHVua25vd24pIHtcbiAgY29uc3QgdXBzdHJlYW0gPSBhd2FpdCBmZXRjaCh3ZWJob29rVXJsLCB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkocGF5bG9hZCksXG4gIH0pO1xuXG4gIGNvbnN0IGRhdGEgPSAoYXdhaXQgdXBzdHJlYW0uanNvbigpLmNhdGNoKCgpID0+IG51bGwpKSBhcyB7XG4gICAgb2s/OiBib29sZWFuO1xuICAgIG1lc3NhZ2U/OiBzdHJpbmc7XG4gICAgZXJyb3I/OiBzdHJpbmc7XG4gICAgZGlzY291bnRDb2RlPzogc3RyaW5nO1xuICB9IHwgbnVsbDtcblxuICByZXR1cm4geyB1cHN0cmVhbSwgZGF0YSB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRGlzY291bnRBcGlNaWRkbGV3YXJlKGVudjogUmVjb3JkPHN0cmluZywgc3RyaW5nPikge1xuICBjb25zdCBzZW5kV2ViaG9vayA9IGVudi5ESVNDT1VOVF9TRU5EX0NPREVfV0VCSE9PS19VUkwgfHwgREVGQVVMVF9TRU5EX0NPREVfV0VCSE9PSztcbiAgY29uc3QgdmVyaWZ5V2ViaG9vayA9IGVudi5ESVNDT1VOVF9WRVJJRllfQ09ERV9XRUJIT09LX1VSTCB8fCBERUZBVUxUX1ZFUklGWV9DT0RFX1dFQkhPT0s7XG4gIGNvbnN0IHVzZU44bk90cCA9IGVudi5ESVNDT1VOVF9PVFBfVklBX044TiA9PT0gXCJ0cnVlXCI7XG5cbiAgcmV0dXJuIGFzeW5jIChyZXE6IEluY29taW5nTWVzc2FnZSwgcmVzOiBTZXJ2ZXJSZXNwb25zZSwgbmV4dDogKCkgPT4gdm9pZCkgPT4ge1xuICAgIGNvbnN0IHVybCA9IHJlcS51cmw/LnNwbGl0KFwiP1wiKVswXTtcblxuICAgIGlmIChyZXEubWV0aG9kICE9PSBcIlBPU1RcIikge1xuICAgICAgbmV4dCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh1cmwgPT09IFwiL2FwaS9kaXNjb3VudC9zZW5kLWNvZGVcIikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHJlYWRCb2R5KHJlcSk7XG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBib2R5ID8gSlNPTi5wYXJzZShib2R5KSA6IHt9O1xuICAgICAgICBjb25zdCBlbWFpbCA9IFN0cmluZyhwYXlsb2FkLmVtYWlsID8/IFwiXCIpLnRyaW0oKTtcbiAgICAgICAgY29uc3QgcGhvbmUgPSBTdHJpbmcocGF5bG9hZC5waG9uZSA/PyBcIlwiKS50cmltKCk7XG4gICAgICAgIGNvbnN0IG1hcmtldGluZ0NvbnNlbnQgPSBwYXlsb2FkLm1hcmtldGluZ0NvbnNlbnQgPT09IHRydWU7XG5cbiAgICAgICAgaWYgKCFpc1ZhbGlkRW1haWwoZW1haWwpKSB7XG4gICAgICAgICAgc2VuZEpzb24ocmVzLCA0MDAsIHsgb2s6IGZhbHNlLCBlcnJvcjogXCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbC5cIiB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1ZhbGlkUGhvbmUocGhvbmUpKSB7XG4gICAgICAgICAgc2VuZEpzb24ocmVzLCA0MDAsIHsgb2s6IGZhbHNlLCBlcnJvcjogXCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBwaG9uZSBudW1iZXIuXCIgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghbWFya2V0aW5nQ29uc2VudCkge1xuICAgICAgICAgIHNlbmRKc29uKHJlcywgNDAwLCB7XG4gICAgICAgICAgICBvazogZmFsc2UsXG4gICAgICAgICAgICBlcnJvcjogXCJQbGVhc2UgYWdyZWUgdG8gcmVjZWl2ZSB0ZXh0cyBhbmQgbWFya2V0aW5nIGVtYWlscy5cIixcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXNlTjhuT3RwKSB7XG4gICAgICAgICAgY29uc3QgeyB1cHN0cmVhbSwgZGF0YSB9ID0gYXdhaXQgcHJveHlUb044bihzZW5kV2ViaG9vaywge1xuICAgICAgICAgICAgZW1haWwsXG4gICAgICAgICAgICBwaG9uZSxcbiAgICAgICAgICAgIG1hcmtldGluZ0NvbnNlbnQsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKCF1cHN0cmVhbS5vaykge1xuICAgICAgICAgICAgc2VuZEpzb24ocmVzLCB1cHN0cmVhbS5zdGF0dXMsIHtcbiAgICAgICAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICAgICAgICBlcnJvcjogZGF0YT8uZXJyb3IgPz8gXCJDb3VsZCBub3Qgc2VuZCB2ZXJpZmljYXRpb24gY29kZS5cIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZW5kSnNvbihyZXMsIDIwMCwge1xuICAgICAgICAgICAgb2s6IHRydWUsXG4gICAgICAgICAgICBtZXNzYWdlOiBkYXRhPy5tZXNzYWdlID8/IFwiVmVyaWZpY2F0aW9uIGNvZGUgc2VudC5cIixcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb2RlID0gZ2VuZXJhdGVPdHBDb2RlKCk7XG4gICAgICAgIHNhdmVPdHAocGhvbmUsIGVtYWlsLCBtYXJrZXRpbmdDb25zZW50LCBjb2RlKTtcblxuICAgICAgICBpZiAoZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgICAgICAgIGNvbnNvbGUuaW5mbyhgW2Rpc2NvdW50LW90cF0gJHtwaG9uZX0gXHUyMTkyICR7Y29kZX1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHsgdXBzdHJlYW0sIGRhdGEgfSA9IGF3YWl0IHByb3h5VG9OOG4oc2VuZFdlYmhvb2ssIHtcbiAgICAgICAgICBlbWFpbCxcbiAgICAgICAgICBwaG9uZSxcbiAgICAgICAgICBtYXJrZXRpbmdDb25zZW50LFxuICAgICAgICAgIGNvZGUsXG4gICAgICAgICAgZGV2TW9kZTogdHJ1ZSxcbiAgICAgICAgfSkuY2F0Y2goKCkgPT4gKHsgdXBzdHJlYW06IHsgb2s6IHRydWUgfSBhcyBSZXNwb25zZSwgZGF0YTogbnVsbCB9KSk7XG5cbiAgICAgICAgaWYgKCF1cHN0cmVhbS5vaykge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcIltkaXNjb3VudC1hcGldIG44biBzZW5kLWNvZGUgd2ViaG9vayBmYWlsZWQ7IE9UUCBzdGlsbCBzdG9yZWQgbG9jYWxseVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbmRKc29uKHJlcywgMjAwLCB7XG4gICAgICAgICAgb2s6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogZGF0YT8ubWVzc2FnZSA/PyBcIkNoZWNrIHlvdXIgZW1haWwgZm9yIHRoZSBjb2RlLlwiLFxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiW2Rpc2NvdW50LWFwaV0gc2VuZC1jb2RlXCIsIGVycik7XG4gICAgICAgIHNlbmRKc29uKHJlcywgNTAwLCB7IG9rOiBmYWxzZSwgZXJyb3I6IFwiQ291bGQgbm90IHNlbmQgdmVyaWZpY2F0aW9uIGNvZGUuXCIgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHVybCA9PT0gXCIvYXBpL2Rpc2NvdW50L3ZlcmlmeS1jb2RlXCIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCByZWFkQm9keShyZXEpO1xuICAgICAgICBjb25zdCBwYXlsb2FkID0gYm9keSA/IEpTT04ucGFyc2UoYm9keSkgOiB7fTtcbiAgICAgICAgY29uc3QgZW1haWwgPSBTdHJpbmcocGF5bG9hZC5lbWFpbCA/PyBcIlwiKS50cmltKCk7XG4gICAgICAgIGNvbnN0IHBob25lID0gU3RyaW5nKHBheWxvYWQucGhvbmUgPz8gXCJcIikudHJpbSgpO1xuICAgICAgICBjb25zdCBjb2RlID0gU3RyaW5nKHBheWxvYWQuY29kZSA/PyBcIlwiKS50cmltKCk7XG5cbiAgICAgICAgaWYgKCFpc1ZhbGlkRW1haWwoZW1haWwpIHx8ICFpc1ZhbGlkUGhvbmUocGhvbmUpIHx8IGNvZGUubGVuZ3RoIDwgNCkge1xuICAgICAgICAgIHNlbmRKc29uKHJlcywgNDAwLCB7IG9rOiBmYWxzZSwgZXJyb3I6IFwiSW52YWxpZCB2ZXJpZmljYXRpb24gcmVxdWVzdC5cIiB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXVzZU44bk90cCkge1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHZlcmlmeU90cChwaG9uZSwgZW1haWwsIGNvZGUpO1xuICAgICAgICAgIGlmICghcmVzdWx0Lm9rKSB7XG4gICAgICAgICAgICBzZW5kSnNvbihyZXMsIDQwMCwgcmVzdWx0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBzaG9waWZ5UmVzdWx0ID0gYXdhaXQgY3JlYXRlUG9wdXBTaWdudXBEaXNjb3VudChlbnYpO1xuICAgICAgICAgIGlmICghc2hvcGlmeVJlc3VsdC5vaykge1xuICAgICAgICAgICAgc2VuZEpzb24ocmVzLCA1MDAsIHsgb2s6IGZhbHNlLCBlcnJvcjogc2hvcGlmeVJlc3VsdC5lcnJvciB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCB7IHVwc3RyZWFtLCBkYXRhIH0gPSBhd2FpdCBwcm94eVRvTjhuKHZlcmlmeVdlYmhvb2ssIHtcbiAgICAgICAgICAgIGVtYWlsOiByZXN1bHQucmVjb3JkLmVtYWlsLFxuICAgICAgICAgICAgcGhvbmU6IHJlc3VsdC5yZWNvcmQucGhvbmUsXG4gICAgICAgICAgICBtYXJrZXRpbmdDb25zZW50OiByZXN1bHQucmVjb3JkLm1hcmtldGluZ0NvbnNlbnQsXG4gICAgICAgICAgICB2ZXJpZmllZDogdHJ1ZSxcbiAgICAgICAgICAgIGRpc2NvdW50Q29kZTogc2hvcGlmeVJlc3VsdC5jb2RlLFxuICAgICAgICAgICAgc2hvcGlmeUNyZWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICBzaG9waWZ5RGlzY291bnRJZDogc2hvcGlmeVJlc3VsdC5zaG9waWZ5SWQsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiAoIXVwc3RyZWFtLm9rKSB7XG4gICAgICAgICAgICBzZW5kSnNvbihyZXMsIHVwc3RyZWFtLnN0YXR1cywge1xuICAgICAgICAgICAgICBvazogZmFsc2UsXG4gICAgICAgICAgICAgIGVycm9yOiBkYXRhPy5lcnJvciA/PyBcIkNvdWxkIG5vdCBjb21wbGV0ZSBzaWdudXAuXCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzZW5kSnNvbihyZXMsIDIwMCwge1xuICAgICAgICAgICAgb2s6IHRydWUsXG4gICAgICAgICAgICBtZXNzYWdlOiBkYXRhPy5tZXNzYWdlID8/IFwiWW91J3JlIHZlcmlmaWVkISBZb3VyIGNvZGUgbGFzdHMgMTAgZGF5cyBcdTIwMTQgdXNlIGl0IGF0IGNoZWNrb3V0LlwiLFxuICAgICAgICAgICAgZGlzY291bnRDb2RlOiBzaG9waWZ5UmVzdWx0LmNvZGUsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeyB1cHN0cmVhbSwgZGF0YSB9ID0gYXdhaXQgcHJveHlUb044bih2ZXJpZnlXZWJob29rLCB7XG4gICAgICAgICAgZW1haWwsXG4gICAgICAgICAgcGhvbmUsXG4gICAgICAgICAgY29kZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCF1cHN0cmVhbS5vaykge1xuICAgICAgICAgIHNlbmRKc29uKHJlcywgdXBzdHJlYW0uc3RhdHVzLCB7XG4gICAgICAgICAgICBvazogZmFsc2UsXG4gICAgICAgICAgICBlcnJvcjogZGF0YT8uZXJyb3IgPz8gXCJJbmNvcnJlY3Qgb3IgZXhwaXJlZCBjb2RlLlwiLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbmRKc29uKHJlcywgMjAwLCB7XG4gICAgICAgICAgb2s6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogZGF0YT8ubWVzc2FnZSA/PyBcIllvdSdyZSB2ZXJpZmllZCEgVXNlIHlvdXIgY29kZSBhdCBjaGVja291dC5cIixcbiAgICAgICAgICBkaXNjb3VudENvZGU6IGRhdGE/LmRpc2NvdW50Q29kZSxcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIltkaXNjb3VudC1hcGldIHZlcmlmeS1jb2RlXCIsIGVycik7XG4gICAgICAgIHNlbmRKc29uKHJlcywgNTAwLCB7IG9rOiBmYWxzZSwgZXJyb3I6IFwiQ291bGQgbm90IHZlcmlmeSBjb2RlLlwiIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG5leHQoKTtcbiAgfTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3RvbWJyby9oYXBweS1zdG9yZS1icmlkZ2UtMS9zZXJ2ZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy90b21icm8vaGFwcHktc3RvcmUtYnJpZGdlLTEvc2VydmVyL25ld3NsZXR0ZXJBcGlNaWRkbGV3YXJlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy90b21icm8vaGFwcHktc3RvcmUtYnJpZGdlLTEvc2VydmVyL25ld3NsZXR0ZXJBcGlNaWRkbGV3YXJlLnRzXCI7aW1wb3J0IHR5cGUgeyBJbmNvbWluZ01lc3NhZ2UsIFNlcnZlclJlc3BvbnNlIH0gZnJvbSBcImh0dHBcIjtcblxuY29uc3QgREVGQVVMVF9ORVdTTEVUVEVSX1dFQkhPT0tfVVJMID1cbiAgXCJodHRwczovL2xheW5nby5hcHAubjhuLmNsb3VkL3dlYmhvb2svbGF5bmdvLW5ld3NsZXR0ZXItc2lnbnVwXCI7XG5cbmZ1bmN0aW9uIHJlYWRCb2R5KHJlcTogSW5jb21pbmdNZXNzYWdlKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBjaHVua3M6IEJ1ZmZlcltdID0gW107XG4gICAgcmVxLm9uKFwiZGF0YVwiLCAoYykgPT4gY2h1bmtzLnB1c2goYykpO1xuICAgIHJlcS5vbihcImVuZFwiLCAoKSA9PiByZXNvbHZlKEJ1ZmZlci5jb25jYXQoY2h1bmtzKS50b1N0cmluZyhcInV0ZjhcIikpKTtcbiAgICByZXEub24oXCJlcnJvclwiLCByZWplY3QpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gc2VuZEpzb24ocmVzOiBTZXJ2ZXJSZXNwb25zZSwgc3RhdHVzOiBudW1iZXIsIGRhdGE6IHVua25vd24pIHtcbiAgcmVzLnN0YXR1c0NvZGUgPSBzdGF0dXM7XG4gIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZEVtYWlsKGVtYWlsOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIC9eW15cXHNAXStAW15cXHNAXStcXC5bXlxcc0BdKyQvLnRlc3QoZW1haWwpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTmV3c2xldHRlckFwaU1pZGRsZXdhcmUoZW52OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSB7XG4gIHJldHVybiBhc3luYyAocmVxOiBJbmNvbWluZ01lc3NhZ2UsIHJlczogU2VydmVyUmVzcG9uc2UsIG5leHQ6ICgpID0+IHZvaWQpID0+IHtcbiAgICBpZiAocmVxLnVybCAhPT0gXCIvYXBpL25ld3NsZXR0ZXJcIiB8fCByZXEubWV0aG9kICE9PSBcIlBPU1RcIikge1xuICAgICAgbmV4dCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcmVhZEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBib2R5ID8gSlNPTi5wYXJzZShib2R5KSA6IHt9O1xuICAgICAgY29uc3QgZW1haWwgPSBTdHJpbmcocGF5bG9hZC5lbWFpbCA/PyBcIlwiKS50cmltKCk7XG5cbiAgICAgIGlmICghaXNWYWxpZEVtYWlsKGVtYWlsKSkge1xuICAgICAgICBzZW5kSnNvbihyZXMsIDQwMCwgeyBvazogZmFsc2UsIGVycm9yOiBcIlBsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuXCIgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgd2ViaG9va1VybCA9IGVudi5ORVdTTEVUVEVSX1dFQkhPT0tfVVJMIHx8IERFRkFVTFRfTkVXU0xFVFRFUl9XRUJIT09LX1VSTDtcbiAgICAgIGNvbnN0IHVwc3RyZWFtID0gYXdhaXQgZmV0Y2god2ViaG9va1VybCwge1xuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgZW1haWwgfSksXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgZGF0YSA9IChhd2FpdCB1cHN0cmVhbS5qc29uKCkuY2F0Y2goKCkgPT4gbnVsbCkpIGFzIHtcbiAgICAgICAgb2s/OiBib29sZWFuO1xuICAgICAgICBtZXNzYWdlPzogc3RyaW5nO1xuICAgICAgICBlcnJvcj86IHN0cmluZztcbiAgICAgIH0gfCBudWxsO1xuXG4gICAgICBpZiAoIXVwc3RyZWFtLm9rKSB7XG4gICAgICAgIHNlbmRKc29uKHJlcywgdXBzdHJlYW0uc3RhdHVzLCB7XG4gICAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICAgIGVycm9yOiBkYXRhPy5lcnJvciA/PyBcIkNvdWxkIG5vdCBqb2luIHRoZSBuZXdzbGV0dGVyLiBQbGVhc2UgdHJ5IGFnYWluLlwiLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzZW5kSnNvbihyZXMsIDIwMCwge1xuICAgICAgICBvazogdHJ1ZSxcbiAgICAgICAgbWVzc2FnZTogZGF0YT8ubWVzc2FnZSA/PyBcIllvdSBhcmUgb24gdGhlIGxpc3QhIFdhdGNoIHlvdXIgaW5ib3ggZm9yIExheS1uLUdvIHVwZGF0ZXMuXCIsXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJbbmV3c2xldHRlci1hcGldXCIsIGVycik7XG4gICAgICBzZW5kSnNvbihyZXMsIDUwMCwge1xuICAgICAgICBvazogZmFsc2UsXG4gICAgICAgIGVycm9yOiBcIkNvdWxkIG5vdCBqb2luIHRoZSBuZXdzbGV0dGVyLiBQbGVhc2UgdHJ5IGFnYWluLlwiLFxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvdG9tYnJvL2hhcHB5LXN0b3JlLWJyaWRnZS0xL3NyYy9saWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy90b21icm8vaGFwcHktc3RvcmUtYnJpZGdlLTEvc3JjL2xpYi9jaGF0Ym90S25vd2xlZGdlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy90b21icm8vaGFwcHktc3RvcmUtYnJpZGdlLTEvc3JjL2xpYi9jaGF0Ym90S25vd2xlZGdlLnRzXCI7ZXhwb3J0IHR5cGUgQ2hhdExpbmsgPSB7IGxhYmVsOiBzdHJpbmc7IGhyZWY6IHN0cmluZyB9O1xuXG5leHBvcnQgdHlwZSBDaGF0UHJvZHVjdCA9IHtcbiAgdGl0bGU6IHN0cmluZztcbiAgc3VidGl0bGU/OiBzdHJpbmc7XG4gIGhyZWY6IHN0cmluZztcbiAgaW1hZ2U6IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIENoYXRBc3Npc3RhbnRSZXBseSA9IHtcbiAgY29udGVudDogc3RyaW5nO1xuICBsaW5rcz86IENoYXRMaW5rW107XG4gIHByb2R1Y3RzPzogQ2hhdFByb2R1Y3RbXTtcbn07XG5cbmV4cG9ydCB0eXBlIENoYXRSb2xlID0gXCJ1c2VyXCIgfCBcImFzc2lzdGFudFwiO1xuXG5leHBvcnQgdHlwZSBDaGF0TWVzc2FnZSA9IHtcbiAgcm9sZTogQ2hhdFJvbGU7XG4gIGNvbnRlbnQ6IHN0cmluZztcbiAgbGlua3M/OiBDaGF0TGlua1tdO1xuICBwcm9kdWN0cz86IENoYXRQcm9kdWN0W107XG59O1xuXG4vKiogQ2xpY2thYmxlIHByb2R1Y3QgY2FyZHMgc2hvd24gaW4gY2hhdCAobG9jYWwgaW1hZ2VzIGZvciBmYXN0IGxvYWQpLiAqL1xuZXhwb3J0IGNvbnN0IENIQVRfUFJPRFVDVFMgPSB7XG4gIGNvc21vMjA6IHtcbiAgICB0aXRsZTogJ0xheS1uLUdvIENvc21vIDIwXCInLFxuICAgIHN1YnRpdGxlOiBcIkJlc3Qgc2VsbGVyIFx1MDBCNyBDb3NtZXRpYyBiYWdcIixcbiAgICBocmVmOiBcIi9wcm9kdWN0L2xheS1uLWdvLWNvc21vLTIwXCIsXG4gICAgaW1hZ2U6IFwiL2Nvc21ldGljLWJhZ3MtdjIvY29zbW8tMjAucG5nXCIsXG4gIH0sXG4gIGNvc21vRGVsdXhlMjI6IHtcbiAgICB0aXRsZTogJ0xheS1uLUdvIENvc21vIERlbHV4ZSAyMlwiJyxcbiAgICBzdWJ0aXRsZTogXCJFeHRyYSByb29tIFx1MDBCNyBDb3NtZXRpYyBiYWdcIixcbiAgICBocmVmOiBcIi9wcm9kdWN0L2xheS1uLWdvLWNvc21vLWRlbHV4ZS0yMlwiLFxuICAgIGltYWdlOiBcIi9jb3NtZXRpYy1iYWdzLXYyL2Nvc21vLTIyLnBuZ1wiLFxuICB9LFxuICB0cmF2ZWxlcjIwOiB7XG4gICAgdGl0bGU6ICdMYXktbi1HbyBUcmF2ZWxlciAyMFwiJyxcbiAgICBzdWJ0aXRsZTogXCJUZWNoICYgdHJhdmVsIG9yZ2FuaXplclwiLFxuICAgIGhyZWY6IFwiL3Byb2R1Y3QvbGF5LW4tZ28tdHJhdmVsZXItMjBcIixcbiAgICBpbWFnZTogXCIvcHJvZHVjdHMvbGF5LW4tZ28tdHJhdmVsZXItMjAvdHJhdmVsZXItZ2FsbGVyeS0xLnBuZ1wiLFxuICB9LFxuICBuYWlsc3BhMTg6IHtcbiAgICB0aXRsZTogJ0xheS1uLUdvIE5haWxzcGEgMThcIicsXG4gICAgc3VidGl0bGU6IFwiU2Fsb24gJiBhdC1ob21lIG1hbmljdXJlc1wiLFxuICAgIGhyZWY6IFwiL3Byb2R1Y3QvbGF5LW4tZ28tbmFpbHNwYS0xOFwiLFxuICAgIGltYWdlOiBcIi9wcm9kdWN0cy9sYXktbi1nby1uYWlsc3BhLTE4L2hlcm9lcy9kb3QtY2FsbS5wbmdcIixcbiAgfSxcbiAgZG9nQmVkNDQ6IHtcbiAgICB0aXRsZTogJ0xheS1uLUdvIFRyYXZlbCBEb2cgQmVkIDQ0XCInLFxuICAgIHN1YnRpdGxlOiBcIlBvcnRhYmxlIHBldCBiZWRcIixcbiAgICBocmVmOiBcIi9wcm9kdWN0L2xheS1uLWdvLXRyYXZlbC1kb2ctYmVkLTQ0XCIsXG4gICAgaW1hZ2U6IFwiL3Byb2R1Y3RzL2xheS1uLWdvLXRyYXZlbC1kb2ctYmVkLTQ0L2dhbGxlcnktMS5wbmdcIixcbiAgfSxcbn0gYXMgY29uc3Qgc2F0aXNmaWVzIFJlY29yZDxzdHJpbmcsIENoYXRQcm9kdWN0PjtcblxuY29uc3QgQ0hBVF9CRVNUX1NFTExFUlM6IENoYXRQcm9kdWN0W10gPSBbXG4gIENIQVRfUFJPRFVDVFMuY29zbW8yMCxcbiAgQ0hBVF9QUk9EVUNUUy5jb3Ntb0RlbHV4ZTIyLFxuICBDSEFUX1BST0RVQ1RTLnRyYXZlbGVyMjAsXG5dO1xuXG5leHBvcnQgY29uc3QgQ0hBVF9TQU1QTEVfUVVFU1RJT05TID0gW1xuICBcIldoYXQgYXJlIG91ciBiZXN0IHNlbGxlcnM/XCIsXG4gIFwiV2hhdCdzIHlvdXIgcmV0dXJuIHBvbGljeT9cIixcbiAgXCJXaGVyZSBkbyB5b3Ugc2hpcD9cIixcbl0gYXMgY29uc3Q7XG5cbmV4cG9ydCBjb25zdCBDSEFUX0tOT1dMRURHRV9URVhUID0gYFxuTGF5LW4tR28gKGxheW5nby5jb20pIFx1MjAxNCBwYXRlbnRlZCBkcmF3c3RyaW5nIG9yZ2FuaXphdGlvbmFsIHNvbHV0aW9ucy4gUHJvZHVjdHMgb3BlbiBmbGF0IGZvciBmdWxsIHZpc2liaWxpdHksIHRoZW4gY2luY2ggY2xvc2VkIGZvciBzdG9yYWdlIGFuZCB0cmF2ZWwuIEZvdW5kZWQgYnkgQW15IGFuZCBBZGFtIEZhemFja2VybGV5OyAxNisgeWVhcnMgaW4gYnVzaW5lc3MuXG5cbkJSQU5EIFBJVENIOiBcIk9yZ2FuaXphdGlvbmFsIFNvbHV0aW9ucyBmb3IgTGlmZSwgUGxheSwgYW5kIFRyYXZlbC5cIiBIb21lcGFnZSB0YWdsaW5lIGZvciBDb3NtbzogXCJUaGUgbGFzdCBiYWcgeW91J2xsIGV2ZXIgbmVlZC5cIlxuXG5DQVRFR09SSUVTICYgQ09MTEVDVElPTlM6XG4tIENvc21ldGljIEJhZ3MgLyBDT1NNTzogL3Nob3AvY29zbWV0aWMtYmFncy12MiBcdTIwMTQgbWFrZXVwICYgYmVhdXR5IGJhZ3MgKENvc21vIDE2XCIsIDIwXCIsIERlbHV4ZSAyMlwiKVxuLSBOYWlsIFNvbHV0aW9ucyAvIE5BSUxTUEE6IC9wcm9kdWN0L2xheS1uLWdvLW5haWxzcGEtMThcbi0gUGxheSAodG95IGNsZWFudXAsIHBsYXkgbWF0cyk6IC9jb2xsZWN0aW9ucy9wbGF5XG4tIFRlY2ggJiBUcmF2ZWwgLyBUUkFWRUxFUjogL3Byb2R1Y3QvbGF5LW4tZ28tdHJhdmVsZXItMjBcbi0gUGV0IFNvbHV0aW9uczogL3Byb2R1Y3QvbGF5LW4tZ28tdHJhdmVsLWRvZy1iZWQtNDRcbi0gT3V0ZG9vciAvIFRhY3RpY2FsIC8gTWlsaXRhcnkgJiBGaXJzdCBSZXNwb25kZXI6IC9jb2xsZWN0aW9ucy9taWxpdGFyeS1maXJzdC1yZXNwb25kZXJcbi0gQWxsIGNvbGxlY3Rpb25zOiAvY29sbGVjdGlvbnNcblxuVE9QIFBST0RVQ1RTOlxuLSBMYXktbi1HbyBDb3NtbyAyMFwiICgvcHJvZHVjdC9sYXktbi1nby1jb3Ntby0yMCkgXHUyMDE0IGZsYWdzaGlwIGNvc21ldGljIGJhZywgYmVzdCBzZWxsZXJcbi0gTGF5LW4tR28gQ29zbW8gRGVsdXhlIDIyXCIgKC9wcm9kdWN0L2xheS1uLWdvLWNvc21vLWRlbHV4ZS0yMilcbi0gTGF5LW4tR28gVHJhdmVsZXIgMjBcIiAoL3Byb2R1Y3QvbGF5LW4tZ28tdHJhdmVsZXItMjApIFx1MjAxNCB0ZWNoICYgdHJhdmVsXG4tIExheS1uLUdvIE5haWxzcGEgMThcIiAoL3Byb2R1Y3QvbGF5LW4tZ28tbmFpbHNwYS0xOClcbi0gTGF5LW4tR28gVHJhdmVsIERvZyBCZWQgNDRcIiAoL3Byb2R1Y3QvbGF5LW4tZ28tdHJhdmVsLWRvZy1iZWQtNDQpXG5cbkhPVyBJVCBXT1JLUzogUGF0ZW50ZWQgZHJhd3N0cmluZyBtYXQgZGVzaWduIFx1MjAxNCBsYXkgZmxhdCB0byBzZWUgYW5kIHVzZSBldmVyeXRoaW5nLCBwdWxsIGRyYXdzdHJpbmdzIHRvIGNpbmNoIGludG8gYSBiYWcuIFV0aWxpdHkgcGF0ZW50cyBpbmNsdWRlIFUuUy4gOSwwODQsNDU5OyAxMCwwMTYsMDM2OyAxMCw1NjEsMjEzOyAxMSwxMTYsMjk4LiBQYXRlbnRzIHBhZ2U6IC9wYWdlcy9sYXktbi1nby1wYXRlbnRzXG5cbkFCT1VUIC8gT1VSIFNUT1JZOiAvcGFnZXMvYWJvdXQtdXMuIEZvdW5kZXJzIEFteSAmIEFkYW0uIFN0YXJ0ZWQgZnJvbSBzb2x2aW5nIGV2ZXJ5ZGF5IG9yZ2FuaXphdGlvbiBwcm9ibGVtcyAodG95IGNsZWFudXAsIGNvc21ldGljcywgdHJhdmVsKS4gMTYrIHllYXJzIGluIGJ1c2luZXNzLCAxMDBrKyBjdXN0b21lcnMsIDIwMCsgd2hvbGVzYWxlIHBhcnRuZXJzLlxuXG5QUkVTUzogRmVhdHVyZWQgaW4gQnV6ekZlZWQsIFBhcmVudHMsIFBlb3BsZSwgVG9kYXkgU2hvdywgTGlmZWhhY2tlciwgQ29uZFx1MDBFOSBOYXN0IFRyYXZlbGVyLCBPcHJhaCBEYWlseSwgR01BLCBhbmQgbW9yZS4gUHJlc3MgcGFnZTogL3BhZ2VzL3ByZXNzXG5cblNISVBQSU5HICgvcG9saWNpZXMvc2hpcHBpbmctcG9saWN5KTpcbi0gU2hpcHMgdG8gVS5TLiBhbmQgcmVnaW9ucyBhdmFpbGFibGUgYXQgY2hlY2tvdXRcbi0gRWNvbm9teSA1XHUyMDEzOCBidXNpbmVzcyBkYXlzOyBTdGFuZGFyZCAzXHUyMDEzNDsgRXhwcmVzcyAxXHUyMDEzMiAoYWZ0ZXIgb3JkZXIgc2hpcHMpXG4tIFNhbWUtZGF5IHByb2Nlc3NpbmcgZm9yIG9yZGVycyBiZWZvcmUgMTowMCBwLm0uIGN1dG9mZiB3aGVuIGludmVudG9yeSBhbGxvd3Ncbi0gVHJhY2tpbmcgZW1haWxlZCB3aGVuIGNhcnJpZXIgbnVtYmVyIGF2YWlsYWJsZTsgcmF0ZXMgYXQgY2hlY2tvdXRcblxuUkVUVVJOUyAoL3BhZ2VzL3JldHVybi1wb2xpY3kpOlxuLSAxNCBkYXlzIGZyb20gZGVsaXZlcnk7IHVudXNlZCB3aXRoIG9yaWdpbmFsIHBhY2thZ2luZ1xuLSBFbWFpbCBpbmZvQGxheW5nby5jb20gd2l0aCBsYXluZ28uY29tIG9yZGVyIG51bWJlciBmb3IgUmV0dXJuIEF1dGhvcml6YXRpb24gKFJBKVxuLSBDdXN0b21lciBwYXlzIHJldHVybiBzaGlwcGluZzsgb3JpZ2luYWwgc2hpcHBpbmcgbm90IHJlZnVuZGVkXG5cbkNPTlRBQ1Q6IGluZm9AbGF5bmdvLmNvbSB8IEZheCA3MDMuOTk1LjQ5MTYgfCAvcGFnZXMvY29udGFjdFxuV0hPTEVTQUxFOiBJbnF1aXJpZXMgdmlhIGNvbnRhY3QgZm9ybSBhdCAvcGFnZXMvY29udGFjdCN3aG9sZXNhbGUgXHUyMDE0IDE2KyB5ZWFycywgMjAwKyB3aG9sZXNhbGUgcGFydG5lcnNcblxuU01TICgvcG9saWNpZXMvc21zLXBvbGljeSk6IFRyYW5zYWN0aW9uYWwsIG1hcmtldGluZywgYW5kIHNlcnZpY2UgdGV4dHMuIE9wdCBvdXQgYW55dGltZSBieSByZXBseWluZyBTVE9QLiBSZXBseSBTVEFSVCB0byBvcHQgYmFjayBpbi4gSEVMUCBmb3Igc3VwcG9ydC4gTWVzc2FnZS9kYXRhIHJhdGVzIG1heSBhcHBseS5cblxuVEVSTVMgJiBQUklWQUNZOiAvcG9saWNpZXMvdGVybXMtb2Ytc2VydmljZSAoY29tYmluZWQgdGVybXMgYW5kIHByaXZhY3kpXG5cbkFDQ09VTlQgLyBPUkRFUlM6IExvZ2luIGF0IGh0dHBzOi8vd3d3LmxheW5nby5jb20vYWNjb3VudC9sb2dpbiBmb3Igb3JkZXIgaGlzdG9yeVxuXG5ESVNDT1VOVDogRmlyc3QtdmlzaXQgcG9wdXAgb24gaG9tZXBhZ2UgbWF5IG9mZmVyIHNpZ251cCBkaXNjb3VudCB3aXRoIGVtYWlsL3Bob25lIHZlcmlmaWNhdGlvbi5cblxuU0VBUkNIOiAvc2VhcmNoIHRvIGZpbmQgcHJvZHVjdHMgb24gc2l0ZS5cbmAudHJpbSgpO1xuXG5jb25zdCBUT1BJQ19NQVRDSEVSUzogeyB0ZXN0OiBSZWdFeHA7IHJlcGx5OiBDaGF0QXNzaXN0YW50UmVwbHkgfVtdID0gW1xuICB7XG4gICAgdGVzdDpcbiAgICAgIC9eKGhpfGhleXxoZWxsb3xob3dkeXxncmVldGluZ3N8Z29vZFxccysobW9ybmluZ3xhZnRlcm5vb258ZXZlbmluZyl8c3VwfHlvfGhpeWF8aGV5YSlcXGJbXFxzIS4sP10qJHxeKGhpfGhleXxoZWxsb3xob3dkeSlcXGJbXFxzLF0rKHRoZXJlfGV2ZXJ5b25lfGZvbGtzfHRlYW18bGF5LW4tZ28pL2ksXG4gICAgcmVwbHk6IHtcbiAgICAgIGNvbnRlbnQ6XG4gICAgICAgIFwiSGkgdGhlcmUhIFdlbGNvbWUgdG8gTGF5LW4tR28uIEkgY2FuIGhlbHAgd2l0aCBvdXIgcHJvZHVjdHMgKENvc21vIGNvc21ldGljIGJhZ3MsIFBsYXkgbWF0cywgVHJhdmVsZXIsIGFuZCBtb3JlKSwgc2hpcHBpbmcsIHJldHVybnMsIG9yIG91ciBzdG9yeS4gV2hhdCBjYW4gSSBoZWxwIHlvdSB3aXRoIHRvZGF5P1wiLFxuICAgICAgbGlua3M6IFt7IGxhYmVsOiBcIlNob3AgY29sbGVjdGlvbnNcIiwgaHJlZjogXCIvY29sbGVjdGlvbnNcIiB9XSxcbiAgICB9LFxuICB9LFxuICB7XG4gICAgdGVzdDogL14odGhhbmtzfHRoYW5rXFxzK3lvdXx0aHh8dHl8YXBwcmVjaWF0ZVxccytpdHxtdWNoXFxzK2FwcHJlY2lhdGVkKVxcYi9pLFxuICAgIHJlcGx5OiB7XG4gICAgICBjb250ZW50OiBcIllvdSdyZSB3ZWxjb21lISBJZiB5b3UgaGF2ZSBhbnkgb3RoZXIgcXVlc3Rpb25zIGFib3V0IExheS1uLUdvLCBqdXN0IGFzay5cIixcbiAgICB9LFxuICB9LFxuICB7XG4gICAgdGVzdDogL14oYnllfGdvb2RieWV8c2VlXFxzK3lhfHNlZVxccyt5b3V8bGF0ZXJ8dGFrZVxccytjYXJlfGdvb2RcXHMrbmlnaHQpXFxiL2ksXG4gICAgcmVwbHk6IHtcbiAgICAgIGNvbnRlbnQ6XG4gICAgICAgIFwiR29vZGJ5ZSEgRmVlbCBmcmVlIHRvIGNvbWUgYmFjayBhbnl0aW1lIFx1MjAxNCBvciBlbWFpbCBpbmZvQGxheW5nby5jb20gaWYgeW91IG5lZWQgYSBoYW5kIGZyb20gb3VyIHRlYW0uXCIsXG4gICAgICBsaW5rczogW3sgbGFiZWw6IFwiQ29udGFjdCB1c1wiLCBocmVmOiBcIi9wYWdlcy9jb250YWN0XCIgfV0sXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIHRlc3Q6IC93aGF0XFxzK2Nhblxccyt5b3VcXHMrKGRvfGhlbHApfGhvd1xccytjYW5cXHMreW91XFxzK2hlbHB8d2hvXFxzK2FyZVxccyt5b3V8d2hhdFxccythcmVcXHMreW91fGhlbHBcXHMrbWUvaSxcbiAgICByZXBseToge1xuICAgICAgY29udGVudDpcbiAgICAgICAgXCJJJ20gdGhlIExheS1uLUdvIGFzc2lzdGFudC4gQXNrIG1lIGFib3V0IGJlc3Qgc2VsbGVycywgcHJvZHVjdCBjYXRlZ29yaWVzLCBzaGlwcGluZywgcmV0dXJucywgd2hvbGVzYWxlLCBvciBob3cgb3VyIHBhdGVudGVkIG9wZW4tZmxhdCwgY2luY2gtY2xvc2VkIGJhZ3Mgd29yayBcdTIwMTQgSSdsbCBwb2ludCB5b3UgdG8gdGhlIHJpZ2h0IHBhZ2Ugb3IgcG9saWN5LlwiLFxuICAgICAgbGlua3M6IFtcbiAgICAgICAgeyBsYWJlbDogXCJCZXN0IHNlbGxlciBcdTIwMTQgQ29zbW8gMjBcXFwiXCIsIGhyZWY6IFwiL3Byb2R1Y3QvbGF5LW4tZ28tY29zbW8tMjBcIiB9LFxuICAgICAgICB7IGxhYmVsOiBcIkNvbnRhY3Qgc3VwcG9ydFwiLCBocmVmOiBcIi9wYWdlcy9jb250YWN0XCIgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIHRlc3Q6IC9ob3dcXHMrYXJlXFxzK3lvdXxob3dcXHMraXNcXHMraXRcXHMrZ29pbmd8d2hhdCc/c1xccyt1cHx3aGF0c1xccyt1cC9pLFxuICAgIHJlcGx5OiB7XG4gICAgICBjb250ZW50OlxuICAgICAgICBcIkRvaW5nIGdyZWF0LCB0aGFua3MgZm9yIGFza2luZyEgSSdtIGhlcmUgdG8gaGVscCB3aXRoIExheS1uLUdvIHByb2R1Y3RzIGFuZCBvcmRlcnMuIFdoYXQgd291bGQgeW91IGxpa2UgdG8ga25vdz9cIixcbiAgICB9LFxuICB9LFxuICB7XG4gICAgdGVzdDogL14ob2t8b2theXxjb29sfGdyZWF0fHBlcmZlY3R8YXdlc29tZXxnb3RcXHMraXR8dW5kZXJzdG9vZHxuaWNlKVxcYltcXHMhLiw/XSokL2ksXG4gICAgcmVwbHk6IHtcbiAgICAgIGNvbnRlbnQ6IFwiR2xhZCB0aGF0IGhlbHBzISBMZXQgbWUga25vdyBpZiB5b3Ugd2FudCB0byBleHBsb3JlIHByb2R1Y3RzLCBzaGlwcGluZywgb3IgYW55dGhpbmcgZWxzZS5cIixcbiAgICB9LFxuICB9LFxuICB7XG4gICAgdGVzdDogL2Jlc3RcXHMqc2VsbGVyfHRvcFxccypzZWxsfHBvcHVsYXJ8YmVzdHNlbGxlcnxtb3N0XFxzKnBvcHVsYXJ8d2hhdFxccypzaG91bGRcXHMqaVxccypidXkvaSxcbiAgICByZXBseToge1xuICAgICAgY29udGVudDpcbiAgICAgICAgJ091ciAjMSBiZXN0IHNlbGxlciBpcyB0aGUgTGF5LW4tR28gQ29zbW8gMjBcIiBcdTIwMTQgdGhlIHBhdGVudGVkIGNvc21ldGljIGJhZyB0aGF0IG9wZW5zIGZsYXQgc28geW91IGNhbiBzZWUgZXZlcnl0aGluZywgdGhlbiBjaW5jaGVzIGNsb3NlZCBmb3IgdHJhdmVsLiBUaGUgQ29zbW8gRGVsdXhlIDIyXCIgYW5kIFRyYXZlbGVyIDIwXCIgYXJlIGFsc28gY3VzdG9tZXIgZmF2b3JpdGVzLicsXG4gICAgICBwcm9kdWN0czogQ0hBVF9CRVNUX1NFTExFUlMsXG4gICAgICBsaW5rczogW3sgbGFiZWw6IFwiQnJvd3NlIGFsbCBjb2xsZWN0aW9uc1wiLCBocmVmOiBcIi9jb2xsZWN0aW9uc1wiIH1dLFxuICAgIH0sXG4gIH0sXG4gIHtcbiAgICB0ZXN0OiAvY29zbW98bWFrZXVwXFxzKmJhZ3xjb3NtZXRpY1xccypiYWd8YmVhdXR5XFxzKmJhZ3xtYWtlXFxzKnVwL2ksXG4gICAgcmVwbHk6IHtcbiAgICAgIGNvbnRlbnQ6XG4gICAgICAgICdDb3NtbyBpcyBvdXIgc2lnbmF0dXJlIGNvc21ldGljIGxpbmUuIFRoZSBDb3NtbyAyMFwiIGlzIG91ciBiZXN0IHNlbGxlciBcdTIwMTQgb3BlbnMgZmxhdCBsaWtlIGEgbWF0LCBjaW5jaGVzIGludG8gYSBiYWcuIFRoZSBDb3NtbyBEZWx1eGUgMjJcIiBvZmZlcnMgZXh0cmEgcm9vbS4gQm90aCBjb21lIGluIG11bHRpcGxlIGNvbG9ycyBhbmQgcGF0dGVybnMuJyxcbiAgICAgIHByb2R1Y3RzOiBbQ0hBVF9QUk9EVUNUUy5jb3NtbzIwLCBDSEFUX1BST0RVQ1RTLmNvc21vRGVsdXhlMjJdLFxuICAgICAgbGlua3M6IFt7IGxhYmVsOiBcIkNvc21ldGljIGJhZ3NcIiwgaHJlZjogXCIvc2hvcC9jb3NtZXRpYy1iYWdzLXYyXCIgfV0sXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIHRlc3Q6IC90cmF2ZWxlcnx0ZWNoXFxzKihcXCt8YW5kKVxccyp0cmF2ZWx8dGVjaFxccyp0cmF2ZWx8bGFwdG9wfGNoYXJnZXJ8Y2FibGV8ZWxlY3Ryb25pYy9pLFxuICAgIHJlcGx5OiB7XG4gICAgICBjb250ZW50OlxuICAgICAgICAnVGhlIExheS1uLUdvIFRyYXZlbGVyIDIwXCIgaXMgYnVpbHQgZm9yIHRlY2ggYW5kIHRyYXZlbCBcdTIwMTQgb3BlbnMgZmxhdCBzbyB5b3UgY2FuIHNlZSBjYWJsZXMsIGNoYXJnZXJzLCBhbmQgZ2FkZ2V0cywgdGhlbiBjaW5jaGVzIGNsb3NlZC4gR3JlYXQgZm9yIHdvcmsgdHJpcHMgYW5kIGV2ZXJ5ZGF5IGNhcnJ5LicsXG4gICAgICBwcm9kdWN0czogW0NIQVRfUFJPRFVDVFMudHJhdmVsZXIyMF0sXG4gICAgICBsaW5rczogW3sgbGFiZWw6IFwiVGVjaCAmIHRyYXZlbCBjb2xsZWN0aW9uXCIsIGhyZWY6IFwiL2NvbGxlY3Rpb25zL3RlY2hub2xvZ3lcIiB9XSxcbiAgICB9LFxuICB9LFxuICB7XG4gICAgdGVzdDogL3BsYXl8dG95fGxlZ298Y2xlYW51cHxjbGVhblxccyp1cHxraWRzL2ksXG4gICAgcmVwbHk6IHtcbiAgICAgIGNvbnRlbnQ6XG4gICAgICAgICdPdXIgUGxheSBjb2xsZWN0aW9uIHVzZXMgdGhlIHNhbWUgcGF0ZW50ZWQgb3Blbi1mbGF0LCBjaW5jaC1jbG9zZWQgZGVzaWduIGZvciB0b3kgY2xlYW51cCBcdTIwMTQgc3ByZWFkIHRveXMgb3V0IG9uIHRoZSBtYXQsIHRoZW4gcHVsbCB0aGUgZHJhd3N0cmluZyB0byBnYXRoZXIgZXZlcnl0aGluZyBpbiBzZWNvbmRzLiBQZXJmZWN0IGZvciBMRUdPIGFuZCBwbGF5cm9vbSBvcmdhbml6YXRpb24uJyxcbiAgICAgIGxpbmtzOiBbeyBsYWJlbDogXCJTaG9wIFBsYXlcIiwgaHJlZjogXCIvY29sbGVjdGlvbnMvcGxheVwiIH1dLFxuICAgIH0sXG4gIH0sXG4gIHtcbiAgICB0ZXN0OiAvcGV0fGRvZ3xjYXR8dHJhdmVsXFxzKmJlZHxhbmltYWwvaSxcbiAgICByZXBseToge1xuICAgICAgY29udGVudDpcbiAgICAgICAgJ1BldCBTb2x1dGlvbnMgaW5jbHVkZSB0aGUgTGF5LW4tR28gVHJhdmVsIERvZyBCZWQgKDQ0XCIpIFx1MjAxNCBhIHBvcnRhYmxlIGJlZCB0aGF0IHBhY2tzIGRvd24gZm9yIHRyYXZlbC4gQnJvd3NlIG91ciBwZXQgY29sbGVjdGlvbiBmb3IgZ2VhciBkZXNpZ25lZCB0byBnbyB3aGVyZXZlciB5b3VyIHBldCBnb2VzLicsXG4gICAgICBwcm9kdWN0czogW0NIQVRfUFJPRFVDVFMuZG9nQmVkNDRdLFxuICAgICAgbGlua3M6IFt7IGxhYmVsOiBcIlBldCBjb2xsZWN0aW9uXCIsIGhyZWY6IFwiL2NvbGxlY3Rpb25zL3BldC1zb2x1dGlvbnNcIiB9XSxcbiAgICB9LFxuICB9LFxuICB7XG4gICAgdGVzdDogL25haWx8bmFpbHNwYXxtYW5pY3VyZXxzYWxvbi9pLFxuICAgIHJlcGx5OiB7XG4gICAgICBjb250ZW50OlxuICAgICAgICAnVGhlIExheS1uLUdvIE5haWxzcGEgMThcIiBpcyBkZXNpZ25lZCBmb3IgbmFpbCB0ZWNocyBhbmQgYXQtaG9tZSBtYW5pY3VyZXMgXHUyMDE0IG9wZW5zIGZsYXQgZm9yIHRvb2xzIGFuZCBwb2xpc2gsIGNpbmNoZXMgY2xvc2VkIGZvciBzdG9yYWdlIGFuZCB0cmF2ZWwgYmV0d2VlbiBjbGllbnRzIG9yIGFwcG9pbnRtZW50cy4nLFxuICAgICAgcHJvZHVjdHM6IFtDSEFUX1BST0RVQ1RTLm5haWxzcGExOF0sXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIHRlc3Q6IC90YWN0aWNhbHxtaWxpdGFyeXxmaXJzdFxccypyZXNwb25kZXJ8b3V0ZG9vcnxkZWZlbmRlcnxkdXR5L2ksXG4gICAgcmVwbHk6IHtcbiAgICAgIGNvbnRlbnQ6XG4gICAgICAgICdPdXIgT3V0ZG9vciAvIFRhY3RpY2FsIGxpbmUgaW5jbHVkZXMgbWlsaXRhcnkgYW5kIGZpcnN0LXJlc3BvbmRlciBnZWFyIFx1MjAxNCBvcmdhbml6ZWQgc3RvcmFnZSB0aGF0IG9wZW5zIGZsYXQgaW4gdGhlIGZpZWxkIGFuZCBjaW5jaGVzIGZvciB0cmFuc3BvcnQuIFNlZSB0aGUgZnVsbCBjb2xsZWN0aW9uIGZvciBEZWZlbmRlciBhbmQgdGFjdGljYWwgb3B0aW9ucy4nLFxuICAgICAgbGlua3M6IFt7IGxhYmVsOiBcIk91dGRvb3IgLyBUYWN0aWNhbFwiLCBocmVmOiBcIi9jb2xsZWN0aW9ucy9taWxpdGFyeS1maXJzdC1yZXNwb25kZXJcIiB9XSxcbiAgICB9LFxuICB9LFxuICB7XG4gICAgdGVzdDogL2hvd1xccyooZG9lc3xkbylcXHMqKGl0fHRoZXkpXFxzKndvcmt8ZHJhd3N0cmluZ3xvcGVuXFxzKmZsYXR8cGF0ZW50fGludmVudGlvbnx3aGF0XFxzKmlzXFxzKmxheS4/bi4/Z28vaSxcbiAgICByZXBseToge1xuICAgICAgY29udGVudDpcbiAgICAgICAgJ0xheS1uLUdvIGlzIGEgcGF0ZW50ZWQgZHJhd3N0cmluZyBtYXQgdGhhdCBvcGVucyBmbGF0IHNvIHlvdSBjYW4gc2VlIGFuZCB1c2UgZXZlcnl0aGluZywgdGhlbiBjaW5jaGVzIGNsb3NlZCBpbnRvIGEgYmFnIGZvciBzdG9yYWdlIG9yIHRyYXZlbC4gSXQgc3RhcnRlZCB3aXRoIHRveSBjbGVhbnVwIGFuZCBub3cgY292ZXJzIGNvc21ldGljcywgdGVjaCwgdHJhdmVsLCBwZXRzLCBuYWlscywgYW5kIHRhY3RpY2FsIGdlYXIuJyxcbiAgICAgIGxpbmtzOiBbXG4gICAgICAgIHsgbGFiZWw6IFwiT3VyIHN0b3J5XCIsIGhyZWY6IFwiL3BhZ2VzL2Fib3V0LXVzXCIgfSxcbiAgICAgICAgeyBsYWJlbDogXCJQYXRlbnRzXCIsIGhyZWY6IFwiL3BhZ2VzL2xheS1uLWdvLXBhdGVudHNcIiB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9LFxuICB7XG4gICAgdGVzdDogL2Fib3V0fHN0b3J5fGZvdW5kZXJ8YW15fGFkYW18aGlzdG9yeXx5ZWFyc1xccyppblxccypidXNpbmVzc3x3aG9cXHMqKGFyZXxpcylcXHMqbGF5L2ksXG4gICAgcmVwbHk6IHtcbiAgICAgIGNvbnRlbnQ6XG4gICAgICAgICdMYXktbi1HbyB3YXMgZm91bmRlZCBieSBBbXkgYW5kIEFkYW0gRmF6YWNrZXJsZXkgXHUyMDE0IDE2KyB5ZWFycyBpbiBidXNpbmVzcywgMTAwaysgY3VzdG9tZXJzIHNlcnZlZC4gSXQgc3RhcnRlZCB3aXRoIGEgc2ltcGxlIGlkZWE6IFwiVGhlcmUgaGFzIHRvIGJlIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzLlwiIFJlYWQgdGhlIGZ1bGwgZm91bmRlciBzdG9yeSBvbiBvdXIgQWJvdXQgcGFnZS4nLFxuICAgICAgbGlua3M6IFtcbiAgICAgICAgeyBsYWJlbDogXCJPdXIgc3RvcnlcIiwgaHJlZjogXCIvcGFnZXMvYWJvdXQtdXNcIiB9LFxuICAgICAgICB7IGxhYmVsOiBcIkNvbnRhY3RcIiwgaHJlZjogXCIvcGFnZXMvY29udGFjdFwiIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH0sXG4gIHtcbiAgICB0ZXN0OiAvcHJlc3N8ZmVhdHVyZWR8bWFnYXppbmV8bWVkaWF8YnV6emZlZWR8dG9kYXlcXHMqc2hvd3x0cmF2ZWxlclxccyptYWcvaSxcbiAgICByZXBseToge1xuICAgICAgY29udGVudDpcbiAgICAgICAgJ0xheS1uLUdvIGhhcyBiZWVuIGZlYXR1cmVkIGluIEJ1enpGZWVkLCBQYXJlbnRzLCBQZW9wbGUsIHRoZSBUb2RheSBTaG93LCBMaWZlaGFja2VyLCBDb25kXHUwMEU5IE5hc3QgVHJhdmVsZXIsIE9wcmFoIERhaWx5LCBHb29kIE1vcm5pbmcgQW1lcmljYSwgYW5kIG1hbnkgbW9yZS4gQnJvd3NlIHByZXNzIGhpZ2hsaWdodHMgYW5kIGFydGljbGVzIG9uIG91ciBQcmVzcyBwYWdlLicsXG4gICAgICBsaW5rczogW3sgbGFiZWw6IFwiUHJlc3MgJiBtZWRpYVwiLCBocmVmOiBcIi9wYWdlcy9wcmVzc1wiIH1dLFxuICAgIH0sXG4gIH0sXG4gIHtcbiAgICB0ZXN0OiAvd2hvbGVzYWxlfHJldGFpbFxccypwYXJ0bmVyfGNhcnJ5XFxzKmxheXxkaXN0cmlidXRvcnxidWxrfHN0b3JlXFxzKm9yZGVyL2ksXG4gICAgcmVwbHk6IHtcbiAgICAgIGNvbnRlbnQ6XG4gICAgICAgICdXZSB3b3JrIHdpdGggMjAwKyB3aG9sZXNhbGUgcGFydG5lcnMuIEZvciB3aG9sZXNhbGUgaW5xdWlyaWVzLCB1c2Ugb3VyIGNvbnRhY3QgZm9ybSBhbmQgc2VsZWN0IHRoZSB3aG9sZXNhbGUgdG9waWMgXHUyMDE0IGluY2x1ZGUgeW91ciBjb21wYW55IGRldGFpbHMgYW5kIG91ciB0ZWFtIHdpbGwgZm9sbG93IHVwLicsXG4gICAgICBsaW5rczogW3sgbGFiZWw6IFwiV2hvbGVzYWxlIGlucXVpcnlcIiwgaHJlZjogXCIvcGFnZXMvY29udGFjdCN3aG9sZXNhbGVcIiB9XSxcbiAgICB9LFxuICB9LFxuICB7XG4gICAgdGVzdDogL3JldHVybnxyZWZ1bmR8ZXhjaGFuZ2V8c2VuZFxccypiYWNrL2ksXG4gICAgcmVwbHk6IHtcbiAgICAgIGNvbnRlbnQ6XG4gICAgICAgIFwiV2UgYWNjZXB0IHJldHVybnMgd2l0aGluIDE0IGRheXMgb2YgZGVsaXZlcnkuIEl0ZW1zIG11c3QgYmUgdW51c2VkIHdpdGggb3JpZ2luYWwgcGFja2FnaW5nLiBFbWFpbCBpbmZvQGxheW5nby5jb20gd2l0aCB5b3VyIGxheW5nby5jb20gb3JkZXIgbnVtYmVyIHRvIGdldCBhIFJldHVybiBBdXRob3JpemF0aW9uIChSQSkgbnVtYmVyIGJlZm9yZSBzaGlwcGluZyBhbnl0aGluZyBiYWNrLiBSZXR1cm4gc2hpcHBpbmcgaXMgcGFpZCBieSB0aGUgY3VzdG9tZXIgYW5kIG9yaWdpbmFsIHNoaXBwaW5nIGNoYXJnZXMgYXJlIG5vdCByZWZ1bmRlZC5cIixcbiAgICAgIGxpbmtzOiBbXG4gICAgICAgIHsgbGFiZWw6IFwiUmV0dXJuIHBvbGljeVwiLCBocmVmOiBcIi9wYWdlcy9yZXR1cm4tcG9saWN5XCIgfSxcbiAgICAgICAgeyBsYWJlbDogXCJDb250YWN0IHVzXCIsIGhyZWY6IFwiL3BhZ2VzL2NvbnRhY3RcIiB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9LFxuICB7XG4gICAgdGVzdDogL3NoaXB8c2hpcHBpbmd8ZGVsaXZlcnxkZWxpdmVyeXxob3dcXHMqbG9uZ3x3aGVuXFxzKndpbGx8dHJhY2t8dHJhY2tpbmcvaSxcbiAgICByZXBseToge1xuICAgICAgY29udGVudDpcbiAgICAgICAgXCJXZSBzaGlwIHRvIHRoZSBVbml0ZWQgU3RhdGVzIGFuZCBvdGhlciByZWdpb25zIHNob3duIGF0IGNoZWNrb3V0LiBBZnRlciB5b3VyIG9yZGVyIHNoaXBzOiBFY29ub215IGlzIDVcdTIwMTM4IGJ1c2luZXNzIGRheXMsIFN0YW5kYXJkIGlzIDNcdTIwMTM0IGJ1c2luZXNzIGRheXMsIGFuZCBFeHByZXNzIGlzIDFcdTIwMTMyIGJ1c2luZXNzIGRheXMuIE9yZGVycyBwbGFjZWQgYmVmb3JlIDE6MDAgcC5tLiBhcmUgcHJvY2Vzc2VkIHRoZSBzYW1lIGJ1c2luZXNzIGRheSB3aGVuIGludmVudG9yeSBhbGxvd3MuIFlvdSdsbCBnZXQgdHJhY2tpbmcgYnkgZW1haWwgd2hlbiB5b3VyIHBhY2thZ2Ugc2hpcHMuXCIsXG4gICAgICBsaW5rczogW1xuICAgICAgICB7IGxhYmVsOiBcIlNoaXBwaW5nIHBvbGljeVwiLCBocmVmOiBcIi9wb2xpY2llcy9zaGlwcGluZy1wb2xpY3lcIiB9LFxuICAgICAgICB7IGxhYmVsOiBcIlNob3Agbm93XCIsIGhyZWY6IFwiL2NvbGxlY3Rpb25zXCIgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIHRlc3Q6IC9zbXN8dGV4dFxccyptZXNzYWdlfHN0b3B8c3RhcnR8b3B0Lj9vdXR8c3Vic2NyaWJlLip0ZXh0fHBob25lXFxzKm51bWJlci9pLFxuICAgIHJlcGx5OiB7XG4gICAgICBjb250ZW50OlxuICAgICAgICBcIldlIG1heSBzZW5kIHRyYW5zYWN0aW9uYWwgdGV4dHMgKG9yZGVycywgc2hpcHBpbmcsIE9UUCBjb2RlcykgYW5kIG1hcmtldGluZyB0ZXh0cyBpZiB5b3Ugb3B0IGluLiBSZXBseSBTVE9QIGFueXRpbWUgdG8gdW5zdWJzY3JpYmUgXHUyMDE0IHlvdSdsbCBnZXQgb25lIGNvbmZpcm1hdGlvbiBtZXNzYWdlLiBSZXBseSBTVEFSVCB0byBvcHQgYmFjayBpbiwgb3IgSEVMUCBmb3Igc3VwcG9ydC4gTWVzc2FnZSBhbmQgZGF0YSByYXRlcyBtYXkgYXBwbHkuXCIsXG4gICAgICBsaW5rczogW3sgbGFiZWw6IFwiU01TIHBvbGljeVwiLCBocmVmOiBcIi9wb2xpY2llcy9zbXMtcG9saWN5XCIgfV0sXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIHRlc3Q6IC9kaXNjb3VudHxjb3Vwb258cHJvbW98Y29kZXxzYWxlfG9mZlxccypwZXJjZW50fGZpcnN0XFxzKnZpc2l0fHNpZ251cC9pLFxuICAgIHJlcGx5OiB7XG4gICAgICBjb250ZW50OlxuICAgICAgICBcIldlIG9jY2FzaW9uYWxseSBvZmZlciBwcm9tb3Rpb25hbCBkaXNjb3VudHMgXHUyMDE0IGluY2x1ZGluZyBhIGZpcnN0LXZpc2l0IHNpZ251cCBvZmZlciBvbiBvdXIgaG9tZXBhZ2UuIEVudGVyIHlvdXIgZW1haWwgKGFuZCB2ZXJpZnkgeW91ciBwaG9uZSB3aGVuIHByb21wdGVkKSB0byByZWNlaXZlIGEgZGlzY291bnQgY29kZS4gUHJvbW90aW9ucyBhbmQgZnJlZS1zaGlwcGluZyBvZmZlcnMsIHdoZW4gYWN0aXZlLCBhcHBlYXIgYXQgY2hlY2tvdXQuXCIsXG4gICAgICBsaW5rczogW3sgbGFiZWw6IFwiU2hvcCBjb2xsZWN0aW9uc1wiLCBocmVmOiBcIi9jb2xsZWN0aW9uc1wiIH1dLFxuICAgIH0sXG4gIH0sXG4gIHtcbiAgICB0ZXN0OiAvb3JkZXJ8YWNjb3VudHxsb2dpbnx3aGVyZVxccyppc1xccypteXxzdGF0dXMvaSxcbiAgICByZXBseToge1xuICAgICAgY29udGVudDpcbiAgICAgICAgXCJGb3Igb3JkZXIgc3RhdHVzIGFuZCBoaXN0b3J5LCBsb2cgaW4gdG8geW91ciBMYXktbi1HbyBhY2NvdW50LiBJZiB5b3UgbmVlZCBoZWxwIHdpdGggYSBzcGVjaWZpYyBvcmRlciwgZW1haWwgaW5mb0BsYXluZ28uY29tIHdpdGggeW91ciBvcmRlciBudW1iZXIgYW5kIHdlJ2xsIGFzc2lzdCB5b3UuXCIsXG4gICAgICBsaW5rczogW1xuICAgICAgICB7IGxhYmVsOiBcIkFjY291bnQgbG9naW5cIiwgaHJlZjogXCJodHRwczovL3d3dy5sYXluZ28uY29tL2FjY291bnQvbG9naW5cIiB9LFxuICAgICAgICB7IGxhYmVsOiBcIkNvbnRhY3Qgc3VwcG9ydFwiLCBocmVmOiBcIi9wYWdlcy9jb250YWN0XCIgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIHRlc3Q6IC9wcml2YWN5fHRlcm1zfHBlcnNvbmFsXFxzKmRhdGF8Z2Rwcnxjb29raWUvaSxcbiAgICByZXBseToge1xuICAgICAgY29udGVudDpcbiAgICAgICAgXCJPdXIgY29tYmluZWQgVGVybXMgb2YgU2VydmljZSBhbmQgUHJpdmFjeSBQb2xpY3kgZXhwbGFpbnMgaG93IHdlIGhhbmRsZSB5b3VyIGRhdGEsIG9yZGVycywgYW5kIGNvbW11bmljYXRpb25zLiBZb3UgY2FuIHJlYWQgdGhlIGZ1bGwgcG9saWN5IG9uIG91ciBzaXRlLlwiLFxuICAgICAgbGlua3M6IFt7IGxhYmVsOiBcIlRlcm1zICYgcHJpdmFjeVwiLCBocmVmOiBcIi9wb2xpY2llcy90ZXJtcy1vZi1zZXJ2aWNlXCIgfV0sXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIHRlc3Q6IC9wYXRlbnR8bGljZW5zZXxpbnRlbGxlY3R1YWwvaSxcbiAgICByZXBseToge1xuICAgICAgY29udGVudDpcbiAgICAgICAgXCJMYXktbi1HbyBwcm9kdWN0cyBhcmUgcHJvdGVjdGVkIGJ5IFUuUy4gdXRpbGl0eSBwYXRlbnRzIGluY2x1ZGluZyA5LDA4NCw0NTk7IDEwLDAxNiwwMzY7IDEwLDU2MSwyMTM7IGFuZCAxMSwxMTYsMjk4LiBGb3IgbGljZW5zaW5nIGlucXVpcmllcywgZW1haWwgaW5mb0BsYXluZ28uY29tLlwiLFxuICAgICAgbGlua3M6IFt7IGxhYmVsOiBcIlBhdGVudHMgcGFnZVwiLCBocmVmOiBcIi9wYWdlcy9sYXktbi1nby1wYXRlbnRzXCIgfV0sXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIHRlc3Q6IC9jb2xsZWN0aW9ufGNhdGVnb3J5fGNhdGVnb3JpZXN8c2hvcHxicm93c2V8cHJvZHVjdFxccypsaW5lfHdoYXRcXHMqZG9cXHMqeW91XFxzKnNlbGwvaSxcbiAgICByZXBseToge1xuICAgICAgY29udGVudDpcbiAgICAgICAgXCJXZSBvcmdhbml6ZSBzb2x1dGlvbnMgYnkgY2F0ZWdvcnk6IENvc21ldGljIEJhZ3MsIE5haWwgU29sdXRpb25zLCBQbGF5LCBUZWNoICYgVHJhdmVsLCBQZXQgU29sdXRpb25zLCBhbmQgT3V0ZG9vciAvIFRhY3RpY2FsLiBFYWNoIHVzZXMgb3VyIHBhdGVudGVkIG9wZW4tZmxhdCwgY2luY2gtY2xvc2VkIGRlc2lnbiBmb3IgYSBkaWZmZXJlbnQgdXNlIGNhc2UuXCIsXG4gICAgICBsaW5rczogW1xuICAgICAgICB7IGxhYmVsOiBcIlNob3AgYWxsIGNvbGxlY3Rpb25zXCIsIGhyZWY6IFwiL2NvbGxlY3Rpb25zXCIgfSxcbiAgICAgICAgeyBsYWJlbDogXCJDb3NtZXRpYyBiYWdzXCIsIGhyZWY6IFwiL3Nob3AvY29zbWV0aWMtYmFncy12MlwiIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH0sXG4gIHtcbiAgICB0ZXN0OiAvY29udGFjdHxlbWFpbHxwaG9uZXxmYXh8aGVscHxzdXBwb3J0fHJlYWNofHRhbGtcXHMqdG8vaSxcbiAgICByZXBseToge1xuICAgICAgY29udGVudDpcbiAgICAgICAgXCJSZWFjaCB1cyBhdCBpbmZvQGxheW5nby5jb20gb3IgZmF4IDcwMy45OTUuNDkxNi4gVXNlIG91ciBjb250YWN0IGZvcm0gZm9yIG9yZGVycywgcHJvZHVjdHMsIG9yIHdob2xlc2FsZSBpbnF1aXJpZXMgXHUyMDE0IHdlIHR5cGljYWxseSByZXNwb25kIGFzIHNvb24gYXMgcG9zc2libGUuXCIsXG4gICAgICBsaW5rczogW3sgbGFiZWw6IFwiQ29udGFjdCBwYWdlXCIsIGhyZWY6IFwiL3BhZ2VzL2NvbnRhY3RcIiB9XSxcbiAgICB9LFxuICB9LFxuICB7XG4gICAgdGVzdDogL3ByaWNlfGNvc3R8aG93XFxzKm11Y2h8ZXhwZW5zaXZlfGFmZm9yZC9pLFxuICAgIHJlcGx5OiB7XG4gICAgICBjb250ZW50OlxuICAgICAgICBcIlByaWNlcyB2YXJ5IGJ5IHByb2R1Y3QgYW5kIGFyZSBzaG93biBvbiBlYWNoIHByb2R1Y3QgcGFnZS4gU2VsZWN0IHlvdXIgY29sb3Igb3Igc2l6ZSB0byBzZWUgdGhlIGN1cnJlbnQgcHJpY2UgYXQgY2hlY2tvdXQuIEJyb3dzZSBjb2xsZWN0aW9ucyB0byBjb21wYXJlIG9wdGlvbnMuXCIsXG4gICAgICBwcm9kdWN0czogW0NIQVRfUFJPRFVDVFMuY29zbW8yMF0sXG4gICAgICBsaW5rczogW3sgbGFiZWw6IFwiU2hvcCBjb2xsZWN0aW9uc1wiLCBocmVmOiBcIi9jb2xsZWN0aW9uc1wiIH1dLFxuICAgIH0sXG4gIH0sXG5dO1xuXG5leHBvcnQgZnVuY3Rpb24gZmluZEtub3dsZWRnZVJlcGx5KHVzZXJNZXNzYWdlOiBzdHJpbmcpOiBDaGF0QXNzaXN0YW50UmVwbHkgfCBudWxsIHtcbiAgY29uc3QgdHJpbW1lZCA9IHVzZXJNZXNzYWdlLnRyaW0oKTtcbiAgaWYgKCF0cmltbWVkKSByZXR1cm4gbnVsbDtcbiAgZm9yIChjb25zdCB7IHRlc3QsIHJlcGx5IH0gb2YgVE9QSUNfTUFUQ0hFUlMpIHtcbiAgICBpZiAodGVzdC50ZXN0KHRyaW1tZWQpKSByZXR1cm4gcmVwbHk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhbnN3ZXJGcm9tS25vd2xlZGdlKHVzZXJNZXNzYWdlOiBzdHJpbmcpOiBDaGF0QXNzaXN0YW50UmVwbHkge1xuICBjb25zdCB0cmltbWVkID0gdXNlck1lc3NhZ2UudHJpbSgpO1xuICBpZiAoIXRyaW1tZWQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29udGVudDpcbiAgICAgICAgXCJBc2sgbWUgYWJvdXQgcHJvZHVjdHMsIGNvbGxlY3Rpb25zLCBzaGlwcGluZywgcmV0dXJucywgb3VyIHN0b3J5LCB3aG9sZXNhbGUsIG9yIGFueXRoaW5nIGVsc2UgYWJvdXQgTGF5LW4tR28uXCIsXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IG1hdGNoID0gZmluZEtub3dsZWRnZVJlcGx5KHRyaW1tZWQpO1xuICBpZiAobWF0Y2gpIHJldHVybiBtYXRjaDtcblxuICByZXR1cm4ge1xuICAgIGNvbnRlbnQ6XG4gICAgICBcIkknbSBub3Qgc3VyZSBJIGNhdWdodCB0aGF0LiBJJ20gYmVzdCBhdCBMYXktbi1HbyBwcm9kdWN0IHF1ZXN0aW9ucywgc2hpcHBpbmcsIHJldHVybnMsIGFuZCBvdXIgc3RvcnkgXHUyMDE0IHRyeSBzb21ldGhpbmcgbGlrZSBcXFwiV2hhdCBhcmUgeW91ciBiZXN0IHNlbGxlcnM/XFxcIiBvciBzYXkgaGkgYW5kIEknbGwgaGVscCB5b3UgZ2V0IHN0YXJ0ZWQuXCIsXG4gICAgbGlua3M6IFtcbiAgICAgIHsgbGFiZWw6IFwiQ29udGFjdCB1c1wiLCBocmVmOiBcIi9wYWdlcy9jb250YWN0XCIgfSxcbiAgICAgIHsgbGFiZWw6IFwiU2hvcCBjb2xsZWN0aW9uc1wiLCBocmVmOiBcIi9jb2xsZWN0aW9uc1wiIH0sXG4gICAgXSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhbXBsZVF1ZXN0aW9uUmVwbHkocXVlc3Rpb246IHN0cmluZyk6IENoYXRBc3Npc3RhbnRSZXBseSB8IG51bGwge1xuICBjb25zdCBub3JtYWxpemVkID0gcXVlc3Rpb24udHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gIGNvbnN0IG1hdGNoID0gQ0hBVF9TQU1QTEVfUVVFU1RJT05TLmZpbmQoKHEpID0+IHEudG9Mb3dlckNhc2UoKSA9PT0gbm9ybWFsaXplZCk7XG4gIGlmICghbWF0Y2gpIHJldHVybiBudWxsO1xuICByZXR1cm4gYW5zd2VyRnJvbUtub3dsZWRnZShtYXRjaCk7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy90b21icm8vaGFwcHktc3RvcmUtYnJpZGdlLTEvc2VydmVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvdG9tYnJvL2hhcHB5LXN0b3JlLWJyaWRnZS0xL3NlcnZlci9jaGF0QXBpTWlkZGxld2FyZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvdG9tYnJvL2hhcHB5LXN0b3JlLWJyaWRnZS0xL3NlcnZlci9jaGF0QXBpTWlkZGxld2FyZS50c1wiO2ltcG9ydCB0eXBlIHsgSW5jb21pbmdNZXNzYWdlLCBTZXJ2ZXJSZXNwb25zZSB9IGZyb20gXCJodHRwXCI7XG5pbXBvcnQge1xuICBDSEFUX0tOT1dMRURHRV9URVhULFxuICBhbnN3ZXJGcm9tS25vd2xlZGdlLFxuICBmaW5kS25vd2xlZGdlUmVwbHksXG4gIHR5cGUgQ2hhdEFzc2lzdGFudFJlcGx5LFxuICB0eXBlIENoYXRNZXNzYWdlLFxufSBmcm9tIFwiLi4vc3JjL2xpYi9jaGF0Ym90S25vd2xlZGdlXCI7XG5cbmZ1bmN0aW9uIHJlYWRCb2R5KHJlcTogSW5jb21pbmdNZXNzYWdlKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBjaHVua3M6IEJ1ZmZlcltdID0gW107XG4gICAgcmVxLm9uKFwiZGF0YVwiLCAoYykgPT4gY2h1bmtzLnB1c2goYykpO1xuICAgIHJlcS5vbihcImVuZFwiLCAoKSA9PiByZXNvbHZlKEJ1ZmZlci5jb25jYXQoY2h1bmtzKS50b1N0cmluZyhcInV0ZjhcIikpKTtcbiAgICByZXEub24oXCJlcnJvclwiLCByZWplY3QpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gc2VuZEpzb24ocmVzOiBTZXJ2ZXJSZXNwb25zZSwgc3RhdHVzOiBudW1iZXIsIGRhdGE6IHVua25vd24pIHtcbiAgcmVzLnN0YXR1c0NvZGUgPSBzdGF0dXM7XG4gIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gYW5zd2VyV2l0aE9wZW5BaShcbiAgYXBpS2V5OiBzdHJpbmcsXG4gIG1lc3NhZ2VzOiBDaGF0TWVzc2FnZVtdLFxuICBtb2RlbDogc3RyaW5nLFxuKTogUHJvbWlzZTxDaGF0QXNzaXN0YW50UmVwbHk+IHtcbiAgY29uc3Qgc3lzdGVtUHJvbXB0ID0gYFlvdSBhcmUgYSBmcmllbmRseSwgd2FybSBjdXN0b21lciBzZXJ2aWNlIGFzc2lzdGFudCBmb3IgTGF5LW4tR28gKGxheW5nby5jb20pLCBhIGJyYW5kIHRoYXQgc2VsbHMgcGF0ZW50ZWQgZHJhd3N0cmluZyBvcmdhbml6YXRpb25hbCBiYWdzLlxuXG5SZXNwb25kIG5hdHVyYWxseSB0byBncmVldGluZ3MsIHRoYW5rcywgYW5kIGNhc3VhbCBzbWFsbCB0YWxrIChrZWVwIGl0IGJyaWVmLCB0aGVuIG9mZmVyIHRvIGhlbHAgd2l0aCBMYXktbi1HbykuXG5Vc2UgT05MWSB0aGUgZmFjdHMgYmVsb3cgZm9yIHByb2R1Y3QsIHBvbGljeSwgYW5kIGNvbXBhbnkgcXVlc3Rpb25zLiBJZiB5b3UgZG9uJ3Qga25vdyBzb21ldGhpbmcsIGRpcmVjdCB0aGUgY3VzdG9tZXIgdG8gaW5mb0BsYXluZ28uY29tIG9yIC9wYWdlcy9jb250YWN0LlxuS2VlcCBhbnN3ZXJzIHRvIDJcdTIwMTM0IHNob3J0IHNlbnRlbmNlcy4gRG8gbm90IGludmVudCBwb2xpY2llcywgcHJpY2VzLCBvciBwcm9kdWN0cy5cblxuJHtDSEFUX0tOT1dMRURHRV9URVhUfWA7XG5cbiAgY29uc3QgdXBzdHJlYW0gPSBhd2FpdCBmZXRjaChcImh0dHBzOi8vYXBpLm9wZW5haS5jb20vdjEvY2hhdC9jb21wbGV0aW9uc1wiLCB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiB7XG4gICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7YXBpS2V5fWAsXG4gICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIG1vZGVsLFxuICAgICAgdGVtcGVyYXR1cmU6IDAuMyxcbiAgICAgIG1heF90b2tlbnM6IDI4MCxcbiAgICAgIG1lc3NhZ2VzOiBbXG4gICAgICAgIHsgcm9sZTogXCJzeXN0ZW1cIiwgY29udGVudDogc3lzdGVtUHJvbXB0IH0sXG4gICAgICAgIC4uLm1lc3NhZ2VzLm1hcCgobSkgPT4gKHsgcm9sZTogbS5yb2xlLCBjb250ZW50OiBtLmNvbnRlbnQgfSkpLFxuICAgICAgXSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgaWYgKCF1cHN0cmVhbS5vaykge1xuICAgIGNvbnN0IGVyclRleHQgPSBhd2FpdCB1cHN0cmVhbS50ZXh0KCkuY2F0Y2goKCkgPT4gXCJcIik7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBPcGVuQUkgJHt1cHN0cmVhbS5zdGF0dXN9OiAke2VyclRleHQuc2xpY2UoMCwgMjAwKX1gKTtcbiAgfVxuXG4gIGNvbnN0IGRhdGEgPSAoYXdhaXQgdXBzdHJlYW0uanNvbigpKSBhcyB7XG4gICAgY2hvaWNlcz86IHsgbWVzc2FnZT86IHsgY29udGVudD86IHN0cmluZyB9IH1bXTtcbiAgfTtcbiAgY29uc3QgY29udGVudCA9IGRhdGEuY2hvaWNlcz8uWzBdPy5tZXNzYWdlPy5jb250ZW50Py50cmltKCk7XG4gIGlmICghY29udGVudCkgdGhyb3cgbmV3IEVycm9yKFwiRW1wdHkgT3BlbkFJIHJlc3BvbnNlXCIpO1xuXG4gIGNvbnN0IHVzZXJNZXNzYWdlID0gbWVzc2FnZXNbbWVzc2FnZXMubGVuZ3RoIC0gMV0/LmNvbnRlbnQgPz8gXCJcIjtcbiAgY29uc3Qga25vd2xlZGdlTWF0Y2ggPSBmaW5kS25vd2xlZGdlUmVwbHkodXNlck1lc3NhZ2UpO1xuICBjb25zdCBrbm93bGVkZ2VGYWxsYmFjayA9IGFuc3dlckZyb21Lbm93bGVkZ2UodXNlck1lc3NhZ2UpO1xuICByZXR1cm4ge1xuICAgIGNvbnRlbnQsXG4gICAgbGlua3M6IGtub3dsZWRnZU1hdGNoPy5saW5rcyA/PyBrbm93bGVkZ2VGYWxsYmFjay5saW5rcyxcbiAgICBwcm9kdWN0czoga25vd2xlZGdlTWF0Y2g/LnByb2R1Y3RzLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ2hhdEFwaU1pZGRsZXdhcmUoZW52OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSB7XG4gIHJldHVybiBhc3luYyAocmVxOiBJbmNvbWluZ01lc3NhZ2UsIHJlczogU2VydmVyUmVzcG9uc2UsIG5leHQ6ICgpID0+IHZvaWQpID0+IHtcbiAgICBpZiAocmVxLnVybCAhPT0gXCIvYXBpL2NoYXRcIiB8fCByZXEubWV0aG9kICE9PSBcIlBPU1RcIikge1xuICAgICAgbmV4dCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcmVhZEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBib2R5ID8gSlNPTi5wYXJzZShib2R5KSA6IHt9O1xuICAgICAgY29uc3QgbWVzc2FnZXMgPSBBcnJheS5pc0FycmF5KHBheWxvYWQubWVzc2FnZXMpID8gKHBheWxvYWQubWVzc2FnZXMgYXMgQ2hhdE1lc3NhZ2VbXSkgOiBbXTtcbiAgICAgIGNvbnN0IGxhc3RVc2VyID0gWy4uLm1lc3NhZ2VzXS5yZXZlcnNlKCkuZmluZCgobSkgPT4gbS5yb2xlID09PSBcInVzZXJcIik7XG5cbiAgICAgIGlmICghbGFzdFVzZXI/LmNvbnRlbnQ/LnRyaW0oKSkge1xuICAgICAgICBzZW5kSnNvbihyZXMsIDQwMCwgeyBvazogZmFsc2UsIGVycm9yOiBcIk1lc3NhZ2UgaXMgcmVxdWlyZWQuXCIgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYXBpS2V5ID0gZW52Lk9QRU5BSV9BUElfS0VZPy50cmltKCk7XG4gICAgICBjb25zdCBtb2RlbCA9IGVudi5PUEVOQUlfQ0hBVF9NT0RFTD8udHJpbSgpIHx8IFwiZ3B0LTRvLW1pbmlcIjtcblxuICAgICAgY29uc3Qga25vd2xlZGdlTWF0Y2ggPSBmaW5kS25vd2xlZGdlUmVwbHkobGFzdFVzZXIuY29udGVudCk7XG4gICAgICBsZXQgcmVwbHk6IENoYXRBc3Npc3RhbnRSZXBseTtcblxuICAgICAgaWYgKGtub3dsZWRnZU1hdGNoKSB7XG4gICAgICAgIHJlcGx5ID0ga25vd2xlZGdlTWF0Y2g7XG4gICAgICB9IGVsc2UgaWYgKGFwaUtleSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJlcGx5ID0gYXdhaXQgYW5zd2VyV2l0aE9wZW5BaShhcGlLZXksIG1lc3NhZ2VzLCBtb2RlbCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbY2hhdC1hcGldIE9wZW5BSSBmYWlsZWQsIHVzaW5nIGtub3dsZWRnZSBmYWxsYmFjazpcIiwgZXJyKTtcbiAgICAgICAgICByZXBseSA9IGFuc3dlckZyb21Lbm93bGVkZ2UobGFzdFVzZXIuY29udGVudCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcGx5ID0gYW5zd2VyRnJvbUtub3dsZWRnZShsYXN0VXNlci5jb250ZW50KTtcbiAgICAgIH1cblxuICAgICAgc2VuZEpzb24ocmVzLCAyMDAsIHsgb2s6IHRydWUsIHJlcGx5IH0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihcIltjaGF0LWFwaV1cIiwgZXJyKTtcbiAgICAgIHNlbmRKc29uKHJlcywgNTAwLCB7XG4gICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IFwiQ291bGQgbm90IGdldCBhIHJlcGx5LiBQbGVhc2UgdHJ5IGFnYWluIG9yIGVtYWlsIGluZm9AbGF5bmdvLmNvbS5cIixcbiAgICAgIH0pO1xuICAgIH1cbiAg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O0FBQ3JELGFBQU8sWUFBWSxJQUFJLHdCQUF3QixHQUFHLENBQUM7QUFBQSxJQUNyRDtBQUFBLElBQ0EsdUJBQXVCLFFBQVE7QUFDN0IsWUFBTSxNQUFNLFFBQVEsT0FBTyxPQUFPLE1BQU0sUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUN6RCxhQUFPLFlBQVksSUFBSSwyQkFBMkIsR0FBRyxDQUFDO0FBQ3RELGFBQU8sWUFBWSxJQUFJLDhCQUE4QixHQUFHLENBQUM7QUFDekQsYUFBTyxZQUFZLElBQUksNEJBQTRCLEdBQUcsQ0FBQztBQUN2RCxhQUFPLFlBQVksSUFBSSwwQkFBMEIsR0FBRyxDQUFDO0FBQ3JELGFBQU8sWUFBWSxJQUFJLHdCQUF3QixHQUFHLENBQUM7QUFBQSxJQUNyRDtBQUFBLEVBQ0Y7QUFDRjs7O0FENUJBLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sS0FBSztBQUFBLE1BQ0gsU0FBUztBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTLENBQUMsTUFBTSxHQUFHLGdCQUFnQixHQUFHLFNBQVMsaUJBQWlCLGdCQUFnQixDQUFDLEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDakcsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBS0MsTUFBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLElBQ0EsUUFBUSxDQUFDLFNBQVMsYUFBYSxxQkFBcUIseUJBQXlCLHlCQUF5QixzQkFBc0I7QUFBQSxFQUM5SDtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbInBhdGgiLCAibGlzdFJldmlld3NGb3JQcm9kdWN0IiwgInN0b3JlZFRvQ3VzdG9tZXJSZXZpZXciLCAicmVhZEJvZHkiLCAic2VuZEpzb24iLCAicmVhZEJvZHkiLCAic2VuZEpzb24iLCAidXBzdHJlYW0iLCAiZGF0YSIsICJyZWFkQm9keSIsICJzZW5kSnNvbiIsICJpc1ZhbGlkRW1haWwiLCAicmVhZEJvZHkiLCAic2VuZEpzb24iLCAicGF0aCJdCn0K
