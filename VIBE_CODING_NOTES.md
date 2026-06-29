# Vibe Coding 实战笔记：一个人 + AI，从零打造会聊天的个人主页

> 一个软件工程硕士生的 Vibe Coding 实践记录——从确定技术选型、设计迭代、功能打磨，到最终部署上线的完整过程。

---

## 起因

我一直在学习 AI Agent 和 Vibe Coding，但学的过程中总有一个念头：光看不练是假的。于是我决定给自己做一个人主页，把学到的东西用起来，顺便展示自己的经历和兴趣。

核心需求很明确：

1. 一个简洁的个人信息展示区，让别人了解我是谁、在做什么
2. 一个能对话的「数字分身」，访客可以问关于我的问题
3. 整体风格简约清爽，带一点点科技感，适配手机

更重要的是——整个开发过程**全程使用 AI 辅助**，从技术选型、页面设计到代码编写和部署，每一步都体现 Vibe Coding 的理念。这篇文章就是这次实践的完整复盘。

---

## 技术选型：为什么是 Astro + TypeScript + Tailwind CSS + MDX

最开始我用的是纯 HTML + CSS + JS 三件套，主打一个「能跑就行」。但很快发现几个问题：

- 没有类型检查，重构时容易出错
- CSS 写散了，换个颜色要全局搜索替换
- 没有组件化，聊天区、信息卡、头像区全挤在一个文件里

于是决定重构成工程化的技术栈。选型的逻辑是这样的：

**Astro** — 静态站点生成器，默认输出零 JS，加载极快。核心卖点是 Island Architecture：页面大部分是纯 HTML，只有需要交互的部分才加载 JS。个人主页 90% 的内容是静态的（介绍、时间线），只有聊天区需要客户端 JS，这个模型完美匹配。

**TypeScript** — 类型安全，尤其是聊天逻辑和 API 交互，有类型约束能提前发现很多 bug。

**Tailwind CSS** — 原子化 CSS，直接在 HTML/JSX 里写样式，不需要在文件之间跳来跳去。搭配设计令牌（Design Tokens），改一个颜色全局生效。

**MDX** — Markdown + JSX，用来写自我介绍等长内容，比纯 HTML 更易维护。

> 选型心得：技术栈不是越新越好，而是看它能不能解决你的实际问题。Astro 的 Islands 模型恰好能覆盖「静态展示 + 局部交互」这种个人主页场景，Tailwind 的 utility class 让你不用纠结类名，TypeScript 在你代码超过 500 行时就开始体现价值。

---

## 架构设计：把页面拆成几块

确定技术栈之后，第一件事不是写代码，而是把页面结构想清楚。我画了一个简单的层次图：

```
┌──────────────────────────────┐
│         BaseLayout           │  ← HTML 骨架、meta、背景粒子
│  ┌────────────────────────┐  │
│  │    ProfileHeader        │  │  ← 头像、名字、一句话介绍
│  │    InfoCard             │  │  ← 个人简介、方向标签、联系方式
│  │    Timeline             │  │  ← 成长时间线（左右交替）
│  │    Footer               │  │  ← 版权信息
│  └────────────────────────┘  │
│  ┌─ 浮动层 ────────────────┐  │
│  │  PortfolioDrawer (左侧)  │  │  ← 作品展示抽屉
│  │  ChatSection (右下角)    │  │  ← 数字分身对话浮窗
│  └─────────────────────────┘  │
└──────────────────────────────┘
```

这个架构有几个设计决策：

**1. 页面流 vs 浮层分离**

信息卡片、时间线走正常文档流，保证阅读体验干净。聊天和作品展示用 `position: fixed` 浮在右下角和左侧，不打断浏览——想聊就聊，不需要时它安静待在角落。

**2. 组件职责单一**

每个 Astro 组件只做一件事：

| 组件 | 职责 |
|------|------|
| `ProfileHeader.astro` | 头像 + 名字 + 简介，无卡片包裹，透气排版 |
| `InfoCard.astro` | Focus / Interests / Contact，用细线分隔 |
| `Timeline.astro` | 5 个成长阶段，桌面端左右交替，移动端左线单列 |
| `ChatSection.astro` | 浮动按钮 + 聊天面板 + 客户端脚本 |
| `PortfolioDrawer.astro` | 左侧竖式按钮 + 滑入抽屉 |
| `Footer.astro` | 动态年份 + Slogan |

这就是 Vibe Coding 的核心理念之一——你负责架构决策和逻辑，AI 负责把每一块填好。

---

## 设计迭代：从「能用」到「好看」

设计是我花了最多时间打磨的部分。整个过程经历了三轮迭代。

### 第一轮：原型阶段

用最简单的 HTML + CSS 搭出骨架，头像用渐变色块代替、聊天区用关键词匹配随便回复几句。这一阶段的目标是 **验证功能可行性**——聊天能发吗？手机能看吗？信息展示全吗？

### 第二轮：去模板化

第一版有一个比较大的问题：看起来太像模板站了。

具体表现：
- 每个信息区都有 `📌` `🚀` `💡` 这样的 emoji 作为标题前缀
- 四个白色卡片从上往下平铺，没有层次
- 聊天区头部有绿色的「在线」状态标签，像客服 widget

改进措施：
- 把 emoji 标签换成小写英文字母的 section label（`Focus` / `Interests` / `Contact`），字号 12px，`uppercase`，颜色 `text-brand-text-secondary`
- 只有聊天区保留卡片样式，个人信息区去卡片化，用细线分隔，视觉上更透气
- 聊天头部改成一行：纯色圆点 +「数字分身」+ 右侧「问我任何问题」

### 第三轮：层次感和动态元素

「能用」和「好看」之间的差距，往往就是那些看似不起眼的细节：

**配色调整**。最初背景 `#f6f9fc`（几乎白色）和卡片 `#ffffff` 几乎没区别。加深背景到 `#e9eff5`，卡片立刻浮起来。分隔线从 `border-brand-border/60` 的半透明改为实色 `#c2cdd7`，边界清晰可见。文字色阶也统一加深了一档，`text-muted` 从 `#a0b8c6` 调到 `#8496a6`，12px 的小字也不费眼。

**动态背景**。单纯的白底蓝纹太安静了，我在背景加了一个粒子网络动画——30 个半透明圆点在画布上缓慢移动，距离近的点之间会连成细线。

实现方式是独立的 Canvas 层，放在 BaseLayout 的 `<body>` 底部：

```typescript
// src/lib/background.ts 核心结构
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number; opacity: number;
}

const COUNT = 30;
const MAX_DIST = 130;

function draw(): void {
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy;
    // 边界反弹 + 微扰 + 限速
    // ...
    // 近距离连线
    for (let j = i + 1; j < particles.length; j++) {
      const dist = Math.hypot(p.x - q.x, p.y - q.y);
      if (dist < MAX_DIST) {
        const alpha = (1 - dist / MAX_DIST) * 0.16;
        ctx.strokeStyle = `rgba(91,158,207,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
    // 画点
    ctx.fillStyle = `rgba(91,158,207,${p.opacity})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(draw);
}
```

关键细节：Canvas 设为 `pointer-events: none`、`z-index: 0`，完全不阻挡点击和滚动。粒子颜色用品牌蓝，透明度控制在 0.10–0.28，连线最亮仅 16%，若隐若现但不抢戏。

**点击特效**。在空白区域点击时，鼠标位置会出现一个小图案（♥ / ✦ / ◆ / ● 随机），向上升起并渐隐，750ms 完成。在按钮、输入框上不触发，避免干扰操作。

```typescript
// src/lib/click-effect.ts 核心逻辑
const ICONS = ["♥", "✦", "◆", "●"];

function spawn(x: number, y: number): void {
  const icon = ICONS[Math.floor(Math.random() * ICONS.length)];
  const el = document.createElement("span");
  el.textContent = icon;
  el.style.cssText = `
    position: fixed; left: ${x}px; top: ${y}px;
    pointer-events: none; z-index: 9999;
    font-size: 18px;
    color: rgba(91,158,207,0.7);
    transform: translate(-50%, -50%) scale(0.3);
    transition: transform 750ms cubic-bezier(0.22, 0.61, 0.36, 1),
                opacity 750ms ease-out;
  `;
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.transform = "translate(-50%, -50%) translateY(-32px) scale(1)";
    el.style.opacity = "0";
  });
  setTimeout(() => el.remove(), 800);
}
```

**作品展示抽屉**。左侧中间放一个竖式按钮（`writing-mode: vertical-rl`），点击后从左侧滑入一个 420px 宽的抽屉面板，展示 6 个方向的产出。关闭方式支持按钮、遮罩、ESC 键。

**成长时间线**。5 个阶段不用简单的纵向列表，而是桌面端左右交替排列——奇数项在左、偶数项在右，中间一条竖线贯穿，节点用圆点标记当前阶段。这种排版让「流水账」变得有节奏感。

```astro
<!-- Timeline.astro 交替逻辑 -->
<div class="timeline relative">
  <div class="timeline-line absolute ... bg-[#b4c2cf]
              md:left-1/2 md:-translate-x-px"></div>
  {items.map((item, i) => {
    const isLeft = i % 2 === 0;
    return (
      <div class={`flex gap-5 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>
        <!-- 圆点 -->
        <div class={`absolute ... md:left-1/2 md:-translate-x-1/2
                     ${item.active ? "bg-brand-primary shadow-[...]" : "bg-[#b4c2cf]"}`}>
        </div>
        <div class="hidden md:block md:flex-1" />
        <!-- 内容卡片 -->
        <div class="flex-1 ...">...</div>
      </div>
    );
  })}
</div>
```

每轮迭代都是「描述想要的 → AI 生成 → 看效果 → 描述不满意的 → AI 修改」这个循环，这其实就是 Vibe Coding 的标准工作流。关键在于你能多精准地描述自己的设计意图。

---

## 数字分身：从关键词匹配到真实 AI

这是整个页面最有意思的功能，也是技术含量最高的部分。

### 1.0：关键词匹配

最早版本用一个长 `if-else` 链做关键词匹配：

```typescript
// 旧版 - 不可扩展
if (input.includes("细节")) return "因为我始终相信细节决定成败...";
if (input.includes("耐心")) return "耐心其实来自于热爱...";
// 12 个 if 块……
```

但 Vibe Coding 的理念不是让 AI 帮你写 if-else——而是让 AI 本身成为答案的来源。于是我决定接入大模型。

### 2.0：DeepSeek API 集成

接入 DeepSeek API 主要考虑了三个问题：

**安全** — API Key 绝不能出现在浏览器端。解决方案是用 Astro 的 SSR 模式，在服务端创建一个 API 端点作为代理：

```
浏览器 → POST /api/chat → 服务端 → DeepSeek API → 返回结果
```

API Key 存在 `.env` 文件中（已加入 `.gitignore`），服务端通过 `import.meta.env.DEEPSEEK_API_KEY` 读取，前端完全不可见。

**身份** — 这不是一个通用聊天机器人，而是我的数字分身。系统提示词的设计至关重要：

```typescript
const SYSTEM_PROMPT = `你就是 yueyq 本人。访客在和你对话，你要用第一人称"我"来回答所有问题。
// ...
严格边界（非常重要）：
- 你 ONLY 知道上面列出的信息，其他关于 yueyq 的一切你都不知道
- 当访客问到上面没有的信息时，你必须直接说"这个我不太清楚，建议发邮件进一步交流~"
- 不要为了显得友好而编造比喻或类比，不确定的事一概说不清楚`;
```

这里踩过一个坑：最初的提示词写的是「你是我的数字分身」，模型理解为它是一个描述「yueyq」的第三方，于是用第三人称回答。改成「你就是 yueyq 本人，用第一人称"我"」之后才纠正过来。

还有一个坑：没有明确知识边界时，模型会「友好地」编造信息——比如问它「你多大了」，它会即兴发挥说「我像你们人类二十多岁刚步入社会的状态」。加了「不确定的事一概说不清楚」+「不要为了显得友好而编造比喻」之后，AI 终于学会诚实地说「这个我不太清楚」。

**服务端 API 端点**：

```typescript
// src/pages/api/chat.ts
export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.DEEPSEEK_API_KEY;
  const body = await request.json();

  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
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
  return new Response(
    JSON.stringify({ reply: data.choices[0].message.content }),
    { headers: { "Content-Type": "application/json" } },
  );
};
```

客户端带上最近 10 轮对话历史，让模型有上下文连贯性：

```typescript
// src/lib/chat.ts
const history: ChatMessage[] = [];

async function fetchReply(userMessage: string): Promise<string> {
  const messages = [
    ...history.slice(-10),
    { role: "user", content: userMessage },
  ];
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json();
  return data.reply;
}
```

---

## 部署与踩坑

### 部署到 Vercel

Astro 默认是静态输出（SSG），但因为有了 `/api/chat` 这个服务端端点，需要切换为 SSR 模式。最开始用了 `@astrojs/node` 适配器，推上去之后发现 Vercel 报 404——原因是 Vercel 需要自己的适配器 `@astrojs/vercel`，它会将 SSR 路由打包成 Serverless Function。

配置改动：

```js
// astro.config.mjs
import vercel from "@astrojs/vercel";

export default defineConfig({
  integrations: [tailwind(), mdx()],
  output: "server",
  adapter: vercel(),
});
```

环境变量在 Vercel 后台设置 `DEEPSEEK_API_KEY`，不与代码一起提交。

### API Key 泄露事件

这是整个项目中最惊险的一课。

早期提交时，`.vercel/output/` 构建产物目录没有被 gitignore 排除。构建产物中，`.env` 里的 API Key 被 Vercel 适配器编译进了 JS 文件。结果就是——API Key 被明文提交到了 GitHub 仓库。

发现后做了三步补救：

1. **撤销旧 Key**：立刻在 DeepSeek 控制台删除泄露的 Key
2. **清理 Git 历史**：用 `git filter-branch` 从所有提交中删除 `.vercel/` 目录
3. **强制推送** + 清理远程引用

```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch -r .vercel" \
  --prune-empty -- --all

git update-ref -d refs/original/refs/heads/main
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force --all
```

**教训**：
- `.env` 一定要在项目最早期的 commit 之前就加入 `.gitignore`
- 构建产物目录（`.vercel/`、`dist/`、`.astro/`）也必须在 `.gitignore` 里
- 一旦发现泄漏，撤销 Key 比清理历史更紧急——你永远不知道有没有 bot 正在扫描 GitHub 上的 API Key

---

## Vibe Coding 复盘：AI 到底帮我做了什么

回顾整个过程，AI 的参与程度大约是这样的：

**AI 主导、我审核的环节：**
- CSS 样式编写（几百行 utility class，AI 一次生成）
- 响应式断点的具体数值调整
- 粒子动画、点击特效等 JavaScript 动画代码
- 重复性工作（比如把所有硬编码色值替换为设计令牌）

**我主导、AI 辅助的环节：**
- 技术选型（AI 提供对比分析，我来拍板）
- 信息架构设计（AI 提了 3 种方案，我选了最优的）
- 系统提示词的设计（我写框架，AI 润色语气和边界条件）

**完全由我来做的环节：**
- 判断「什么设计看起来像模板站」——这是一种审美判断，AI 目前还做不到
- 「信息层次不够」——需要人眼的整体感知，AI 可以执行但无法独立判断
- 决定「这个功能值不值得做」——需要权衡投入产出比

### 几个关键认知

**1. 精准描述 > 反复试错**

当我只是说「改好看点」，AI 给的结果通常很泛。但当我精确描述「把 emoji 标签换成英文小写 uppercase 12px 标签，把卡片阴影从 0.08 降到 0.04」，AI 的输出直接可用。

Vibe Coding 不是「你随便说，AI 帮你猜」，而是「你清楚要什么，AI 帮你快速实现」。

**2. 小步迭代是最佳策略**

整个项目经历了 10+ 次 git commit，每次改动范围都不大：一个组件、一个样式文件、一个逻辑函数。小步提交的好处是——AI 出错了你可以立刻发现，不会出现改了一千行然后一堆报错的情况。

我的迭代节奏大概是：
- 描述一个明确的改动
- AI 生成代码
- `Ctrl+S` 看一眼效果
- 不满意 → 描述哪里不对 → AI 修改
- 满意 → `git commit`

每轮大概 2-5 分钟。

**3. 人类负责价值判断，AI 负责实现细节**

这是 Vibe Coding 最本质的分工。AI 写不出「有灵魂」的设计，但它可以完美执行你的设计指令。你能多精准地描述你要的「好看」，决定了 AI 产出的上限。

---

## 结语

从一个三文件的原型（HTML + CSS + JS），到一个工程化的 Astro + TypeScript + Tailwind 项目，再到接入真实 AI 对话能力、部署上线——整个过程大概花了一个下午加一个晚上。如果纯手写，可能要多花 2-3 倍的时间。

但 Vibe Coding 最大的价值不是「快」，而是**让你把注意力放在真正重要的决策上**：信息怎么组织、风格是什么感觉、AI 的人设该怎么说——这些需要人的判断力。而把 CSS 像素值、动画贝塞尔曲线、API 路由对接这些机械工作交给 AI。

如果你也在学习 AI Agent 和 Vibe Coding，建议真的动手做一个项目——哪怕就是一个个人主页。学十篇教程不如亲手踩一次坑。

---

> 📬 这是我的个人主页：[yueyq-homepage](https://github.com/8Qi8/yueyq-homepage)
>
> 欢迎交流：2780764346@qq.com
