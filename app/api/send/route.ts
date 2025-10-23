// app/api/send/route.ts
import { isEmail, isPhone } from "../../../lib/validators";

export const runtime = "nodejs"; // ensure Node (needed for Twilio SDK)

function env(name: string, required = true) {
  const v = process.env[name];
  if (required && !v) throw new Error(`Missing env: ${name}`);
  return v as string;
}

export async function POST(req: Request) {
  try {
    const { email, phone, message } = await req.json();
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    // Prefer email when both are present
    if (email && isEmail(email)) {
      const token = env("POSTMARK_TOKEN");
      const from = env("POSTMARK_FROM");
      const { ServerClient } = await import("postmark");
      const client = new ServerClient(token);
      const res = await client.sendEmail({
        From: from,
        To: email,
        Subject: "RRR Simple Send",
        TextBody: message
      });
      return Response.json({ ok: true, channel: "email", id: res.MessageID });
    }

    // Otherwise try SMS
    if (phone && isPhone(phone)) {
      const sid = env("TWILIO_ACCOUNT_SID");
      const auth = env("TWILIO_AUTH_TOKEN");
      const from = env("TWILIO_FROM");
      const twilio = (await import("twilio")).default;
      const client = twilio(sid, auth);
      const res = await client.messages.create({ from, to: phone, body: message });
      return Response.json({ ok: true, channel: "sms", id: res.sid });
    }

    return Response.json(
      { error: "Provide a valid email or E.164 phone number" },
      { status: 400 }
    );
  } catch (err: any) {
    const msg = err?.message || "Unknown error";
    // Surface missing envs or provider errors directly (simple, no guards)
    return Response.json({ error: msg }, { status: 500 });
  }
}
