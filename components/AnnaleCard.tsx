import SourceBadge, { SourceStatus } from "./SourceBadge";

interface AnnaleCardProps {
  id: string;
  titre: string;
  niveau: string;
  serie: string;
  annee: number;
  source: string;
  url: string;
  urlPage?: string;
  statut: SourceStatus;
  type: string;
  matiere?: string;
  description: string;
}

export default function AnnaleCard({
  titre,
  niveau,
  serie,
  annee,
  source,
  url,
  urlPage,
  statut,
  type,
  matiere,
  description,
}: AnnaleCardProps) {
  const href = url || urlPage || "#";
  const isExternal = href.startsWith("http");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group block rounded-3xl border-2 border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-terracotta/30 hover:shadow-md hover:-translate-y-1"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <span className="inline-block rounded-md bg-cream border border-border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-light mb-1.5">
            {type}
          </span>
          <h3 className="font-display text-lg text-slate group-hover:text-terracotta transition-colors">
            {titre}
          </h3>
          <p className="mt-1 text-xs font-semibold text-slate-light">
            {niveau} · {serie} · {annee}
            {matiere && ` · ${matiere}`}
          </p>
        </div>
        <SourceBadge statut={statut} />
      </div>
      <p className="mb-5 text-sm text-slate-light leading-relaxed">
        {description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-light/70">{source}</span>
        <span className="text-sm font-bold text-terracotta opacity-0 group-hover:opacity-100 transition-opacity">
          {isExternal ? "Ouvrir →" : "Consulter →"}
        </span>
      </div>
    </a>
  );
}
