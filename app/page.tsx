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
    <main className="min-h-scr
