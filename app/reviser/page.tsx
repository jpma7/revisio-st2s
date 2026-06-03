import { Suspense } from "react";
import ReviserClient from "./ReviserClient";

export const metadata = {
  title: "Réviser – Révisio",
  description: "Exercices de maths pour la 1ère ST2S",
};

export default function ReviserPage() {
  return (
    <div className="min-h-full px-6 py-8 sm:px-10">
      <div className="text-center sm:text-left">
        <h1 className="font-display text-3xl sm:text-4xl text-slate">
          Réviser
        </h1>
        <p className="mt-2 text-slate-light max-w-lg">
          Choisis un exercice, essaie de répondre, puis vérifie. Les indices sont
          là pour t’aider si tu bloques.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="mt-10 flex items-center justify-center">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-terracotta/40 animate-bounce-soft" />
              <span className="h-3 w-3 rounded-full bg-terracotta/40 animate-bounce-soft [animation-delay:0.2s]" />
              <span className="h-3 w-3 rounded-full bg-terracotta/40 animate-bounce-soft [animation-delay:0.4s]" />
            </div>
          </div>
        }
      >
        <ReviserClient />
      </Suspense>
    </div>
  );
}
