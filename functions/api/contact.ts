interface Env {
  CONTACT_FORM_WEBHOOK_URL?: string;
}

const DEFAULT_CONTACT_FORM_WEBHOOK_URL =
  "https://layngo.app.n8n.cloud/webhook/layngo-contact-form";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function str(v: unknown, max: number): string {
  return String(v ?? "").trim().slice(0, max);
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const raw = (await context.request.json().catch(() => ({}))) as Record<string, unknown>;

  const topic = str(raw.topic, 32);
  const firstName = str(raw.firstName, 100);
  const lastName = str(raw.lastName, 100);
  const email = str(raw.email, 254);
  const phone = str(raw.phone, 40);
  const orderNumber = str(raw.orderNumber, 80);
  const company = str(raw.company, 200);
  const message = str(raw.message, 5000);
  const communicationsConsent = raw.communicationsConsent === true;

  if (topic !== "general" && topic !== "wholesale") {
    return Response.json({ ok: false, error: "Invalid topic." }, { status: 400 });
  }
  if (firstName.length < 1 || lastName.length < 1) {
    return Response.json({ ok: false, error: "Please enter your name." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return Response.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }
  if (message.length < 5) {
    return Response.json({ ok: false, error: "Please enter a message." }, { status: 400 });
  }

  const webhookUrl = context.env.CONTACT_FORM_WEBHOOK_URL || DEFAULT_CONTACT_FORM_WEBHOOK_URL;

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        firstName,
        lastName,
        email,
        phone,
        orderNumber,
        company,
        message,
        communicationsConsent,
      }),
    });

    const data = (await upstream.json().catch(() => null)) as {
      ok?: boolean;
      message?: string;
      error?: string;
    } | null;

    if (!upstream.ok) {
      return Response.json(
        {
          ok: false,
          error: data?.error ?? "Could not send your message. Please try again or email info@layngo.com.",
        },
        { status: upstream.status },
      );
    }

    return Response.json({
      ok: true,
      message: data?.message ?? "Thanks — we received your message and will get back to you soon.",
    });
  } catch {
    return Response.json(
      { ok: false, error: "Could not send your message. Please try again or email info@layngo.com." },
      { status: 500 },
    );
  }
}