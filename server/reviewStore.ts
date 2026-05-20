import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";

export type StoredCustomerReview = {
  id: string;
  productHandle: string;
  name: string;
  orderName: string;
  rating: number;
  title?: string;
  text: string;
  images?: string[];
  createdAt: string;
};

const STORE_PATH = path.join(process.cwd(), "data", "submitted-reviews.json");

async function readAll(): Promise<StoredCustomerReview[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as StoredCustomerReview[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(reviews: StoredCustomerReview[]): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(reviews, null, 2), "utf8");
}

export async function listReviewsForProduct(productHandle: string): Promise<StoredCustomerReview[]> {
  const all = await readAll();
  const wanted = productHandle.toLowerCase();
  return all.filter((r) => r.productHandle.toLowerCase() === wanted);
}

export type SubmitReviewInput = {
  productHandle: string;
  name: string;
  verificationToken: string;
  rating: number;
  title?: string;
  text: string;
  imageBase64?: string;
};

export async function submitReview(
  input: SubmitReviewInput,
): Promise<{ ok: true; review: StoredCustomerReview } | { ok: false; error: string }> {
  const { consumeVerificationToken } = await import("./reviewSessions");
  const session = consumeVerificationToken(input.verificationToken, input.productHandle);
  if (!session.ok) return session;

  const name = input.name.trim();
  const text = input.text.trim();
  if (name.length < 2) return { ok: false, error: "Please enter your name." };
  if (text.length < 10) return { ok: false, error: "Please write at least a few words in your review." };

  const rating = Math.round(input.rating * 2) / 2;
  if (rating < 1 || rating > 5) {
    return { ok: false, error: "Rating must be between 1 and 5 stars." };
  }

  let images: string[] | undefined;
  if (input.imageBase64) {
    if (input.imageBase64.length > 2_500_000) {
      return { ok: false, error: "Photo is too large. Please use an image under 2MB." };
    }
    images = [input.imageBase64];
  }

  const review: StoredCustomerReview = {
    id: `submitted-${randomUUID()}`,
    productHandle: input.productHandle,
    name,
    orderName: session.orderName,
    rating,
    title: input.title?.trim() || undefined,
    text,
    images,
    createdAt: new Date().toISOString(),
  };

  const all = await readAll();
  all.push(review);
  await writeAll(all);

  return { ok: true, review };
}

export type CustomerReviewDto = {
  id: string;
  name: string;
  rating: number;
  title?: string;
  text: string;
  images?: string[];
};

export function storedToCustomerReview(r: StoredCustomerReview): CustomerReviewDto {
  return {
    id: r.id,
    name: r.name,
    rating: r.rating,
    title: r.title,
    text: r.text,
    images: r.images,
  };
}
