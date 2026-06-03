import annalesData from "@/data/annales/sources.json";
import AnnaleCard from "@/components/AnnaleCard";
import type { SourceStatus } from "@/components/SourceBadge";

export const metadata = {
  title: "Annales – Révisio",
  description: "Sources officielles et liens vers les annales du bac ST2S",
};

export default function AnnalesPage() {
  const sources = annalesData.sources;

  return (
    <div className="min-h-full px-6 py-8 sm:px-10 max-w-5xl mx-auto">
      <div className="text-center sm:text-left mb-8">
        <h1 className="font-display text-3xl sm:text-4xl text-slate">
          Annales
        </h1>
        <p className="mt-2 text-slate-light max-w-lg">
          Les vraies sources officielles pour t&apos;entraîner. Pas de PDFs magiques ici — juste des liens honnêtes.
        </p>
      </div>

      <div className="rounded-2xl border-2 border-terracotta/20 bg-terracotta/5 p-5 mb-8">
        <p className="text-sm text-slate leading-relaxed">
          <strong className="text-terracotta">ℹ️ Pourquoi pas de PDF intégré ?</strong>{" "}
          EDUSCOL ne publie pas de sujets zéro mathématiques isolés pour la série ST2S. Les annales sont diffusées par les académies ou des agrégateurs. On te pointe directement vers les bonnes sources — pas de bullshit.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sources.map((s) => (
          <AnnaleCard
            key={s.id}
            id={s.id}
            titre={s.titre}
            niveau={s.niveau}
            serie={s.serie}
            annee={s.annee}
            source={s.source}
            url={s.url}
            urlPage={s.urlPage}
            statut={s.statut as SourceStatus}
            type={s.type}
            matiere={s.matiere}
            description={s.description}
          />
        ))}
      </div>

      <div className="mt-10 max-w-2xl mx-auto rounded-3xl border-2 border-warm-yellow bg-warm-yellow/10 p-6">
        <p className="font-display text-lg text-slate mb-3">
          📖 À propos des sources
        </p>
        <ul className="space-y-2 text-sm text-slate-light">
          <li className="flex items-start gap-2">
            <span className="text-terracotta mt-0.5">👑</span>
            <span>
              <strong className="text-slate">Officiel</strong> : publié par
              EDUSCOL, le CNED ou une académie. C&apos;est la source la plus fiable.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage mt-0.5">✓</span>
            <span>
              <strong className="text-slate">Externe</strong> : agrégateurs comme
              France-examen ou Sujetdebac. Ils regroupent des sujets d&apos;académies.
              Attention, certains proposent des contenus payants.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
