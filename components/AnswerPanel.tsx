"use client";

import { useState } from "react";

interface AnswerPanelProps {
  typeReponse: "nombre" | "texte";
  reponseAttendue: string | number;
  unite?: string;
  aide: string[];
  correction: string;
  onAnswered?: (correct: boolean) => void;
  onNext?: () => void;
  isLast?: boolean;
}

export default function AnswerPanel({
  typeReponse,
  reponseAttendue,
  unite,
  aide,
  correction,
  onAnswered,
  onNext,
  isLast,
}: AnswerPanelProps) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "help" | "correct" | "wrong">("idle");
  const [helpIndex, setHelpIndex] = useState(0);
  const [showCorrection, setShowCorrection] = useState(false);

  function normalize(val: string) {
    return val
      .toLowerCase()
      .replace(/\s/g, "")
      .replace(/,/g, ".")
      .replace(/€/g, "")
      .replace(/%/g, "")
      .replace(/∞/g, "inf")
      .replace(/infinity/g, "inf");
  }

  function checkAnswer() {
    const expected = String(reponseAttendue);
    let ok = false;
    if (typeReponse === "nombre") {
      const numInput = Number(normalize(input));
      const numExpected = Number(normalize(expected));
      ok =
        !Number.isNaN(numInput) &&
        !Number.isNaN(numExpected) &&
        Math.abs(numInput - numExpected) < 1e-9;
    } else {
      ok = normalize(input) === normalize(expected);
    }
    setStatus(ok ? "correct" : "wrong");
    onAnswered?.(ok);
  }

  function showNextHelp() {
    if (helpIndex < aide.length) {
      setHelpIndex((i) => i + 1);
    }
    setStatus("help");
  }

  function reset() {
    setInput("");
    setStatus("idle");
    setHelpIndex(0);
    setShowCorrection(false);
  }

  return (
    <div className="rounded-3xl border-2 border-border bg-card p-6 shadow-sm">
      <div className="mb-5">
        <label className="mb-2 block text-sm font-bold text-slate uppercase tracking-wide">
          Ta réponse {unite ? <span className="text-slate-light font-normal">({unite})</span> : ""}
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
          disabled={status === "correct"}
          className="w-full rounded-2xl border-2 border-border bg-cream px-5 py-4 text-lg text-slate outline-none transition focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 disabled:opacity-50 font-mono"
          placeholder={typeReponse === "nombre" ? "Ex : 15" : "Ex : u1=8, u2=11"}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={checkAnswer}
          disabled={!input.trim() || status === "correct"}
          className="rounded-2xl bg-terracotta px-6 py-3 text-base font-bold text-white transition hover:bg-terracotta-dark active:scale-95 disabled:opacity-40 shadow-sm hover:shadow-md"
        >
          {status === "correct" ? "Validé ✓" : "Vérifier"}
        </button>
        <button
          onClick={showNextHelp}
          disabled={helpIndex >= aide.length && status === "help"}
          className="rounded-2xl border-2 border-border bg-card px-6 py-3 text-base font-bold text-slate transition hover:bg-cream hover:border-warm-yellow active:scale-95 disabled:opacity-40"
        >
          💡 Aide
        </button>
        <button
          onClick={() => setShowCorrection(true)}
          className="rounded-2xl border-2 border-border bg-card px-6 py-3 text-base font-bold text-slate transition hover:bg-cream active:scale-95"
        >
          📖 Correction
        </button>
        {(status !== "idle" || showCorrection) && (
          <button
            onClick={reset}
            className="rounded-2xl border-2 border-border bg-card px-6 py-3 text-base font-bold text-slate-light transition hover:bg-cream active:scale-95"
          >
            ↻ Recommencer
          </button>
        )}
        {onNext && (status === "correct" || showCorrection) && (
          <button
            onClick={() => {
              reset();
              onNext();
            }}
            className="rounded-2xl bg-sage px-6 py-3 text-base font-bold text-white transition hover:bg-sage-dark active:scale-95 shadow-sm ml-auto"
          >
            {isLast ? "Terminer 🏁" : "Suivant →"}
          </button>
        )}
      </div>

      {status === "help" && helpIndex > 0 && (
        <div className="mt-5 rounded-2xl border-2 border-warm-yellow bg-warm-yellow/10 p-5 animate-fade-in">
          <p className="mb-1 font-bold text-warm-yellow-dark">💡 Indice {helpIndex} / {aide.length}</p>
          <p className="text-slate leading-relaxed">{aide[helpIndex - 1]}</p>
        </div>
      )}

      {status === "correct" && (
        <div className="mt-5 rounded-2xl border-2 border-sage bg-sage/10 p-5 animate-fade-in-up">
          <p className="font-display text-xl text-sage-dark mb-2">🌟 Super !</p>
          <p className="text-slate leading-relaxed">{correction}</p>
        </div>
      )}

      {status === "wrong" && (
        <div className="mt-5 rounded-2xl border-2 border-terracotta bg-terracotta/5 p-5 animate-fade-in-up">
          <p className="font-display text-xl text-terracotta mb-2">💪 Encore un effort...</p>
          <p className="text-slate leading-relaxed">
            Ce n’est pas la bonne réponse. Utilise le bouton <strong className="text-terracotta">Aide</strong> pour avancer pas à pas, ou lis la <strong className="text-terracotta">Correction</strong>.
          </p>
        </div>
      )}

      {showCorrection && status !== "correct" && (
        <div className="mt-5 rounded-2xl border-2 border-slate-light/30 bg-cream p-5 animate-fade-in">
          <p className="mb-2 font-bold text-slate-light">📖 Correction</p>
          <p className="text-slate leading-relaxed">{correction}</p>
        </div>
      )}
    </div>
  );
}
