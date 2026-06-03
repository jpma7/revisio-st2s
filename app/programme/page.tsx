import Link from "next/link";
import programmeData from "@/data/programme.json";

export default function ProgrammePage() {
  const { programme } = programmeData;

  return (
    <div className="flex flex-col min-h-full px-6 pt-8 pb-12 sm:px-10 max-w-4xl mx-auto">
      <header className="mb-10 text-center">
        <span className="inline-block rounded-full bg-terracotta/10 px-4 py-1 text-xs font-bold text-terracotta mb-3">
          Programme officiel
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-slate tracking-tight">
          {programme.titre}
        </h1>
        <p className="mt-3 text-sm text-slate-light max-w-xl mx-auto leading-relaxed">
          {programme.source}
        </p>
      </header>

      <div className="flex flex-col gap-10">
        {programme.domaines.map((domaine) => (
          <section key={domaine.titre} className="rounded-3xl border-2 border-border bg-card p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-8 w-1 rounded-full bg-terracotta"></span>
              <h2 className="font-display text-2xl sm:text-3xl text-slate">
                {domaine.titre}
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              {domaine.chapitres.map((chapitre) => (
                <div
                  key={chapitre.id}
                  className="rounded-2xl border-2 border-border/60 bg-cream/50 p-5 sm:p-6 transition hover:border-terracotta/30"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h3 className="font-display text-xl text-slate">
                      {chapitre.titre}
                    </h3>
                    <Link
                      href={`/reviser?notion=${encodeURIComponent(
                        chapitre.titre.replace("Chapitre 1 – ", "").replace("Chapitre 2 – ", "").replace("Chapitre 3 – ", "")
                      )}`}
                      className="inline-flex items-center rounded-xl bg-terracotta px-4 py-2 text-sm font-bold text-white transition hover:bg-terracotta-dark shadow-sm"
                    >
                      S’entraîner →
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-light mb-2">
                        Compétences
                      </h4>
                      <ul className="space-y-1.5">
                        {chapitre.competences.map((c, i) => (
                          <li key={i} className="flex gap-2 text-sm text-slate leading-relaxed">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-terracotta flex-shrink-0" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-light mb-2">
                        Notions clés
                      </h4>
                      <ul className="space-y-1.5">
                        {chapitre.notions_cles.map((n, i) => (
                          <li key={i} className="flex gap-2 text-sm text-slate leading-relaxed">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sage flex-shrink-0" />
                            <span>{n}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-warm-yellow/10 border border-warm-yellow/30 p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-warm-yellow-dark mb-2">
                      Exemples ST2S
                    </h4>
                    <ul className="space-y-1">
                      {chapitre.exemples_st2s.map((e, i) => (
                        <li key={i} className="text-sm text-slate-light">
                          • {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/reviser"
          className="inline-flex items-center rounded-2xl bg-terracotta px-8 py-4 text-lg font-bold text-white transition hover:bg-terracotta-dark shadow-sm hover:shadow-md"
        >
          Commencer la révision →
        </Link>
      </div>
    </div>
  );
}
