interface Env {
  REVIEW_SUBMIT_WEBHOOK_URL?: string;
}

const DEFAULT_REVIEW_SUBMIT_WEBHOOK =
  "https://layngo.app.n8n.cloud/webhook/layngo-review-submit";

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const raw = (await context.request.json().catch(() => ({}))) as Record<string, unknown>;

  const productHandle = String(raw.productHandle ?? "").trim().slice(0, 200);
  const name = String(raw.name ?? "").trim().slice(0, 100);
  const text = String(raw.text ?? "").trim().slice(0, 5000);
  const rating = Number(raw.rating);
  const title = raw.title ? String(raw.title).trim().slice(0, 200) : undefined;
  const imageBase64 = raw.imageBase64 ? String(raw.imageBase64) : undefined;

  if (!productHandle) {
    return Response.json({ ok: false, error: "Missing product." }, { status: 400 });
  }
  if (name.length < 2) {
    return Response.json({ ok: false, error: "Please enter your name." }, { status: 400 });
  }
  if (text.length < 10) {
    return Response.json(
      { ok: false, error: "Please write at least a few words in your review." },
      { status: 400 },
    );
  }

  const normalizedRating = Math.round(rating * 2) / 2;
  if (!Number.isFinite(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
    return Response.json(
      { ok: false, error: "Rating must be between 1 and 5 stars." },
      { status: 400 },
    );
  }

  if (imageBase64 && imageBase64.length > 2_500_000) {
    return Response.json(
      { ok: false, error: "Photo is too large. Please use an image under 2MB." },
      { status: 400 },
    );
  }

  const webhookUrl = context.env.REVIEW_SUBMIT_WEBHOOK_URL || DEFAULT_REVIEW_SUBMIT_WEBHOOK;

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productHandle,
        name,
        rating: normalizedRating,
        title,
        text,
        hasImage: Boolean(imageBase64),
      }),
    });

    const data = (await upstream.json().catch(() => null)) as {
      ok?: boolean;
      pending?: boolean;
      message?: string;
      error?: string;
    } | null;

    if (!upstream.ok) {
      return Response.json(
        {
          ok: false,
          error: data?.error ?? "Could not submit your review. Please try again.",
        },
        { status: upstream.status },
      );
    }

    return Response.json({
      ok: true,
      pending: true,
      message: data?.message ?? "Thank you! Your review will be published shortly.",
    });
  } catch {
    return Response.json(
      { ok: false, error: "Could not submit your review. Please try again." },
      { status: 500 },
    );
  }
}