"use client";

export type SourceStatus = "officiel" | "verifie" | "inconnu";

interface SourceBadgeProps {
  statut: SourceStatus;
}

export default function SourceBadge({ statut }: SourceBadgeProps) {
  const config: Record<
    SourceStatus,
    { label: string; classes: string; icon: string }
  > = {
    officiel: {
      label: "Officiel",
      classes: "bg-terracotta text-white border-terracotta-dark",
      icon: "👑",
    },
    verifie: {
      label: "Vérifié",
      classes: "bg-sage text-white border-sage-dark",
      icon: "✓",
    },
    inconnu: {
      label: "À vérifier",
      classes: "bg-warm-yellow text-slate border-warm-yellow-dark",
      icon: "?",
    },
  };

  const { label, classes, icon } = config[statut] ?? config.inconnu;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${classes}`}
    >
      <span>{icon}</span>
      {label}
    </span>
  );
}
