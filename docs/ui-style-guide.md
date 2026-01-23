# 点子 Lab 视觉与交互规范（奇迹工坊主题 v2）

> **设计方向**：梦幻薄雾 + 玻璃拟态 + 手写体点缀 + 有机形态
> **技术栈**：Next.js 14 + Tailwind CSS + shadcn/ui (Radix)
> **参考设计**：`stitch_idea_lab_home_landing_page/idea_lab_home_landing_page_*`

---

## 1. 设计原则

### 1.1 核心记忆点

| 特征 | 描述 |
|------|------|
| 玻璃薄雾感 | 低不透明度 + backdrop-blur + 柔阴影 |
| 三色主题 | lavender 薰衣草 / mint 薄荷 / coral 珊瑚 |
| 有机形态 | blob-shape 不规则圆角，打破机械感 |
| 手写体点缀 | Ma Shan Zheng 用于标题装饰 |
| 宽松留白 | 大字标题 + 慷慨的 padding |

### 1.2 设计约束（来自 ui-skills）

- 使用 Tailwind CSS 默认值，除非项目已有自定义值
- 使用 `cn` 工具（clsx + tailwind-merge）处理类名逻辑
- 破坏性操作必须使用 `AlertDialog`
- 使用 `h-dvh` 而非 `h-screen`
- 动画仅使用 `transform` 和 `opacity`（compositor props）
- 交互反馈动画 ≤ 200ms
- 尊重 `prefers-reduced-motion`

---

## 2. Design Tokens

### 2.1 色彩系统

#### 主题色（三色系）

```
lavender (薰衣草紫) - 主色调，代表梦幻与创意
├── 50:  #f5f3ff   // 极浅背景
├── 100: #ede9fe   // 浅背景、光斑
├── 200: #ddd6fe   // 边框、装饰
├── 300: #c4b5fd   // 主按钮、强调
└── 400: #a78bfa   // 深色变体

mint (薄荷绿) - 辅助色，代表成长与成功
├── 50:  #f0fdf4   // 极浅背景
├── 100: #dcfce7   // 浅背景、光斑
├── 200: #bbf7d0   // 次按钮、标签
└── 300: #86efac   // 深色变体

coral (珊瑚粉) - 强调色，代表活力与行动
├── 50:  #fff1f2   // 极浅背景
├── 100: #ffe4e6   // 浅背景
├── 200: #fecdd3   // 边框
├── 400: #fb7185   // CTA 按钮、重点
└── 500: #f43f5e   // hover 状态
```

#### 功能色

| Token | 值 | 用途 |
|-------|-----|------|
| `background` | `#fdf8ff` | 页面背景（极淡紫白） |
| `text-primary` | `#334155` (slate-700) | 主要文字 |
| `text-secondary` | `#64748b` (slate-500) | 次要文字 |
| `text-muted` | `#94a3b8` (slate-400) | 辅助文字 |
| `surface-glass` | `rgba(255, 255, 255, 0.40)` | 玻璃面板背景 |
| `border-glass` | `rgba(255, 255, 255, 0.60)` | 玻璃面板边框 |

#### 语义色

| 语义 | 颜色 | 用途 |
|------|------|------|
| Success | mint-200 `#bbf7d0` | 成功状态、已完成 |
| Warning | amber-400 `#fbbf24` | 警告、孵化中 |
| Danger | coral-500 `#f43f5e` | 错误、删除 |
| Info | lavender-300 `#c4b5fd` | 信息、待审核 |

### 2.2 字体系统

#### 字体家族

```css
--font-sans: var(--font-quicksand), var(--font-zcool), system-ui, sans-serif;
--font-script: var(--font-ma-shan-zheng), cursive;
--font-display: var(--font-zcool), system-ui, sans-serif;
```

#### 字体加载（Self-host，避免阻塞链路）

```ts
// app/layout.tsx：文字字体使用 next/font/google（构建时拉取并 self-host）
import { Ma_Shan_Zheng, Quicksand, ZCOOL_KuaiLe } from "next/font/google";
```

```css
/* app/globals.css：图标字体使用本地 woff2（避免外链阻塞） */
@font-face {
  font-family: "Material Symbols Outlined";
  src: url("/fonts/material-symbols-outlined.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

#### 字号系统

| 等级 | Tailwind | 用途 |
|------|----------|------|
| Display | `text-6xl` ~ `text-8xl` | Hero 标题 |
| H1 | `text-4xl` ~ `text-5xl` | 页面标题 |
| H2 | `text-2xl` ~ `text-3xl` | 区块标题 |
| H3 | `text-xl` | 卡片标题 |
| Body | `text-base` ~ `text-lg` | 正文 |
| Small | `text-sm` | 辅助信息 |
| Caption | `text-xs` | 标签、时间戳 |

#### 排版规则

- 标题使用 `text-balance`
- 正文使用 `text-pretty`
- 数据使用 `tabular-nums`
- 密集 UI 使用 `truncate` 或 `line-clamp-*`
- **禁止**修改 `letter-spacing`（除非明确要求）

### 2.3 间距系统

#### 基础间距（4px 倍数）

| Token | 值 | 用途 |
|-------|-----|------|
| `space-1` | 4px | 紧凑间距 |
| `space-2` | 8px | 元素内间距 |
| `space-3` | 12px | 小组件间距 |
| `space-4` | 16px | 默认间距 |
| `space-6` | 24px | 区块内间距 |
| `space-8` | 32px | 卡片内间距 |
| `space-12` | 48px | 区块间距 |
| `space-16` | 64px | Section 间距 |
| `space-20` | 80px | 大 Section |
| `space-32` | 128px | Hero 区域 |

#### 容器宽度

| 容器 | Tailwind | 值 |
|------|----------|-----|
| 窄 | `max-w-2xl` | 672px |
| 中 | `max-w-4xl` | 896px |
| 标准 | `max-w-6xl` | 1152px |
| 宽 | `max-w-7xl` | 1280px |

### 2.4 圆角系统

| 等级 | 值 | 用途 |
|------|-----|------|
| sm | 8px | Badge、小标签 |
| DEFAULT | 12px | Input、小卡片 |
| lg | 16px | Button |
| xl | 24px | 中等卡片 |
| 2xl | 32px / 2rem | 大卡片 |
| 3xl | 40px / 2.5rem | 浮动卡片 |
| 4xl | 64px / 4rem | Footer |
| full | 9999px | 胶囊按钮、圆形 |
| blob | `60% 40% 30% 70% / 60% 30% 70% 40%` | 有机形态 |

### 2.5 阴影系统

```css
/* 轻阴影 - 普通元素 */
shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);

/* 玻璃面板阴影 */
shadow-glass: 0 20px 50px rgba(180, 160, 255, 0.15);

/* 按钮阴影 */
shadow-coral: 0 10px 25px rgba(251, 113, 133, 0.30);
shadow-lavender: 0 10px 25px rgba(196, 181, 253, 0.40);

/* 卡片悬浮阴影 */
shadow-hover: 0 20px 40px rgba(180, 160, 255, 0.20);
```

### 2.6 动画系统

#### 时长

| 场景 | 时长 | 缓动 |
|------|------|------|
| 快速交互 | 150ms | `ease-out` |
| 常规过渡 | 200ms | `ease-in-out` |
| 页面过渡 | 300ms | `ease-in-out` |
| 装饰动画 | 4000ms ~ 8000ms | `ease-in-out` |

#### 预设关键帧

```css
/* 悬浮动画 - 装饰元素 */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* 脉冲发光 - 背景光斑 */
@keyframes pulse-glow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}
```

#### Tailwind 配置

```ts
animation: {
  "float-slow": "float 6s ease-in-out infinite",
  "float-slower": "float 8s ease-in-out infinite",
  "pulse-slow": "pulse-glow 4s ease-in-out infinite",
}
```

#### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 3. 组件规范

### 3.1 按钮（Buttons）

#### Primary（Lavender）

```jsx
<button className="bg-lavender-300 text-white font-bold px-8 py-4 rounded-full shadow-[0_10px_25px_rgba(196,181,253,0.4)] hover:bg-lavender-400 hover:scale-105 hover:-rotate-2 transition-all">
  编织梦想
</button>
```

| 属性 | 值 |
|------|-----|
| 背景 | lavender-300 `#c4b5fd` |
| 文字 | white |
| 圆角 | full (pill) |
| 阴影 | shadow-lavender |
| Hover | `bg-lavender-400`, `scale-105`, `-rotate-2` |

#### Secondary（Glass）

```jsx
<button className="bg-white/80 text-slate-600 font-bold px-8 py-4 rounded-full border-2 border-dashed border-mint-200 hover:bg-white hover:border-mint-300 transition-all">
  探索奇迹工坊
</button>
```

| 属性 | 值 |
|------|-----|
| 背景 | white/80 |
| 边框 | 2px dashed mint-200 |
| 文字 | slate-600 |
| Hover | `bg-white`, `border-mint-300` |

#### Accent（Mint - 3D 效果）

```jsx
<button className="bg-mint-200 text-emerald-800 font-black px-10 py-5 rounded-3xl border-b-8 border-mint-300 hover:border-b-4 hover:translate-y-1 transition-all">
  播撒第一颗种子
</button>
```

| 属性 | 值 |
|------|-----|
| 背景 | mint-200 `#bbf7d0` |
| 文字 | emerald-800 |
| 边框 | `border-b-8 mint-300` |
| Hover | `border-b-4`, `translate-y-1` |

#### CTA（Coral）

```jsx
<button className="bg-coral-400 text-white font-bold px-7 py-3 rounded-full shadow-lg shadow-coral-400/20 hover:bg-coral-500 hover:scale-105 active:scale-95 transition-all">
  开启梦境
</button>
```

| 属性 | 值 |
|------|-----|
| 背景 | coral-400 `#fb7185` |
| 文字 | white |
| 阴影 | shadow-coral |
| Hover | `bg-coral-500`, `scale-105` |
| Active | `scale-95` |

### 3.2 卡片（Cards）

#### Floating Card（玻璃面板）

```css
.floating-card {
  background: rgba(255, 255, 255, 0.40);
  backdrop-filter: blur(24px);
  border: 2px solid rgba(255, 255, 255, 0.60);
  box-shadow: 0 20px 50px rgba(180, 160, 255, 0.15);
  border-radius: 2.5rem;
}
```

```jsx
<div className="floating-card p-12 relative overflow-hidden">
  {/* 装饰 blob */}
  <div className="absolute top-0 right-0 w-64 h-64 bg-coral-400/5 blob-shape -mr-20 -mt-20" />
  {/* 内容 */}
</div>
```

#### Glass Panel（轻量玻璃）

```jsx
<div className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(196,181,253,0.15)] rounded-[2.5rem] p-8">
  {/* 内容 */}
</div>
```

#### Feature Card（特性卡片）

```jsx
<div className="bg-lavender-50/80 p-10 rounded-[3rem] border-2 border-lavender-100 hover:-rotate-2 transition-transform">
  <span className="material-symbols-outlined text-5xl text-lavender-300 mb-6">bubble_chart</span>
  <h4 className="text-2xl font-bold mb-4">无限气泡</h4>
  <p className="text-slate-500 font-medium">每个点子都是一个漂浮的气泡...</p>
</div>
```

### 3.3 表单（Forms）

#### Input（Whimsical Style）

```jsx
<div className="relative">
  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-coral-400 transition-colors">
    mail
  </span>
  <input
    type="email"
    className="w-full bg-white/60 border-2 border-lavender-200 rounded-full px-6 py-4 pl-14 text-slate-700 placeholder-slate-400 focus:border-coral-400 focus:ring-0 focus:bg-white transition-all outline-none font-medium"
    placeholder="探险家邮箱"
  />
</div>
```

#### 表单规则

- Input 必须有 `label`（可视或 `aria-label`）
- 使用正确的 `type`（email, password, tel, url）
- 设置 `autocomplete` 属性
- 禁止阻止粘贴
- 错误信息内联显示

### 3.4 标签（Badges/Tags）

```jsx
{/* 状态标签 */}
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-amber-50 text-amber-500 border border-amber-100">
  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
  孵化中
</span>

{/* 成功标签 */}
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-mint-50 text-mint-600 border border-mint-100">
  <span className="material-symbols-outlined text-[14px]">check_circle</span>
  已实现
</span>
```

| 状态 | 背景 | 文字 | 边框 |
|------|------|------|------|
| Pending | amber-50 | amber-500 | amber-100 |
| Approved | lavender-50 | lavender-500 | lavender-100 |
| In Progress | coral-50 | coral-500 | coral-100 |
| Completed | mint-50 | mint-600 | mint-100 |

### 3.5 图标系统

#### 图标库

使用 **Material Symbols Outlined**（本地 woff2 + `@font-face`）

```jsx
<span className="material-symbols-outlined">auto_fix_high</span>
```

#### 尺寸规范

| 用途 | 类名 | 大小 |
|------|------|------|
| 行内 | `text-sm` | 14px |
| 默认 | `text-base` | 16px |
| 按钮 | `text-xl` | 20px |
| 卡片 | `text-2xl` | 24px |
| Feature | `text-5xl` | 48px |
| 装饰 | `text-8xl` ~ `text-[12rem]` | 128px+ |

#### 图标按钮

```jsx
<button
  className="w-12 h-12 rounded-full bg-lavender-50 flex items-center justify-center text-lavender-300 hover:bg-coral-50 hover:text-coral-400 transition-colors"
  aria-label="搜索"
>
  <span className="material-symbols-outlined">search</span>
</button>
```

---

## 4. 布局模式

### 4.1 背景装饰系统

#### 页面背景光斑

```jsx
<div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
  {/* Lavender blob - 左上 */}
  <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] blob-shape bg-lavender-100/50 blur-3xl opacity-60" />
  {/* Mint blob - 右下 */}
  <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[60%] blob-shape bg-mint-100/50 blur-3xl opacity-60" />
  {/* Coral blob - 右上 */}
  <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] blob-shape bg-coral-400/10 blur-3xl opacity-40" />
  {/* Sparkle dots */}
  <div className="sparkle-dot w-2 h-2 top-1/4 left-1/4" />
  <div className="sparkle-dot w-3 h-3 top-1/3 right-1/4" />
</div>
```

#### Sparkle Dot

```css
.sparkle-dot {
  position: absolute;
  border-radius: 9999px;
  background: white;
  opacity: 0.6;
  box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.8);
}
```

#### Blob Shape

```css
.blob-shape {
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
}
```

### 4.2 Header（顶部导航）

```jsx
<nav className="relative z-50 px-8 py-6">
  <div className="max-w-7xl mx-auto flex justify-between items-center">
    {/* Logo */}
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-lavender-200 blob-shape flex items-center justify-center text-coral-400 shadow-inner">
        <span className="material-symbols-outlined text-3xl">auto_fix_high</span>
      </div>
      <span className="font-script text-3xl text-slate-800">奇迹工坊</span>
    </div>

    {/* Nav Pills */}
    <div className="hidden md:flex items-center bg-white/50 backdrop-blur-md rounded-full px-8 py-3 gap-10 border border-white/50">
      <a href="#" className="font-medium hover:text-coral-400 transition-colors">幻象大厅</a>
      ...
    </div>

    {/* Actions */}
    <div className="flex items-center gap-4">
      <button className="text-slate-600 hover:text-coral-400 font-semibold px-4">潜入</button>
      <button className="bg-coral-400 text-white font-bold px-7 py-3 rounded-full hover:bg-coral-500 transition-all shadow-lg shadow-coral-400/20">
        开启梦境
      </button>
    </div>
  </div>
</nav>
```

### 4.3 Hero 区域

```jsx
<section className="max-w-7xl mx-auto px-6 pt-16 pb-32 text-center relative">
  {/* Badge */}
  <div className="inline-block mb-6 px-4 py-1.5 bg-mint-100 text-emerald-600 rounded-full text-sm font-bold border border-emerald-200">
    ✨ 欢迎来到造梦者的集散地
  </div>

  {/* Title */}
  <h1 className="text-6xl md:text-8xl font-black mb-8">
    <span className="script-title block mb-4">点亮你的</span>
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-lavender-300 via-coral-400 to-mint-200">
      奇思妙想
    </span>
  </h1>

  {/* Description */}
  <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-500 font-medium mb-12 leading-relaxed">
    在这里，每一个古怪的念头都能编织成现实。
  </p>

  {/* CTAs */}
  <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
    {/* Primary & Secondary buttons */}
  </div>

  {/* Decorative icons */}
  <div className="absolute -left-10 top-1/4 opacity-20 hidden lg:block">
    <span className="material-symbols-outlined text-[12rem] text-lavender-300">toys_fan</span>
  </div>
</section>
```

### 4.4 Organic Overlap（重叠布局）

```css
.organic-overlap {
  margin-top: -3rem;
  position: relative;
  z-index: 20;
}
```

### 4.5 Footer

```jsx
<footer className="relative z-10 pt-20 pb-16 px-6">
  <div className="max-w-7xl mx-auto">
    <div className="bg-lavender-50/50 backdrop-blur-sm rounded-[4rem] p-12 md:p-20 relative overflow-hidden border border-white/60 shadow-xl">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-mint-100/40 rounded-full blur-3xl -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-coral-100/30 rounded-full blur-3xl -ml-16 -mb-16" />

      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
        {/* Logo + tagline */}
        {/* Nav columns */}
      </div>

      {/* Copyright */}
      <div className="mt-20 pt-10 border-t border-lavender-200/60">
        ...
      </div>
    </div>
  </div>
</footer>
```

---

## 5. 全局 CSS 样式

### 5.1 globals.css 核心样式

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

:root {
  --background: #fdf8ff;
  --foreground: #334155;
  --surface: rgba(255, 255, 255, 0.40);
  --border: rgba(255, 255, 255, 0.60);
}

body {
  color: var(--foreground);
  background: var(--background);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom utility classes */
.dream-gradient {
  background: linear-gradient(135deg, #ede9fe 0%, #dcfce7 50%, #fee2e2 100%);
}

.blob-shape {
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
}

.floating-card {
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(24px);
  border: 2px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 20px 50px rgba(180, 160, 255, 0.15);
  border-radius: 2.5rem;
}

.organic-overlap {
  margin-top: -3rem;
  position: relative;
  z-index: 20;
}

.script-title {
  font-family: "Ma Shan Zheng", cursive;
  color: #fb7185;
  line-height: normal;
}

.sparkle-dot {
  position: absolute;
  border-radius: 9999px;
  background-color: white;
  opacity: 0.6;
  box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.8);
}

.glass-panel {
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px rgba(196, 181, 253, 0.15);
}
```

### 5.2 tailwind.config.ts 扩展

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
        },
        mint: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
        },
        coral: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          400: '#fb7185',
          500: '#f43f5e',
        },
      },
      fontFamily: {
        sans: ['"Quicksand"', '"ZCOOL KuaiLe"', 'system-ui', 'sans-serif'],
        script: ['"Ma Shan Zheng"', 'cursive'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2.5rem',
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "float-slower": "float 8s ease-in-out infinite",
        "pulse-slow": "pulse-glow 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 6. Accessibility 红线

| 规则 | 描述 |
|------|------|
| Label | 表单控件必须有 label 或 aria-label |
| Focus | 交互元素必须有可见 focus 状态（`:focus-visible`） |
| Icon Button | 图标按钮必须有 `aria-label` |
| Motion | 尊重 `prefers-reduced-motion` |
| Contrast | 文字与背景对比度 ≥ 4.5:1（WCAG AA） |
| Semantic | 使用语义化 HTML（button for actions, a for navigation） |

---

## 7. 文件落地位置

| 文件 | 用途 |
|------|------|
| `docs/ui-style-guide.md` | 本规范（SSOT） |
| `app/globals.css` | 全局 CSS 变量与自定义类 |
| `tailwind.config.ts` | 主题色与 animation 扩展 |
| `app/layout.tsx` | 字体加载（next/font + local icons） |
| `components/ui/*` | shadcn/ui 组件定制 |

---

## 8. 快速参考

### 常用类名组合

```jsx
// 页面背景
className="bg-[#fdf8ff] text-slate-700 overflow-x-hidden font-sans"

// 玻璃卡片
className="floating-card p-12 relative overflow-hidden"

// 玻璃面板（轻量）
className="glass-panel rounded-[2.5rem] p-8"

// 主按钮
className="bg-lavender-300 text-white font-bold px-8 py-4 rounded-full shadow-[0_10px_25px_rgba(196,181,253,0.4)] hover:bg-lavender-400 hover:scale-105 transition-all"

// CTA 按钮
className="bg-coral-400 text-white font-bold px-7 py-3 rounded-full shadow-lg shadow-coral-400/20 hover:bg-coral-500 hover:scale-105 active:scale-95 transition-all"

// 手写体标题
className="font-script text-coral-400"
// 或使用
className="script-title"

// 有机形态背景
className="blob-shape bg-lavender-100/50 blur-3xl"

// Feature 卡片
className="bg-lavender-50/80 p-10 rounded-[3rem] border-2 border-lavender-100 hover:-rotate-2 transition-transform"

// 状态标签
className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-mint-50 text-mint-600 border border-mint-100"
```

---

**文档版本**: v2.0
**最后更新**: 2026-01-22
**维护者**: 点子 Lab 团队
