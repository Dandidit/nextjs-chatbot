// app/api/chat/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();
    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const endpoint = process.env.OLLAMA_ENDPOINT ?? "http://localhost:11434";

    const ollamaResponse = await fetch(`${endpoint}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL ?? "phi3",
        messages: [{ role: "user", content: message }],
        stream: false,
      }),
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      return NextResponse.json(
        { error: `Ollama request failed: ${errorText}` },
        { status: 500 }
      );
    }

    const data = await ollamaResponse.json();
    const reply =
      data?.message?.content ??
      data?.choices?.[0]?.message?.content ??
      "";

    return NextResponse.json({
      role: "assistant",
      content: reply,
      raw: data,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
