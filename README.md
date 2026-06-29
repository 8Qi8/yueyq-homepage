# 🚀 yueyq-homepage

> 一个用 Vibe Coding 方式构建的个人主页项目：
> 从零开始，和 AI 一起打造一个带「数字分身」对话能力的个人网站。

---

## 🌐 可访问链接

* 个人主页：https://yueyq-homepage.vercel.app
* GitHub 仓库：https://github.com/8Qi8/yueyq-homepage

---

## 📌 项目简介

`yueyq-homepage` 是我的个人主页项目，用来展示个人信息、技术兴趣、项目经历和学习实践。

和普通个人主页不同的是，这个项目接入了大模型 API，实现了一个可以与访客对话的「数字分身」🤖。访客可以通过页面中的聊天窗口，询问关于我的研究方向、技术兴趣、项目经历等内容。

项目整体采用：

```txt
Astro + TypeScript + Tailwind CSS + MDX + DeepSeek API + Vercel
```

主要功能包括：

* 👤 个人信息展示
* 🧭 成长时间线
* 📂 作品展示抽屉
* 🤖 数字分身聊天
* ✨ 动态粒子背景
* 🖱️ 页面点击特效
* 📱 移动端适配
* 🌐 Vercel 部署上线

这个项目不仅是一个个人主页，也是我对 **Vibe Coding** 的一次完整实践。

---

## 🧠 Vibe Coding 过程

这个项目最开始只是一个简单的 HTML + CSS + JavaScript 原型，目标是先把页面跑起来。

第一版完成后，我发现纯三件套虽然简单，但后续维护成本较高：没有类型检查、样式分散、组件复用困难，也不方便继续接入 AI 对话能力。

于是我在 AI 的辅助下，逐步把项目重构成了一个更工程化的 Astro 项目。

整个开发过程大致可以分为几个阶段：

### 1. 技术选型 🧱

在对比了纯 HTML、Vue、Next.js 和 Astro 之后，最终选择了：

```txt
Astro + TypeScript + Tailwind CSS + MDX
```

选择 Astro 的原因是：个人主页大部分内容是静态展示，只有聊天窗口、作品抽屉、点击特效等局部需要交互。Astro 的 Islands 架构非常适合这种“静态页面 + 局部交互”的场景。

TypeScript 用来增强类型安全，Tailwind CSS 用来快速迭代样式，MDX 则为后续扩展博客和内容页面提供便利。

---

### 2. 页面结构拆分 🗂️

在 AI 的辅助下，我将页面拆分成多个组件：

```txt
ProfileHeader     个人头像和简介
InfoCard          个人信息与兴趣标签
Timeline          成长时间线
PortfolioDrawer   作品展示抽屉
ChatSection       数字分身聊天窗口
Footer            页脚信息
```

这种组件化拆分让后续修改更清晰，也更适合和 AI 协作。

相比直接说“帮我改页面”，更有效的方式是明确告诉 AI：

```txt
只修改 ChatSection，把聊天窗口改成右下角浮窗。
```

这样 AI 的输出会更稳定，也更容易控制改动范围。

---

### 3. 设计迭代 🎨

页面设计经历了多轮调整。

最开始的版本有比较明显的“模板感”，比如大量 emoji 标题、多个白色卡片平铺、聊天窗口像客服插件等。

后续我和 AI 反复迭代，逐步做了这些优化：

* 去掉过多装饰元素
* 使用更简洁的 section label
* 减少卡片堆叠感
* 调整背景色和文字层级
* 增加粒子网络背景
* 增加轻量点击特效
* 优化时间线和作品抽屉交互

这个过程让我体会到：Vibe Coding 并不是让 AI 一次性生成完美页面，而是通过“描述想法 → 生成代码 → 查看效果 → 继续调整”的循环，不断逼近想要的结果。

---

### 4. 数字分身实现 🤖

项目最有意思的部分是「数字分身」。

一开始我只是用关键词匹配实现简单回复，但这种方式很快暴露出问题：回答生硬、扩展困难、无法理解不同问法。

后来我接入了 DeepSeek API，让数字分身具备真正的对话能力。

为了保证 API Key 安全，项目采用服务端代理方式：

```txt
浏览器
  ↓
POST /api/chat
  ↓
Astro API Route
  ↓
DeepSeek API
  ↓
返回模型回复
```

API Key 只保存在服务端环境变量中，不会暴露到浏览器端。

同时，我为数字分身设计了系统提示词，让它用第一人称回答，并严格限制回答边界：不知道的信息不编造，而是引导访客进一步联系。

---

### 5. 部署上线 🌐

项目最终部署在 Vercel 上。

因为接入了 `/api/chat` 服务端接口，项目从纯静态站切换到了 Astro SSR 模式，并使用 `@astrojs/vercel` 适配器进行部署。

环境变量在 Vercel 后台配置：

```txt
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

修改环境变量后，需要重新部署项目才能生效。

---

## ⚠️ 注意事项

### 1. 不要暴露 API Key 🔐

真实 API Key 不能写进前端代码，也不能提交到 GitHub。

不要这样写：

```ts
const apiKey = "sk-xxxx";
```

也不要使用会暴露到浏览器端的变量名，例如：

```txt
PUBLIC_DEEPSEEK_API_KEY
```

推荐使用：

```txt
DEEPSEEK_API_KEY
```

并且只在服务端 API Route 中读取。

---

### 2. `.env` 必须加入 `.gitignore`

项目中应该忽略以下文件和目录：

```gitignore
.env
.env.*
!.env.example

dist/
.astro/
.vercel/
node_modules/
```

`.env.example` 只保留占位符：

```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

---

### 3. 如果 Key 泄露，先撤销再清理 🧯

如果收到 GitGuardian 或 GitHub 的密钥泄露提醒，不要先纠结是不是误报，应该先按泄露处理。

推荐顺序：

```txt
1. 立刻撤销旧 API Key
2. 新建 API Key
3. 更新 Vercel 环境变量
4. 检查 Git 历史和构建产物
5. 必要时重建干净仓库
```

清理 Git 历史是补救，撤销旧 Key 才是止血。

---

### 4. Vercel 部署需要正确配置适配器

如果项目使用了 Astro API Route 或 SSR，需要配置 Vercel Adapter：

```js
import vercel from "@astrojs/vercel";

export default defineConfig({
  output: "server",
  adapter: vercel(),
});
```

如果没有正确配置，可能会出现部署后页面或接口 404 的问题。

---

## 📝 小结

这个项目是我对 Vibe Coding 的一次完整实践。

它让我从一个简单原型出发，完整经历了：

* 技术选型
* 页面设计
* 组件拆分
* 动效实现
* 大模型 API 接入
* SSR 部署
* API Key 安全处理

对我来说，这个项目不只是一个个人主页，更像是一次关于 AI 辅助开发方式的实验。

Vibe Coding 最有价值的地方不是“让 AI 替你完成一切”，而是让人把更多精力放在判断、设计和决策上，把重复性实现交给 AI 加速完成。

看十篇教程，不如亲手做一个项目。✨
