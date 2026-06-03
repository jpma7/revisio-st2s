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

  const messages = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    { role: "user" as const, content: fullPrompt },
  ];

  const commonParams = {
    temperature: 0.0,
    max_tokens: 1200,
  };

  // ─── 1. OLLAMA (local uniquement) ────────────────────
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  const ollamaModel = process.env.OLLAMA_MODEL || "llama3.1:8b";

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
          source: `Ollama local (${ollamaModel}) + documents internes Révisio`,
          usedOllama: true,
        });
      }
    }
  } catch {
    // Ollama non disponible → passer au fallback
  }

  // ─── 2. OPENAI (ChatGPT) — excellent en maths ────────
  const openaiUrl = process.env.OPENAI_API_URL;
  const openaiKey = process.env.OPENAI_API_KEY;
  const openaiModel = process.env.OPENAI_API_MODEL || "gpt-4o";

  if (openaiUrl && openaiKey) {
    try {
      const res = await fetch(openaiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: openaiModel,
          messages,
          ...commonParams,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const answer =
          data.choices?.[0]?.message?.content?.trim() ||
          "Je ne sais pas avec les documents fournis.";

        return NextResponse.json({
          answer,
          source: `OpenAI (${openaiModel}) + documents internes Révisio`,
          usedOllama: false,
        });
      }
    } catch {
      // OpenAI indisponible → passer au fallback suivant
    }
  }

  // ─── 3. GROQ (cloud — GRATUIT, ultra-rapide) ────────
  const groqUrl = process.env.GROQ_API_URL;
  const groqKey = process.env.GROQ_API_KEY;
  const groqModel = process.env.GROQ_API_MODEL || "llama-3.3-70b-versatile";

  if (groqUrl && groqKey) {
    try {
      const res = await fetch(groqUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: groqModel,
          messages,
          ...commonParams,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const answer =
          data.choices?.[0]?.message?.content?.trim() ||
          "Je ne sais pas avec les documents fournis.";

        return NextResponse.json({
          answer,
          source: `Groq (${groqModel}) + documents internes Révisio`,
          usedOllama: false,
        });
      }
    } catch {
      // Groq indisponible → passer au fallback suivant
    }
  }

  // ─── 4. OPENROUTER (cloud — fallback ultime) ────────
  const openrouterUrl = process.env.OPENROUTER_API_URL;
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const openrouterModel =
    process.env.OPENROUTER_API_MODEL || "anthropic/claude-3.5-sonnet";

  if (openrouterUrl && openrouterKey) {
    try {
      const res = await fetch(openrouterUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openrouterKey}`,
          "HTTP-Referer": "https://revisio-st2s.netlify.app",
          "X-Title": "Révisio ST2S",
        },
        body: JSON.stringify({
          model: openrouterModel,
          messages,
          ...commonParams,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const answer =
          data.choices?.[0]?.message?.content?.trim() ||
          "Je ne sais pas avec les documents fournis.";

        return NextResponse.json({
          answer,
          source: `OpenRouter (${openrouterModel}) + documents internes Révisio`,
          usedOllama: false,
        });
      }
    } catch {
      // OpenRouter indisponible
    }
  }

  // ─── Aucun modèle disponible ───
  return NextResponse.json(
    {
      answer: "Je ne sais pas avec les documents fournis.",
      source:
        "Aucun modèle IA disponible. Vérifie qu'Ollama est lancé sur ton ordinateur, ou qu'une clé API est configurée.",
      usedOllama: false,
    },
    { status: 200 }
  );
}
