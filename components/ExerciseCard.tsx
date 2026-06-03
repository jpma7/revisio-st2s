"use client";

interface ExerciseCardProps {
  id: string;
  notion: string;
  titre: string;
  difficulte: number;
  question: string;
  onSelect: (id: string) => void;
  isActive?: boolean;
  isCompleted?: boolean;
}

export default function ExerciseCard({
  id,
  notion,
  titre,
  difficulte,
  question,
  onSelect,
  isActive,
  isCompleted,
}: ExerciseCardProps) {
  const notionColors: Record<string, string> = {
    Automatismes: "bg-violet-100 text-violet-700 border-violet-200",
    Pourcentages: "bg-rose-100 text-rose-700 border-rose-200",
    Suites: "bg-amber-100 text-amber-700 border-amber-200",
    Fonctions: "bg-teal-100 text-teal-700 border-teal-200",
    Probabilités: "bg-indigo-100 text-indigo-700 border-indigo-200",
  };

  return (
    <button
      onClick={() => onSelect(id)}
      className={`group w-full text-left rounded-3xl border-2 p-5 transition-all duration-300 ${
        isActive
          ? "border-terracotta bg-card shadow-lg"
          : "border-border bg-card hover:border-terracotta/40 hover:shadow-md hover:-translate-y-0.5"
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
            notionColors[notion] ?? "bg-slate-100 text-slate-600 border-slate-200"
          }`}
        >
          {notion}
        </span>
        <div className="flex items-center gap-2">
          {isCompleted && (
            <span className="text-lg" title="Exercice réussi">🌟</span>
          )}
          <span className="text-xs font-medium text-slate-light">
            {"★".repeat(difficulte)}{"☆".repeat(3 - difficulte)}
          </span>
        </div>
      </div>
      <h3 className="font-display text-lg text-slate mb-2 group-hover:text-terracotta transition-colors">
        {titre}
      </h3>
      <p className="text-sm text-slate-light leading-relaxed line-clamp-3">
        {question}
      </p>
    </button>
  );
}
