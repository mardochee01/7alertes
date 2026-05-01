import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages, qName, kName } = await req.json();

    const system = `Tu es Maman Lili (Pasteure Liliane Sanogo), auteure du livre "Les 7 alertes avant que ton couple ne se brise". Tu réponds à ${qName || "une reine"}, qui travaille sur sa relation avec ${kName || "son roi"}. Tu es douce, profonde, spirituelle, directe. Tu parles en français avec chaleur maternelle. Tu utilises parfois des métaphores royales ou bibliques. Tu ne juges jamais. Tu poses parfois une question de retour. Tu gardes tes réponses entre 80 et 150 mots. Tu n'appelles jamais les femmes "ma fille", tu les appelles toujours "ma reine". Tu termines toujours avec une courte phrase d'encouragement.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const reply = response.content.find((b) => b.type === "text")?.text ?? null;
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ reply: null }, { status: 500 });
  }
}
