import RevisionExpressClient from "./RevisionExpressClient";

export const metadata = {
  title: "Révision express – Révisio",
  description:
    "Session de révision intensive personnalisée pour le bac ST2S. Détecte tes faiblesses et enchaîne les exercices ciblés.",
};

export default function RevisionExpressPage() {
  return (
    <div className="min-h-full px-6 py-8 sm:px-10">
      <RevisionExpressClient />
    </div>
  );
}
