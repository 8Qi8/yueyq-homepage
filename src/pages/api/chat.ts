import type { APIRoute } from "astro";
import { SYSTEM_PROMPT } from "../../lib/system-prompt";

const DEEPSEEK_API = "https://api.deepseek.com/v1/chat/completions";

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "API key not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  let body: { messages?: { role: string; content: string }[] };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  if (!body.messages || !Array.isArray(body.messages)) {
    return new Response(
      JSON.stringify({ error: "messages array required" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...body.messages,
  ];

  try {
    const res = await fetch(DEEPSEEK_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages,
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: data.error?.message || "DeepSeek API error" }),
        { status: res.status, headers: { "Content-Type": "application/json" } },
      );
    }

    const reply = data.choices?.[0]?.message?.content ?? "";
    return new Response(
      JSON.stringify({ reply }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to reach DeepSeek API" }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }
};
