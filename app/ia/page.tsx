import AiTutor from "@/components/AiTutor";

export const metadata = {
  title: "Assistant IA – Révisio",
  description: "Pose des questions de maths à l'assistant IA sourcé",
};

export default function IaPage() {
  return (
    <div className="min-h-full px-6 py-8 sm:px-10">
      <div className="text-center sm:text-left mb-6">
        <h1 className="font-display text-3xl sm:text-4xl text-slate">
          Assistant IA
        </h1>
        <p className="mt-2 text-slate-light max-w-lg">
          Pose une question de maths. L&apos;IA te répond uniquement à partir des
          documents fournis.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <AiTutor />
      </div>

      <div className="mt-8 max-w-3xl mx-auto rounded-3xl border-2 border-sage bg-sage/5 p-6">
        <p className="font-display text-lg text-sage-dark mb-3">
          🛡️ Règles de sécurité
        </p>
        <ul className="space-y-2 text-sm text-slate-light">
          <li className="flex items-start gap-2">
            <span className="text-sage mt-0.5">1.</span>
            <span>
              L&apos;IA ne répond que si la réponse est dans les documents fournis.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage mt-0.5">2.</span>
            <span>
              Sinon, elle affiche exactement : « Je ne sais pas avec les
              documents fournis. »
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage mt-0.5">3.</span>
            <span>Aucune approximation, aucune hallucination.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage mt-0.5">4.</span>
            <span>La source utilisée est toujours affichée.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
