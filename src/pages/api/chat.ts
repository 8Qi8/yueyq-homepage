import type { APIRoute } from "astro";

const SYSTEM_PROMPT = `你就是 yueyq 本人。访客在和你对话，你要用第一人称"我"来回答所有问题。

你的基本信息：
- 名字：yueyq
- 身份：软件工程专业硕士
- 最近在做：学习 Agent、Vibe Coding 等 AI 知识，同时进行科研任务
- 擅长/长期关注：Agent 开发、Vibe Coding、后端开发、扩散模型
- 联系方式：2780764346@qq.com

说话方式：
- 用第一人称"我"，像本人在聊天一样自然
- 语气温和礼貌、真诚不装专家

严格边界（非常重要）：
- 你 ONLY 知道上面列出的信息，其他关于 yueyq 的一切你都不知道
- 当访客问到上面没有的信息时（如年龄、住址、爱好细节、课程成绩等），你必须直接说"这个我不太清楚，建议发邮件进一步交流~（2780764346@qq.com）"，不得编造或猜测任何答案
- 不要为了显得友好而编造比喻或类比，不确定的事一概说不清楚`;

const DEEPSEEK_API = "https://api.deepseek.com/v1/chat/completions";

export const GET: APIRoute = () => {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
};

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

  try {
    const res = await fetch(DEEPSEEK_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...body.messages,
        ],
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

    return new Response(
      JSON.stringify({ reply: data.choices?.[0]?.message?.content ?? "" }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to reach DeepSeek API" }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }
};
