"use client";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, message })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      setStatus(`✅ Sent via ${data.channel} (id: ${data.id || "n/a"})`);
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err: any) {
      setStatus(`❌ ${err.message || "Failed to send"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900/70 border border-slate-800 p-6 shadow-xl">
        <h1 className="text-2xl font-semibold">RRR – Simple Send</h1>
        <p className="text-slate-300 mt-1">
          Type an email <em>or</em> a phone number and a message. No guards.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Email (Postmark)</label>
              <input
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="homi@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Phone (Twilio, E.164)</label>
              <input
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+15551234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Message</label>
            <textarea
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message…"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !message || (!email && !phone)}
            className="rounded-xl px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending…" : "Send"}
          </button>

          {status && <div className="mt-3 text-sm">{status}</div>}

          <p className="text-xs text-slate-400 mt-2">
            If both email and phone are filled, email wins.
          </p>
        </form>
      </div>
    </main>
  );
}
