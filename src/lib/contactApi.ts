export type ContactFormPayload = {
  topic: "general" | "wholesale";
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  orderNumber?: string;
  company?: string;
  message: string;
};

export type ContactFormResponse =
  | { ok: true; message: string }
  | { ok: false; error: string };

const DEFAULT_CONTACT_FORM_WEBHOOK_URL =
  "https://layngo.app.n8n.cloud/webhook/layngo-contact-form";

export async function submitContactForm(payload: ContactFormPayload): Promise<ContactFormResponse> {
  const webhookUrl =
    (import.meta.env.VITE_CONTACT_FORM_WEBHOOK_URL as string | undefined) || DEFAULT_CONTACT_FORM_WEBHOOK_URL;

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await res.json().catch(() => null)) as { ok?: boolean; message?: string; error?: string } | null;

    if (!res.ok) {
      return { ok: false, error: data?.error ?? "Could not send your message. Please try again or email info@layngo.com." };
    }

    return { ok: true, message: data?.message ?? "Thanks — we received your message and will get back to you soon." };
  } catch {
    return { ok: false, error: "Could not send your message. Please try again or email info@layngo.com." };
  }
}
