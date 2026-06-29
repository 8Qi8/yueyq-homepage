/** 一条对话规则：任意关键词命中即返回对应回答 */
interface Rule {
  keywords: string[];
  response: string;
}

const rules: Rule[] = [
  // 细节
  {
    keywords: ["细节", "认真", "完美"],
    response:
      "因为我始终相信，细节决定成败。在写代码和做研究的时候，一个小小的疏忽可能会导致完全不同的结果。我享受把每一个细节都打磨到位的过程，这让我对自己的成果更有信心。✨",
  },
  // 耐心
  {
    keywords: ["耐心", "不急", "坚持"],
    response:
      "耐心其实来自于热爱。当你在做自己真正感兴趣的事情时，时间会过得很快。而且我知道，很多有价值的东西都需要时间来沉淀。急不来的，一步步走稳就好。😊",
  },
  // 研究透彻
  {
    keywords: ["研究", "深入", "透", "刨根"],
    response:
      "我喜欢把事情弄清楚，而不是停留在表面。尤其在后端开发和扩散模型这些方向，只有理解底层原理，才能做出真正有价值的东西。浅尝辄止很难走远，深度思考才是成长的捷径。",
  },
  // Agent
  {
    keywords: ["agent", "智能体"],
    response:
      "AI Agent 是我目前最感兴趣的方向之一。我觉得 Agent 的核心在于让 AI 具备自主决策和执行的能力，这比单纯的对话式 AI 更有想象空间。最近在学习和实践相关的框架，收获很多！",
  },
  // 后端
  {
    keywords: ["后端", "编程", "代码"],
    response:
      "后端开发是我比较熟悉的领域，它让我理解了系统架构的重要性。一个好的后端设计不仅要有良好的性能，还要易于维护和扩展。现在我也在探索如何将 AI 能力更好地融入后端服务中。",
  },
  // 扩散模型
  {
    keywords: ["扩散模型", "diffusion", "生成模型"],
    response:
      "扩散模型是一个很有意思的方向。从 DDPM 到 Stable Diffusion，这个领域发展得非常快。我在学习和研究扩散模型的原理，希望能把相关技术应用到实际项目中。",
  },
  // Vibe Coding
  {
    keywords: ["vibe", "coding"],
    response:
      "Vibe Coding 是一种很有意思的编程理念，强调在写代码时保持一种流畅、直觉的状态。我觉得这和「心流」的概念很像——当你完全沉浸在其中时，产出质量往往是最高的。",
  },
  // 美食
  {
    keywords: ["美食", "吃", "好吃"],
    response:
      "哈哈，美食确实是我的一大爱好！在写代码累了的时候，探索一家新餐厅或者自己做点好吃的，是最好的放松方式。美食和编程一样，都需要用心去感受和创造。🍜",
  },
  // 音乐
  {
    keywords: ["音乐", "歌", "听"],
    response:
      "音乐是我日常生活中不可或缺的一部分。写代码的时候喜欢听一些轻音乐或者 Lo-fi，能帮我更好地集中注意力。不同的任务会搭配不同风格的音乐~🎵",
  },
  // 学习方法
  {
    keywords: ["学习", "方法", "建议", "怎么学"],
    response:
      "我的学习方法是：先理解整体框架，再深入关键细节，最后通过实践来巩固。对于 AI Agent 这个领域，多看论文、多动手做项目、多和同行交流，三者结合效果最好。",
  },
  // 自我介绍
  {
    keywords: ["你是谁", "介绍", "做什么", "什么专业"],
    response:
      "我是 yueyq 的数字分身。yueyq 是一名软件工程专业的硕士生，目前正在学习 AI Agent 和 Vibe Coding，同时也在做一些科研任务。他擅长 Agent 开发、后端开发和扩散模型方向。有什么想了解的尽管问~",
  },
  // 打招呼
  {
    keywords: ["你好", "嗨", "hi", "hello", "hey"],
    response:
      "你好呀！很高兴和你聊天。有什么想问的或者想聊的吗？关于 AI、编程、学习，或者随便聊聊都可以~😄",
  },
];

const fallbacks: string[] = [
  "这个问题挺有意思的！让我想想… 其实可以从多个角度来看。不过总的来说，保持好奇心和持续学习的态度是最重要的。你还有其他想了解的吗？",
  "嗯，这个我得好好想想。yueyq 平时确实会思考这类问题。不过比起直接给答案，他更倾向于和你一起探讨。你想深入了解哪个方面？",
  "好问题！虽然我不能完全代表 yueyq 回答这个，但据我所知，他对这类话题一直很有兴趣。要不换个角度聊聊？比如关于 AI Agent 或者技术学习方面的？",
];

/** Fisher-Yates 洗牌 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let shuffledFallbacks: string[] = [];
let fallbackIndex = 0;

/** 根据用户输入匹配最佳回答 */
export function getResponse(input: string): string {
  const text = input.toLowerCase().trim();

  for (const rule of rules) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      return rule.response;
    }
  }

  // 兜底回答轮流使用
  if (fallbackIndex >= shuffledFallbacks.length) {
    shuffledFallbacks = shuffle(fallbacks);
    fallbackIndex = 0;
  }
  return shuffledFallbacks[fallbackIndex++];
}
