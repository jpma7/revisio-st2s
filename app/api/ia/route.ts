import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/systemPrompt";
import exercisesData from "@/data/exercises/programme-st2s.json";
import annalesData from "@/data/annales/sources.json";

export async function POST(req: NextRequest) {
  const { question } = (await req.json()) as { question?: string };

  if (!question || typeof question !== "string") {
    return NextResponse.json(
      { error: "La question est requise." },
      { status: 400 }
    );
  }

  // Construire le contexte à partir des documents fournis
  const exercisesContext = exercisesData.exercices
    .map(
      (ex) =>
        `[Exercice ${ex.id} - ${ex.notion}]\nQ: ${ex.question}\nCorrection: ${ex.correction}\nSource: ${ex.source}\n`
    )
    .join("\n---\n");

  const sourcesContext = annalesData.sources
    .map(
      (s) =>
        `[Source ${s.id}]\nTitre: ${s.titre}\nNiveau: ${s.niveau}\nSérie: ${s.serie}\nStatut: ${s.statut}\nDescription: ${s.description}\n`
    )
    .join("\n---\n");

  const contextBlock = `DOCUMENTS FOURNIS :\n\n=== EXERCICES ===\n${exercisesContext}\n\n=== ANNALES / SOURCES ===\n${sourcesContext}\n\n=== FIN DES DOCUMENTS ===`;

  const fullPrompt = `${contextBlock}\n\nQuestion de l'élève : ${question}\n\nRéponds uniquement à partir des documents ci-dessus. Si la réponse n'y est pas, affiche EXACTEMENT : "Je ne sais pas avec les documents fournis."`;

  // 1. Essayer Ollama en local
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  const ollamaModel = process.env.OLLAMA_MODEL || "qwen3:4b";

  try {
    const ollamaRes = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: ollamaModel,
        system: SYSTEM_PROMPT,
        prompt: fullPrompt,
        stream: false,
      }),
    });

    if (ollamaRes.ok) {
      const ollamaData = (await ollamaRes.json()) as {
        response?: string;
        done?: boolean;
      };
      const answer = ollamaData.response?.trim() || "";

      if (answer) {
        return NextResponse.json({
          answer,
          source: `Ollama (${ollamaModel}) + documents internes Révisio`,
          usedOllama: true,
        });
      }
    }
  } catch {
    // Ollama non disponible → fallback API externe
  }

  // 2. Fallback API externe (Mistral compatible)
  const externalUrl = process.env.EXTERNAL_API_URL;
  const externalKey = process.env.EXTERNAL_API_KEY;

  if (!externalUrl || !externalKey) {
    return NextResponse.json(
      {
        answer: "Je ne sais pas avec les documents fournis.",
        source: "Aucun modèle IA disponible (Ollama éteint et pas d'API externe configurée).",
        usedOllama: false,
      },
      { status: 200 }
    );
  }

  try {
    const apiRes = await fetch(externalUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${externalKey}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: fullPrompt },
        ],
        temperature: 0.1,
        max_tokens: 800,
      }),
    });

    if (!apiRes.ok) {
      return NextResponse.json(
        {
          answer: "Je ne sais pas avec les documents fournis.",
          source: `Erreur API externe (${apiRes.status})`,
          usedOllama: false,
        },
        { status: 200 }
      );
    }

    const apiData = (await apiRes.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const answer =
      apiData.choices?.[0]?.message?.content?.trim() ||
      "Je ne sais pas avec les documents fournis.";

    return NextResponse.json({
      answer,
      source: `API externe + documents internes Révisio`,
      usedOllama: false,
    });
  } catch {
    return NextResponse.json(
      {
        answer: "Je ne sais pas avec les documents fournis.",
        source: "Erreur de connexion à l'API externe.",
        usedOllama: false,
      },
      { status: 200 }
    );
  }
}
