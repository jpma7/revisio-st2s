"use client";

import Link from "next/link";

const paths = [
  { label: "Suites", href: "/reviser?notion=Suites+numériques", color: "bg-violet-400", hover: "hover:bg-violet-500", domaine: "Analyse" },
  { label: "Fonctions", href: "/reviser?notion=Fonctions+de+la+variable+réelle", color: "bg-rose-400", hover: "hover:bg-rose-500", domaine: "Analyse" },
  { label: "Dérivation", href: "/reviser?notion=Dérivation", color: "bg-amber-400", hover: "hover:bg-amber-500", domaine: "Analyse" },
  { label: "Statistique", href: "/reviser?notion=Statistique", color: "bg-teal-400", hover: "hover:bg-teal-500", domaine: "Stats & Probas" },
  { label: "Probas conditionnelles", href: "/reviser?notion=Probabilités+conditionnelles", color: "bg-indigo-400", hover: "hover:bg-indigo-500", domaine: "Stats & Probas" },
  { label: "Bernoulli", href: "/reviser?notion=Épreuves+de+Bernoulli+et+variables+aléatoires", color: "bg-sky-400", hover: "hover:bg-sky-500", domaine: "Stats & Probas" },
];

export default function RevisionPath() {
  return (
    <nav className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {paths.map((p) => (
        <Link
          key={p.label}
          href={p.href}
          className={`group flex flex-col items-center justify-center rounded-3xl ${p.color} ${p.hover} px-4 py-8 text-center font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
        >
          <span className="text-xs uppercase tracking-wider opacity-70 mb-1 group-hover:opacity-100 transition-opacity">{p.domaine}</span>
          <span className="text-base">{p.label}</span>
        </Link>
      ))}
    </nav>
  );
}
