import Link from "next/link";
import RevisionPath from "@/components/RevisionPath";

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Hero */}
      <header className="px-6 pt-10 pb-6 sm:px-10 sm:pt-16 sm:pb-10 text-center">
        <h1 className="font-display text-5xl sm:text-7xl text-slate tracking-tight animate-fade-in-up">
          Révisio
        </h1>
        <p className="mt-4 font-body text-lg sm:text-xl text-slate-light max-w-md mx-auto animate-fade-in-up [animation-delay:0.1s]">
          Ton coin révision pour le bac ST2S
        </p>
        <p className="mt-2 text-sm text-slate-light/70 max-w-sm mx-auto animate-fade-in-up [animation-delay:0.2s]">
          Programme officiel, exercices par chapitre, et zéro bullshit.
        </p>
      </header>

      {/* Main cards */}
      <main className="flex-1 px-6 pb-6 sm:px-10">
        <div className="max-w-5xl mx-auto mb-5">
          <Link
            href="/revision-express"
            className="group block rounded-3xl border-2 border-terracotta bg-terracotta p-6 text-center shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-white/80 mb-1">
              Bac dans 1 semaine
            </p>
            <h3 className="font-display text-2xl text-white mb-2">
              🚀 Révision express
            </h3>
            <p className="text-sm text-white/90 max-w-md mx-auto leading-relaxed">
              Session intensive personnalisée : on détecte tes lacunes et on
              enchaîne les exercices ciblés.
            </p>
            <span className="mt-3 inline-block text-sm font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
              C’est parti →
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          <HomeCard
            href="/programme"
            emoji="📋"
            title="Programme"
            description="Les 6 chapitres officiels du programme ST2S, avec compétences et notions clés."
            accent="border-terracotta/20 hover:border-terracotta"
          />
          <HomeCard
            href="/reviser"
            emoji="✏️"
            title="Réviser"
            description="40 exercices corrigés pas à pas, un par notion du programme."
            accent="border-sage/20 hover:border-sage"
          />
          <HomeCard
            href="/annales"
            emoji="📚"
            title="Annales"
            description="Liens vers les vrais sujets officiels (EDUSCOL, académies, CNED)."
            accent="border-warm-yellow/40 hover:border-warm-yellow-dark"
          />
          <HomeCard
            href="/ia"
            emoji="🤖"
            title="Assistant IA"
            description="Pose tes questions. L'IA répond uniquement avec les documents fournis."
            accent="border-indigo-300 hover:border-indigo-500"
          />
        </div>

        {/* Topics */}
        <section className="mt-12 max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-slate mb-5 text-center">
            Par où commencer ?
          </h2>
          <RevisionPath />
        </section>

        {/* Encouragement */}
        <div className="mt-12 text-center max-w-lg mx-auto rounded-3xl bg-card border-2 border-border p-8 shadow-sm">
          <p className="font-display text-xl text-slate mb-2">
            💡 Le saviez-vous ?
          </p>
          <p className="text-slate-light leading-relaxed">
            Réviser 20 minutes par jour est plus efficace que 3 heures d&apos;affilée.
            Prends ton temps, respire, et fais au mieux.
          </p>
        </div>
      </main>
    </div>
  );
}

function HomeCard({
  href,
  emoji,
  title,
  description,
  accent,
}: {
  href: string;
  emoji: string;
  title: string;
  description: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col items-start rounded-3xl border-2 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${accent}`}
    >
      <span className="text-3xl mb-4 transition-transform duration-300 group-hover:scale-110">
        {emoji}
      </span>
      <h3 className="font-display text-2xl text-slate group-hover:text-terracotta transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-light leading-relaxed">
        {description}
      </p>
      <span className="mt-auto pt-4 text-sm font-bold text-terracotta opacity-0 group-hover:opacity-100 transition-opacity">
        Commencer →
      </span>
    </Link>
  );
}
