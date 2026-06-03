"use client";

import { useState, useRef, useEffect } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  source?: string;
}

export default function AiTutor() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleAsk() {
    if (!question.trim()) return;
    const q = question.trim();
    setQuestion("");
    setLoading(true);
    setError("");

    const userMsg: ChatMessage = { role: "user", content: q };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("/api/ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erreur ${res.status} : ${text}`);
      }

      const data = (await res.json()) as {
        answer?: string;
        source?: string;
      };

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: data.answer || "Je ne sais pas avec les documents fournis.",
        source: data.source,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Problème de connexion au serveur."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col rounded-3xl border-2 border-border bg-card shadow-sm overflow-hidden h-[600px]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <p className="font-display text-2xl text-slate mb-2">
                Pose ta question
              </p>
              <p className="text-sm text-slate-light">
                L&apos;IA répond uniquement à partir des documents fournis.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-3xl px-5 py-4 ${
                msg.role === "user"
                  ? "bg-terracotta text-white rounded-br-md"
                  : "bg-cream text-slate rounded-bl-md border border-border"
              }`}
            >
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
              {msg.source && msg.role === "assistant" && (
                <div className="mt-3 rounded-xl border border-border bg-card px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-light">
                    Source
                  </p>
                  <p className="text-xs text-slate mt-0.5">{msg.source}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-3xl rounded-bl-md bg-cream border border-border px-5 py-4">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-light/40 animate-bounce-soft" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-light/40 animate-bounce-soft [animation-delay:0.2s]" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-light/40 animate-bounce-soft [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="rounded-2xl bg-rose-50 border border-rose-200 px-5 py-3 text-sm text-rose-700">
              ⚠️ {error}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t-2 border-border bg-card p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            placeholder="Ex : Comment calculer un pourcentage d'augmentation ?"
            className="flex-1 rounded-2xl border-2 border-border bg-cream px-5 py-3 text-base text-slate outline-none transition focus:border-terracotta focus:ring-4 focus:ring-terracotta/10"
          />
          <button
            onClick={handleAsk}
            disabled={!question.trim() || loading}
            className="rounded-2xl bg-terracotta px-6 py-3 text-base font-bold text-white transition hover:bg-terracotta-dark active:scale-95 disabled:opacity-40 shadow-sm"
          >
            {loading ? "…" : "→"}
          </button>
        </div>
      </div>
    </div>
  );
}
