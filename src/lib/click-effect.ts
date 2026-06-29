const ICONS = ["♥", "✦", "◆", "●"];
const DURATION = 750;

function spawn(x: number, y: number): void {
  const icon = ICONS[Math.floor(Math.random() * ICONS.length)];

  const el = document.createElement("span");
  el.textContent = icon;
  el.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    pointer-events: none;
    z-index: 9999;
    font-size: 18px;
    line-height: 1;
    color: rgba(91,158,207,0.7);
    transform: translate(-50%, -50%) scale(0.3);
    opacity: 1;
    transition: transform ${DURATION}ms cubic-bezier(0.22, 0.61, 0.36, 1),
                opacity ${DURATION}ms ease-out;
  `;
  document.body.appendChild(el);

  // 触发动画
  requestAnimationFrame(() => {
    el.style.transform = "translate(-50%, -50%) translateY(-32px) scale(1)";
    el.style.opacity = "0";
  });

  // 动画结束后移除
  setTimeout(() => el.remove(), DURATION + 50);
}

export function initClickEffect(): void {
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("input") ||
      target.closest("a") ||
      target.closest("textarea") ||
      target.closest("select")
    ) {
      return;
    }
    spawn(e.clientX, e.clientY);
  });
}
