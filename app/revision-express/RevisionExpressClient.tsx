"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import exercisesData from "@/data/exercises/programme-st2s.json";
import programmeData from "@/data/programme.json";
import fichesData from "@/data/fiches.json";
import AnswerPanel from "@/components/AnswerPanel";
import MathText from "@/components/MathText";

type Exercise = {
  id: string;
  notion: string;
  domaine?: string;
  chapitre?: string;
  titre: string;
  difficulte: number;
  question: string;
  typeReponse: "nombre" | "texte";
  reponseAttendue: string | number;
  unite?: string;
  aide: string[];
  correction: string;
  estOfficiel: boolean;
  source: string;
};
type Progress = Record<string, boolean>;

const allExercises = exercisesData.exercices as unknown as Exercise[];

function getProgress(): Progress {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("revisio-progress") || "{}");
  } catch {
    return {};
  }
}

function setProgress(id: string, correct: boolean) {
  const p = getProgress();
  p[id] = correct;
  localStorage.setItem("revisio-progress", JSON.stringify(p));
}

function getWeakNotions(progress: Progress): string[] {
  const stats: Record<string, { done: number; total: number }> = {};
  allExercises.forEach((ex) => {
    if (!stats[ex.notion]) stats[ex.notion] = { done: 0, total: 0 };
    stats[ex.notion].total++;
    if (progress[ex.id]) stats[ex.notion].done++;
  });
  return Object.entries(stats)
    .filter(([, s]) => s.total > 0)
    .sort((a, b) => a[1].done / a[1].total - b[1].done / b[1].total)
    .map(([n]) => n);
}

function getFicheForNotion(notion: string) {
  const chIdMap: Record<string, string> = {
    "Suites numériques": "suites-numeriques",
    "Fonctions de la variable réelle": "fonctions-variable-reelle",
    Dérivation: "derivation",
    Statistique: "statistique",
    "Probabilités conditionnelles": "probabilites-conditionnelles",
    "Épreuves de Bernoulli et variables aléatoires": "bernoulli-variables-aleatoires",
    Automatismes: "automatismes",
    "Pourcentages et évolutions": "pourcentages-evolutions",
    "Fonctions du second degré": "fonctions-second-degre",
  };
  const chId = chIdMap[notion];
  if (!chId) return null;
  return fichesData.fiches.find((f) => f.chapitre === chId) ?? null;
}

export default function RevisionExpressClient() {
  const [progress, setProgressState] = useState<Progress>({});
  const [mode, setMode] = useState<"dashboard" | "session">("dashboard");
  const [sessionExercises, setSessionExercises] = useState<Exercise[]>([]);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const sessionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProgressState(getProgress());
  }, []);

  useEffect(() => {
    if (mode === "session" && sessionRef.current) {
      sessionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [mode, sessionIndex]);

  const weakNotions = useMemo(() => getWeakNotions(progress), [progress]);
  const ficheNotions = useMemo(() => weakNotions.slice(0, 2), [weakNotions]);

  const buildSession = useCallback(() => {
    const weak = weakNotions[0] || "Automatismes";
    const autoPool = allExercises.filter(
      (e) => e.notion === "Automatismes"
    );
    const weakPool = allExercises.filter(
      (e) => e.notion === weak
    );
    const otherPool = allExercises.filter(
      (e) => e.notion !== "Automatismes" && e.notion !== weak
    );

    const pick = (pool: Exercise[], n: number) => {
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, n);
    };

    const session = [
      ...pick(autoPool, 4),
      ...pick(weakPool, 3),
      ...pick(otherPool, 1),
    ].sort(() => Math.random() - 0.5);

    setSessionExercises(session);
    setSessionIndex(0);
    setSessionComplete(false);
    setSessionScore(0);
    setSeenIds(new Set());
    setMode("session");
  }, [weakNotions]);

  const currentEx = sessionExercises[sessionIndex] ?? null;

  const handleAnswered = useCallback(
    (correct: boolean) => {
      if (!currentEx) return;
      setSeenIds((prev) => new Set(prev).add(currentEx.id));
      if (correct) setSessionScore((s) => s + 1);
      setProgress(currentEx.id, correct);
      setProgressState(getProgress());
    },
    [currentEx]
  );

  const nextExercise = useCallback(() => {
    if (sessionIndex + 1 >= sessionExercises.length) {
      setSessionComplete(true);
    } else {
      setSessionIndex((i) => i + 1);
    }
  }, [sessionIndex, sessionExercises.length]);

  /* ─── Dashboard ─── */
  if (mode === "dashboard") {
    const totalDone = Object.values(progress).filter(Boolean).length;
    const totalEx = exercisesData.exercices.length;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl sm:text-4xl text-slate mb-3">
            🚨 Révision express
          </h1>
          <p className="text-slate-light max-w-lg mx-auto">
            Le bac est dans une semaine. On identifie tes lacunes et on les
            tape en 20 minutes chrono.
          </p>
        </div>

        {/* Progression globale */}
        <div className="rounded-3xl border-2 border-border bg-card p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
              Progression totale
            </span>
            <span className="text-sm font-bold text-slate">
              {totalDone}/{totalEx}
            </span>
          </div>
          <div className="h-3 bg-cream rounded-full overflow-hidden border border-border">
            <div
              className="h-full bg-terracotta rounded-full transition-all duration-700"
              style={{
                width: `${totalEx > 0 ? (totalDone / totalEx) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Fiches de révision ciblées */}
        <div className="mb-8 rounded-3xl border-2 border-terracotta/20 bg-terracotta/5 p-6">
          <h2 className="font-display text-xl text-terracotta mb-4">
            {ficheNotions.length > 0 ? "📌 Tes priorités à reviser" : "📚 Toutes les fiches de révision"}
          </h2>
          {(() => {
            const allNotionsWithFiche = [
              "Suites numériques",
              "Fonctions de la variable réelle",
              "Fonctions du second degré",
              "Dérivation",
              "Statistique",
              "Probabilités conditionnelles",
              "Épreuves de Bernoulli et variables aléatoires",
              "Automatismes",
              "Pourcentages et évolutions",
            ];
            const displayNotions = ficheNotions.length > 0 ? ficheNotions : allNotionsWithFiche;
            return (
            <div className="flex flex-col gap-6">
              {displayNotions.map((notion) => {
                const fiche = getFicheForNotion(notion);
                const stat = (() => {
                  const pool = allExercises.filter(
                    (e) => e.notion === notion
                  );
                  const done = pool.filter((e) => progress[e.id]).length;
                  return { done, total: pool.length };
                })();
                return (
                  <div
                    key={notion}
                    className="rounded-2xl bg-card border border-border p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-bold text-slate text-lg">{notion}</p>
                        {fiche && (
                          <p className="text-xs text-slate-light italic">{fiche.sous_titre}</p>
                        )}
                      </div>
                      <span className="text-xs font-bold text-terracotta">
                        {stat.done}/{stat.total} réussis
                      </span>
                    </div>

                    {fiche ? (
                      <div className="flex flex-col gap-5">
                        {/* Points clés */}
                        <div className="rounded-xl bg-cream/60 border border-border p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-light mb-3">
                            🗝️ Points clés
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {fiche.points_cles.map((pt, i) => (
                              <div key={i} className="bg-card rounded-lg p-3 border border-border/60">
                                <p className="font-bold text-sm text-slate mb-1">{pt.titre}</p>
                                <MathText className="text-sm text-slate-light leading-relaxed">{pt.texte}</MathText>
                                <div className="mt-2 rounded bg-sage/10 px-2 py-1 border border-sage/20">
                                  <MathText className="text-sm text-sage-dark font-mono">{pt.formule}</MathText>
                                </div>
                                <p className="mt-1.5 text-xs text-warm-yellow-dark italic">💡 {pt.astuce}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Méthode */}
                        <div className="rounded-xl bg-terracotta/5 border border-terracotta/20 p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-terracotta mb-3">
                            🧭 Méthode en {fiche.methode.length} étapes
                          </p>
                          <ol className="list-decimal list-inside space-y-2 text-sm text-slate leading-relaxed">
                            {fiche.methode.map((step, i) => (
                              <li key={i}><MathText>{step}</MathText></li>
                            ))}
                          </ol>
                        </div>

                        {/* Exemple */}
                        <div className="rounded-xl bg-warm-yellow/10 border border-warm-yellow/30 p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-warm-yellow-dark mb-2">
                            🩺 Exemple ST2S
                          </p>
                          <MathText className="text-sm text-slate leading-relaxed">{fiche.exemple}</MathText>
                        </div>

                        {/* Pièges */}
                        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-2">
                            ⚠️ Pièges à éviter
                          </p>
                          <ul className="space-y-1.5">
                            {fiche.pieges.map((p, i) => (
                              <li key={i} className="text-sm text-rose-800 leading-relaxed">
                                • <MathText>{p}</MathText>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-light">
                        Fiche de révision en cours de rédaction pour cette notion.
                      </p>
                    )}

                    <Link
                      href={`/reviser?notion=${encodeURIComponent(notion)}`}
                      className="inline-block mt-5 rounded-xl bg-terracotta px-5 py-2.5 text-sm font-bold text-white hover:bg-terracotta-dark transition shadow-sm"
                    >
                      S’entraîner sur {notion} →
                    </Link>
                  </div>
                );
              })}
            </div>
            );
          })()}
        </div>

        {/* Lancer session */}
        <div className="text-center rounded-3xl border-2 border-border bg-card p-8 shadow-sm">
          <p className="font-display text-xl text-slate mb-3">
            Prêt pour une session intensive ?
          </p>
          <p className="text-sm text-slate-light mb-6 max-w-sm mx-auto">
            4 automatismes + 3 exercices sur ta notion la plus faible + 1
            surprise. Objectif : 20 minutes.
          </p>
          <button
            onClick={buildSession}
            className="rounded-2xl bg-terracotta px-8 py-4 text-lg font-bold text-white transition hover:bg-terracotta-dark shadow-sm hover:shadow-md active:scale-95"
          >
            Lancer la session express →
          </button>
        </div>
      </div>
    );
  }

  /* ─── Session terminée ─── */
  if (sessionComplete) {
    const total = sessionExercises.length;
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <p className="text-5xl mb-4">🎉</p>
        <h2 className="font-display text-3xl text-slate mb-4">
          Session terminée
        </h2>
        <p className="text-xl text-slate mb-2">
          {sessionScore} / {total} réussis
        </p>
        <p className="text-sm text-slate-light mb-8">
          {sessionScore === total
            ? "Parfait ! Tu maîtrises ces notions."
            : sessionScore >= total * 0.6
            ? "Solide. Quelques points à reprendre avant le jour J."
            : "Il reste du travail. Refais une session ce soir."}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => setMode("dashboard")}
            className="rounded-2xl border-2 border-border bg-card px-6 py-3 font-bold text-slate transition hover:bg-cream"
          >
            Retour au tableau de bord
          </button>
          <Link
            href="/reviser"
            className="rounded-2xl bg-terracotta px-6 py-3 font-bold text-white transition hover:bg-terracotta-dark"
          >
            Continuer à réviser →
          </Link>
        </div>
      </div>
    );
  }

  /* ─── Session en cours ─── */
  if (!currentEx) return null;

  const progressPercent =
    ((sessionIndex + 1) / sessionExercises.length) * 100;

  return (
    <div ref={sessionRef} className="max-w-3xl mx-auto scroll-mt-24">
      {/* Barre de progression */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-slate-light">
            Exercice {sessionIndex + 1} / {sessionExercises.length}
          </span>
          <span className="text-xs font-bold text-terracotta">
            {currentEx.notion}
          </span>
        </div>
        <div className="h-2 bg-cream rounded-full overflow-hidden border border-border">
          <div
            className="h-full bg-terracotta rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="rounded-3xl border-2 border-border bg-card p-6 shadow-sm mb-5">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex rounded-full border-2 border-terracotta/20 bg-terracotta/5 px-3 py-1 text-xs font-bold text-terracotta">
            {currentEx.notion}
          </span>
          <span className="text-xs text-slate-light">
            Difficulté : {"★".repeat(currentEx.difficulte)}
            {"☆".repeat(3 - currentEx.difficulte)}
          </span>
        </div>
        <h2 className="font-display text-2xl text-slate mb-4">
          {currentEx.titre}
        </h2>
        <MathText className="text-base leading-relaxed text-slate">
          {currentEx.question}
        </MathText>
      </div>

      <AnswerPanel
        typeReponse={currentEx.typeReponse}
        reponseAttendue={currentEx.reponseAttendue}
        unite={currentEx.unite}
        aide={currentEx.aide}
        correction={currentEx.correction}
        onAnswered={handleAnswered}
      />

      <div className="mt-6 text-center">
        <button
          onClick={nextExercise}
          disabled={!seenIds.has(currentEx.id)}
          className="rounded-2xl bg-sage px-8 py-3 text-base font-bold text-white transition hover:bg-sage-dark active:scale-95 disabled:opacity-40 shadow-sm"
        >
          {sessionIndex + 1 >= sessionExercises.length
            ? "Terminer la session"
            : "Suivant →"}
        </button>
      </div>
    </div>
  );
}
