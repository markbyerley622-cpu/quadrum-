import { NextResponse } from "next/server";

/**
 * Enquiry delivery.
 *
 * This route deliberately has no default destination. If `ENQUIRY_WEBHOOK_URL`
 * is not set it returns 503 and the form tells the sender to email us instead,
 * rather than accepting the enquiry and dropping it. A contact form that
 * returns "thank you" into a void is the single worst failure this page can
 * have, so the unconfigured state is loud by design.
 *
 * Point ENQUIRY_WEBHOOK_URL at whatever receives it — a transactional email
 * provider, a Slack incoming webhook, a CRM endpoint. The payload is flat JSON.
 */

export const runtime = "nodejs";
/** Never cached: this is a write. */
export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Trim, cap length, and guarantee a string out. Caps bound the payload. */
function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "malformed" }, { status: 400 });
  }

  const raw = (body ?? {}) as Record<string, unknown>;

  // Honeypot. Accept silently — a bot told it failed simply tries again.
  if (text(raw.website, 200) !== "") {
    return NextResponse.json({ ok: true });
  }

  const enquiry = {
    name: text(raw.name, 120),
    email: text(raw.email, 200),
    company: text(raw.company, 160),
    brief: text(raw.brief, 4000),
    stage: text(raw.stage, 60),
  };

  if (!enquiry.name || !enquiry.company || !enquiry.brief || !EMAIL.test(enquiry.email)) {
    return NextResponse.json({ error: "invalid" }, { status: 422 });
  }

  const endpoint = process.env.ENQUIRY_WEBHOOK_URL;

  if (!endpoint) {
    console.error(
      "[enquiry] ENQUIRY_WEBHOOK_URL is not set — enquiry refused rather than dropped.",
    );
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const delivered = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...enquiry, receivedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!delivered.ok) {
      console.error(`[enquiry] delivery endpoint returned ${delivered.status}`);
      return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[enquiry] delivery threw", error);
    return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  }
}
