import { getResponse } from "./responses";

/** HTML 转义 */
function escapeHTML(str: string): string {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/** 创建消息 DOM 元素 */
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

/** 初始化聊天功能 */
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

  /** 发送一条消息 */
  function send(text?: string): void {
    const msg = (text ?? input!.value).trim();
    if (!msg || busy) return;

    busy = true;
    sendBtn!.disabled = true;
    input!.disabled = true;

    // 用户消息
    container!.appendChild(createMessage(msg, "user"));
    scrollDown();

    if (!text) input!.value = "";

    // 正在输入动画
    const typing = createTypingBubble();
    container!.appendChild(typing);
    scrollDown();

    // 模拟延迟后回复
    setTimeout(() => {
      document.getElementById("typing-indicator")?.remove();

      const reply = getResponse(msg);
      container!.appendChild(createMessage(reply, "ai"));
      scrollDown();

      busy = false;
      sendBtn!.disabled = false;
      input!.disabled = false;
      input!.focus();
    }, 500 + Math.random() * 700);
  }

  sendBtn.addEventListener("click", () => send());

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  // 预设问题
  presets.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (busy) return;
      const q = btn.dataset.question;
      if (q) {
        input.value = q;
        send(q);
      }
    });
  });

  scrollDown();
}
