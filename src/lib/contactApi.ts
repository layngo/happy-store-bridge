export type ContactFormPayload = {
  topic: "general" | "wholesale";
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  orderNumber?: string;
  company?: string;
  message: string;
  /** User agreed to receive inquiry replies and marketing at submit time. */
  communicationsConsent: boolean;
};

export type ContactFormResponse =
  | { ok: true; message: string }
  | { ok: false; error: string };

function contactEndpoint(): string {
  // Always route through our server-side endpoint so the upstream webhook URL
  // is never exposed and all submissions are validated before being forwarded.
  return "/api/contact";
}

export async function submitContactForm(payload: ContactFormPayload): Promise<ContactFormResponse> {
  try {
    const res = await fetch(contactEndpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await res.json().catch(() => null)) as {
      ok?: boolean;
      message?: string;
      error?: string;
    } | null;

    if (!res.ok) {
      return {
        ok: false,
        error: data?.error ?? "Could not send your message. Please try again or email info@layngo.com.",
      };
    }

    return {
      ok: true,
      message: data?.message ?? "Thanks: we received your message and will get back to you soon.",
    };
  } catch {
    return {
      ok: false,
      error: "Could not send your message. Please try again or email info@layngo.com.",
    };
  }
}
