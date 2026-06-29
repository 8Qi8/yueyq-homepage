interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** 保留最近 N 轮对话作为上下文 */
const history: ChatMessage[] = [];
const MAX_HISTORY = 10;

/** HTML 转义 */
function escapeHTML(str: string): string {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/** 创建消息 DOM */
function createMessage(
  content: string,
  role: "user" | "ai",
): HTMLDivElement {
  const div = document.createElement("div");
  div.className = `flex gap-2.5 ${
    role === "user" ? "flex-row-reverse" : ""
  }`;
  div.style.animation = "msg-in 0.35s ease-out";

  const avatarClass =
    role === "ai"
      ? "ai-gradient w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white select-none flex-shrink-0"
      : "avatar-gradient w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white select-none flex-shrink-0";

  const avatarText = role === "ai" ? "AI" : "Y";
  const bubbleClass = role === "ai" ? "bubble-ai" : "bubble-user";

  div.innerHTML = `
    <div class="${avatarClass}">${avatarText}</div>
    <div class="${bubbleClass}"><p>${escapeHTML(content)}</p></div>
  `;

  return div;
}

/** 创建「正在输入」指示器 */
function createTypingBubble(): HTMLDivElement {
  const div = document.createElement("div");
  div.className = "flex gap-2.5";
  div.id = "typing-indicator";
  div.innerHTML = `
    <div class="ai-gradient w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white select-none flex-shrink-0">AI</div>
    <div class="bubble-ai flex gap-1 py-1.5">
      <span class="w-1.5 h-1.5 rounded-full bg-[#a0c4d8]"
            style="animation:typing-bounce 1.2s ease-in-out infinite"></span>
      <span class="w-1.5 h-1.5 rounded-full bg-[#a0c4d8]"
            style="animation:typing-bounce 1.2s ease-in-out infinite; animation-delay:0.2s"></span>
      <span class="w-1.5 h-1.5 rounded-full bg-[#a0c4d8]"
            style="animation:typing-bounce 1.2s ease-in-out infinite; animation-delay:0.4s"></span>
    </div>
  `;
  return div;
}

/** 调用 DeepSeek API（通过 Astro 服务端代理） */
async function fetchReply(userMessage: string): Promise<string> {
  // 构建消息列表：只发送最近几轮 + 当前消息
  const messages = [
    ...history.slice(-MAX_HISTORY),
    { role: "user" as const, content: userMessage },
  ];

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "请求失败");
  }

  return data.reply;
}

/** 初始化聊天 */
export function initChat(): void {
  const container = document.getElementById("chatMessages");
  const input = document.getElementById("chatInput") as HTMLInputElement | null;
  const sendBtn = document.getElementById("sendBtn") as HTMLButtonElement | null;
  const presets = document.querySelectorAll<HTMLButtonElement>(".preset-chip");

  if (!container || !input || !sendBtn) return;

  let busy = false;

  const scrollDown = () => {
    container.scrollTop = container.scrollHeight;
  };

  async function send(text?: string): Promise<void> {
    const msg = (text ?? input!.value).trim();
    if (!msg || busy) return;

    busy = true;
    sendBtn!.disabled = true;
    input!.disabled = true;

    // 用户消息
    container!.appendChild(createMessage(msg, "user"));
    scrollDown();

    if (!text) input!.value = "";

    // 正在输入指示器
    const typing = createTypingBubble();
    container!.appendChild(typing);
    scrollDown();

    try {
      const reply = await fetchReply(msg);

      // 记录对话历史
      history.push({ role: "user", content: msg });
      history.push({ role: "assistant", content: reply });
      // 防止历史过长
      if (history.length > MAX_HISTORY * 2) {
        history.splice(0, 2);
      }

      // 移除 typing、显示回复
      document.getElementById("typing-indicator")?.remove();
      container!.appendChild(createMessage(reply, "ai"));
      scrollDown();
    } catch (err) {
      document.getElementById("typing-indicator")?.remove();
      const errorMsg =
        err instanceof Error ? err.message : "出了点问题，稍后再试";
      container!.appendChild(createMessage(`⚠️ ${errorMsg}`, "ai"));
      scrollDown();
    } finally {
      busy = false;
      sendBtn!.disabled = false;
      input!.disabled = false;
      input!.focus();
    }
  }

  sendBtn.addEventListener("click", () => send());

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  presets.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (busy) return;
      const q = btn.dataset.question;
      if (q) {
        send(q);
      }
    });
  });

  scrollDown();
}
