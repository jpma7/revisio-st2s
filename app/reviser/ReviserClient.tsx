"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import programmeData from "@/data/exercises/programme-st2s.json";
import ExerciseCard from "@/components/ExerciseCard";
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

const exercises = programmeData.exercices as Exercise[];
const notions = ["Toutes", ...Array.from(new Set(exercises.map((e) => e.notion)))];

function getProgress(): Record<string, boolean> {
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

function getProgressForNotion(notion: string): { done: number; total: number } {
  const p = getProgress();
  const notionExs =
    notion === "Toutes"
      ? exercises
      : exercises.filter((e) => e.notion === notion);
  const done = notionExs.filter((e) => p[e.id]).length;
  return { done, total: notionExs.length };
}

function getTotalProgress(): { done: number; total: number } {
  const p = getProgress();
  const done = exercises.filter((e) => p[e.id]).length;
  return { done, total: exercises.length };
}

export default function ReviserClient() {
  const searchParams = useSearchParams();
  const initialNotion = searchParams.get("notion") ?? "Toutes";

  const [filter, setFilter] = useState(initialNotion);
  const [selectedId, setSelectedId] = useState<string | null>(() =>
    searchParams.get("exercise")
  );
  const [, forceUpdate] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);

  // Scroll to exercise area on mobile when selecting
  useEffect(() => {
    if (selectedId && mainRef.current && window.innerWidth < 1024) {
      mainRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedId]);

  // Refresh UI when localStorage changes (e.g. from AnswerPanel)
  const refreshProgress = useCallback(() => {
    forceUpdate((n) => n + 1);
  }, []);

  const filtered = useMemo(
    () =>
      filter === "Toutes"
        ? exercises
        : exercises.filter((e) => e.notion === filter),
    [filter]
  );

  const selected = exercises.find((e) => e.id === selectedId) ?? null;
  const progress = useMemo(() => getTotalProgress(), []);
  const notionProgress = useMemo(
    () => getProgressForNotion(filter),
    [filter]
  );

  return (
    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        {/* Overall progress */}
        <div className="rounded-3xl border-2 border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-terracotta mb-2">
            Progression totale
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-cream rounded-full overflow-hidden border border-border">
              <div
                className="h-full bg-terracotta rounded-full transition-all duration-700"
                style={{
                  width: `${(progress.done / progress.total) * 100}%`,
                }}
              />
            </div>
            <span className="text-sm font-bold text-slate">
              {progress.done}/{progress.total}
            </span>
          </div>
        </div>

        {/* Topic filters */}
        <div className="rounded-3xl border-2 border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-light mb-3">
            Filtrer par notion
          </p>
          <div className="flex flex-wrap gap-2">
            {notions.map((n) => {
              const np = getProgressForNotion(n);
              const isActive = filter === n;
              return (
                <button
                  key={n}
                  onClick={() => {
                    setFilter(n);
                    setSelectedId(null);
                  }}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-terracotta text-white shadow-sm"
                      : "bg-cream text-slate hover:bg-terracotta/10"
                  }`}
                >
                  {n}
                  {n !== "Toutes" && (
                    <span className="ml-1.5 text-xs opacity-70">
                      {np.done}/{np.total}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Notion progress bar */}
          {filter !== "Toutes" && (
            <div className="mt-4">
              <div className="h-2 bg-cream rounded-full overflow-hidden border border-border">
                <div
                  className="h-full bg-sage rounded-full transition-all duration-700"
                  style={{
                    width: `${(notionProgress.done / notionProgress.total) * 100}%`,
                  }}
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-light">
                {notionProgress.done} sur {notionProgress.total} exercices
                réussis
              </p>
            </div>
          )}
        </div>

        {/* Exercise list */}
        <div className="flex flex-col gap-3">
          {filtered.map((ex) => (
            <ExerciseCard
              key={ex.id}
              id={ex.id}
              notion={ex.notion}
              titre={ex.titre}
              difficulte={ex.difficulte}
              question={ex.question}
              onSelect={setSelectedId}
              isActive={selectedId === ex.id}
              isCompleted={getProgress()[ex.id]}
            />
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-slate-light">
              Aucun exercice pour cette notion.
            </p>
          )}
        </div>
      </div>

      {/* Main exercise area */}
      <div ref={mainRef} className="lg:col-span-2 scroll-mt-24">
        {selected ? (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div className="rounded-3xl border-2 border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex rounded-full border-2 border-terracotta/20 bg-terracotta/5 px-3 py-1 text-xs font-bold text-terracotta">
                  {selected.notion}
                </span>
                <span className="text-xs text-slate-light">
                  Difficulté : {"★".repeat(selected.difficulte)}
                  {"☆".repeat(3 - selected.difficulte)}
                </span>
              </div>
              <h2 className="font-display text-2xl text-slate mb-4">
                {selected.titre}
              </h2>
              <MathText className="text-base leading-relaxed text-slate">
                {selected.question}
              </MathText>
              {selected.source && (
                <p className="mt-4 text-xs text-slate-light/60">
                  Source : {selected.source}
                  {selected.estOfficiel ? " (officiel)" : ""}
                </p>
              )}
            </div>
            <AnswerPanel
              typeReponse={selected.typeReponse}
              reponseAttendue={selected.reponseAttendue}
              unite={selected.unite}
              aide={selected.aide}
              correction={selected.correction}
              onAnswered={(correct) => {
                setProgress(selected.id, correct);
                refreshProgress();
              }}
              onNext={() => {
                const idx = filtered.findIndex((e) => e.id === selectedId);
                const next = filtered[idx + 1];
                if (next) setSelectedId(next.id);
              }}
              isLast={filtered.findIndex((e) => e.id === selectedId) === filtered.length - 1}
            />
          </div>
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-border bg-card p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <span className="text-4xl mb-4">👆</span>
            <p className="font-display text-xl text-slate mb-2">
              Sélectionne un exercice
            </p>
            <p className="text-sm text-slate-light max-w-xs">
              Choisis un exercice dans la liste à gauche pour commencer ta
              révision.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
