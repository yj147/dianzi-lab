# Bambi Lab Idea 视觉与交互规范（工业蓝图主题 v3）

> **设计方向**：工业蓝图 + 实心阴影 + 网格背景 + 专业排版
> **技术栈**：Next.js 14 + Tailwind CSS + shadcn/ui (Radix) + Lucide Icons + Motion
> **参考设计**：`ui-prototype/app/`

---

## 1. 设计原则

### 1.1 核心记忆点

| 特征 | 描述 |
|------|------|
| 实心阴影 | 硬边阴影（solid shadow），强调层次感 |
| 暖色调背景 | Clay Beige `#F2F2EE`，温暖专业 |
| 网格背景 | Blueprint 风格，传达工程严谨感 |
| 专业字体 | Space Grotesk（标题）+ DM Sans（正文）+ JetBrains Mono（代码） |
| 2px 边框 | 清晰的边界，强调结构 |

### 1.2 设计约束（来自 ui-skills）

- 使用 Tailwind CSS 默认值，除非项目已有自定义值
- 使用 `cn` 工具（clsx + tailwind-merge）处理类名逻辑
- 破坏性操作必须使用 `AlertDialog`
- 使用 `h-dvh` 而非 `h-screen`
- 动画仅使用 `transform` 和 `opacity`（compositor props）
- 交互反馈动画 ≤ 200ms
- 尊重 `prefers-reduced-motion`
- **禁止**使用渐变（除非明确要求）
- **禁止**使用发光效果作为主要视觉元素

---

## 2. Design Tokens

### 2.1 色彩系统

#### 品牌色

```
brand-bg      #F2F2EE   Clay Beige - 温暖页面背景
brand-dark    #1A1A1A   Ink Black - 深色文字、边框
brand-primary #2B4C7E   Drafting Blue - 主色调，代表专业与信任
brand-accent  #E07A5F   Spark Orange - 强调色，代表活力与行动
brand-success #81B29A   Growth Green - 成功状态
brand-surface #FFFFFF   白色表面
brand-border  #E5E5E5   边框色
```

#### 功能色

| Token | 值 | 用途 |
|-------|-----|------|
| `background` | `#F2F2EE` | 页面背景 |
| `text-primary` | `#1A1A1A` | 主要文字 |
| `text-secondary` | `#4B5563` (gray-600) | 次要文字 |
| `text-muted` | `#9CA3AF` (gray-400) | 辅助文字 |
| `surface` | `#FFFFFF` | 卡片、面板背景 |
| `border` | `#E5E5E5` | 默认边框 |

#### 语义色

| 语义 | 颜色 | 用途 |
|------|------|------|
| Success | `#81B29A` (brand-success) | 成功状态、已完成 |
| Warning | `#FBBF24` (amber-400) | 警告、进行中 |
| Danger | `#EF4444` (red-500) | 错误、删除 |
| Info | `#2B4C7E` (brand-primary) | 信息、待审核 |

### 2.2 字体系统

#### 字体家族

```css
--font-sans: "DM Sans", system-ui, sans-serif;
--font-heading: "Space Grotesk", system-ui, sans-serif;
--font-mono: "JetBrains Mono", monospace;
```

#### 字体加载（Google Fonts via next/font）

```ts
// app/layout.tsx
import { DM_Sans, Space_Grotesk, JetBrains_Mono } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
  variable: "--font-heading",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});
```

#### 字号系统

| 等级 | Tailwind | 用途 |
|------|----------|------|
| Display | `text-6xl` ~ `text-7xl` | Hero 标题 |
| H1 | `text-3xl` ~ `text-4xl` | 页面标题 |
| H2 | `text-2xl` ~ `text-3xl` | 区块标题 |
| H3 | `text-xl` | 卡片标题 |
| Body | `text-base` ~ `text-lg` | 正文 |
| Small | `text-sm` | 辅助信息 |
| Caption | `text-xs` | 标签、时间戳、等宽信息 |

#### 排版规则

- 标题使用 `font-heading font-bold`
- 正文使用 `font-sans`
- 代码/技术信息使用 `font-mono`
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
| `space-24` | 96px | Hero 区域 |

#### 容器宽度

| 容器 | Tailwind | 值 |
|------|----------|-----|
| 窄 | `max-w-md` | 448px |
| 中 | `max-w-2xl` | 672px |
| 标准 | `max-w-6xl` | 1152px |
| 宽 | `max-w-7xl` | 1280px |

### 2.4 圆角系统

| 等级 | Tailwind | 值 | 用途 |
|------|----------|-----|------|
| sm | `rounded-md` | 6px | Badge、小标签 |
| DEFAULT | `rounded-lg` | 8px | Input、按钮 |
| lg | `rounded-xl` | 12px | 卡片 |
| xl | `rounded-2xl` | 16px | 大卡片、弹窗 |
| full | `rounded-full` | 9999px | 头像、圆形按钮 |

### 2.5 阴影系统

```css
/* 实心阴影 - 核心视觉特征 */
shadow-solid-sm: 2px 2px 0px 0px rgba(0, 0, 0, 0.8);
shadow-solid:    4px 4px 0px 0px rgba(0, 0, 0, 0.8);
shadow-solid-lg: 8px 8px 0px 0px rgba(0, 0, 0, 0.8);

/* 柔和阴影 - 仅用于特殊场景 */
shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
```

### 2.6 边框系统

| 场景 | 样式 |
|------|------|
| 卡片 | `border-2 border-brand-dark` |
| 输入框 | `border-2 border-gray-200` |
| 分割线 | `border-b-2 border-brand-dark/10` |
| 装饰边框 | `border-4 border-brand-dark` |

### 2.7 动画系统

#### 时长

| 场景 | 时长 | 缓动 |
|------|------|------|
| 快速交互 | 150ms | `ease-out` |
| 常规过渡 | 200ms | `ease-in-out` |
| 页面过渡 | 300ms | `ease-in-out` |

#### 交互效果

```css
/* 按钮悬浮 */
hover:-translate-y-0.5
hover:shadow-solid (从 shadow-solid-sm 变为 shadow-solid)

/* 按钮按下 */
active:translate-y-0
active:shadow-none

/* 卡片悬浮 */
hover:y-[-6px]
hover:shadow-solid (从 shadow-solid-sm 变为 shadow-solid)
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

#### Primary

```jsx
<button className="bg-brand-dark text-white font-heading font-bold px-5 py-2 rounded-lg border-2 border-brand-dark shadow-solid hover:bg-brand-accent hover:-translate-y-0.5 hover:shadow-solid-lg active:translate-y-0 active:shadow-none transition-all">
  主要操作
</button>
```

| 属性 | 值 |
|------|-----|
| 背景 | brand-dark `#1A1A1A` |
| 文字 | white |
| 边框 | 2px solid brand-dark |
| 阴影 | shadow-solid |
| Hover | `bg-brand-accent`, `-translate-y-0.5`, `shadow-solid-lg` |
| Active | `translate-y-0`, `shadow-none` |

#### Secondary

```jsx
<button className="bg-white text-brand-dark font-heading font-bold px-5 py-2 rounded-lg border-2 border-brand-dark shadow-solid hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-solid-lg active:translate-y-0 active:shadow-none transition-all">
  次要操作
</button>
```

#### Outline

```jsx
<button className="bg-transparent text-brand-dark font-heading font-bold px-5 py-2 rounded-lg border-2 border-brand-dark hover:bg-brand-dark hover:text-white transition-all">
  轮廓按钮
</button>
```

#### Ghost

```jsx
<button className="bg-transparent text-gray-600 font-heading font-bold px-3 py-1 rounded-md hover:text-brand-primary hover:bg-gray-100 transition-colors">
  幽灵按钮
</button>
```

#### 按钮尺寸

| 尺寸 | padding | 字号 | 圆角 |
|------|---------|------|------|
| sm | `px-3 py-1` | `text-sm` | `rounded-md` |
| md | `px-5 py-2` | `text-base` | `rounded-lg` |
| lg | `px-8 py-3` | `text-lg` | `rounded-xl` |

### 3.2 卡片（Cards）

#### 基础卡片

```jsx
<div className="bg-white border-2 border-brand-dark rounded-xl p-5 shadow-solid-sm hover:shadow-solid hover:-translate-y-1.5 transition-all">
  {/* 内容 */}
</div>
```

#### 特性卡片

```jsx
<div className="bg-brand-bg border-2 border-brand-dark p-8 shadow-solid hover:-translate-y-1 hover:shadow-solid-lg transition-all">
  <div className="w-14 h-14 bg-white border-2 border-brand-dark flex items-center justify-center mb-6 shadow-solid-sm">
    <Icon size={28} className="text-brand-primary" />
  </div>
  <h3 className="font-heading font-bold text-xl mb-3">标题</h3>
  <p className="text-gray-600 leading-relaxed">描述文字</p>
</div>
```

#### 统计卡片

```jsx
<div className="bg-white border-2 border-brand-dark rounded-xl p-6 shadow-solid-sm flex items-center gap-4">
  <div className="w-12 h-12 bg-blue-100 text-brand-primary rounded-full flex items-center justify-center">
    <Icon size={24} />
  </div>
  <div>
    <div className="text-3xl font-heading font-bold text-brand-dark">42</div>
    <div className="text-sm text-gray-500 font-bold">统计标签</div>
  </div>
</div>
```

### 3.3 表单（Forms）

#### Input

```jsx
<div>
  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
    字段名称
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
      <Icon size={16} />
    </div>
    <input
      type="text"
      className="w-full pl-10 px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:bg-white transition-colors text-sm"
      placeholder="占位文字"
    />
  </div>
</div>
```

#### Textarea

```jsx
<textarea
  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary focus:bg-white transition-colors min-h-[240px] resize-y text-base leading-relaxed"
  placeholder="详细描述..."
/>
```

#### 表单规则

- Input 必须有 `label`（可视或 `aria-label`）
- 使用正确的 `type`（email, password, tel, url）
- 设置 `autocomplete` 属性
- 禁止阻止粘贴
- 错误信息内联显示
- Focus 状态：`border-brand-primary` + `ring-1 ring-brand-primary`

### 3.4 标签（Badges/Tags）

#### 状态标签

```jsx
<span className="inline-flex items-center gap-1.5 rounded-full font-mono font-medium border px-3 py-1 text-sm bg-amber-50 text-amber-600 border-amber-200">
  <Icon size={14} />
  状态文字
</span>
```

| 状态 | 背景 | 文字 | 边框 |
|------|------|------|------|
| Pending | amber-50 | amber-600 | amber-200 |
| Approved | blue-50 | brand-primary | blue-200 |
| In Progress | orange-50 | brand-accent | orange-200 |
| Completed | green-50 | brand-success | green-200 |
| Deleted | red-50 | red-600 | red-200 |

#### 标签（Tag）

```jsx
<span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
  #标签名
</span>
```

### 3.5 图标系统

#### 图标库

使用 **Lucide React**（轻量、一致性好）

```jsx
import { Lightbulb, User, Mail, Lock } from 'lucide-react';

<Lightbulb size={20} strokeWidth={2} />
```

#### 尺寸规范

| 用途 | size | strokeWidth |
|------|------|-------------|
| 行内 | 12 | 2 |
| 按钮内 | 16-18 | 2 |
| 卡片内 | 20-24 | 2 |
| Feature | 28-48 | 1.5-2 |

#### 图标按钮

```jsx
<button
  className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-brand-primary hover:bg-gray-200 transition-colors"
  aria-label="操作说明"
>
  <Icon size={20} />
</button>
```

---

## 4. 布局模式

### 4.1 背景装饰系统

#### 网格背景

```jsx
<div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none z-0" />
```

```css
.bg-grid-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23ccc' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
}
```

### 4.2 Header（顶部导航）

```jsx
<nav className="sticky top-0 z-50 w-full border-b-2 border-brand-dark/10 bg-brand-bg/90 backdrop-blur-md">
  <div className="container mx-auto px-4 h-20 flex items-center justify-between">
    {/* Logo */}
    <div className="flex items-center gap-3 cursor-pointer group">
      <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-solid-sm group-hover:bg-brand-accent transition-colors">
        <Lightbulb size={20} strokeWidth={3} />
      </div>
      <span className="font-heading font-bold text-2xl tracking-tight text-brand-dark">
        品牌名<span className="text-brand-primary"> Lab</span>
      </span>
    </div>

    {/* Nav Links */}
    <div className="hidden md:flex items-center gap-8">
      <button className="text-base font-bold text-gray-500 hover:text-brand-dark transition-colors">
        导航项
      </button>
    </div>

    {/* Actions */}
    <div className="flex items-center gap-4">
      <button className="font-bold text-base text-brand-dark hover:underline">登录</button>
      <Button>注册</Button>
    </div>
  </div>
</nav>
```

### 4.3 Hero 区域

```jsx
<section className="relative z-10 pt-24 pb-20 md:min-h-screen flex flex-col justify-center border-b-4 border-brand-dark bg-brand-bg/90 backdrop-blur-sm">
  <div className="container mx-auto px-4 max-w-7xl">
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      {/* Text Content */}
      <div>
        <div className="inline-flex items-center gap-2 bg-brand-dark text-white px-4 py-1.5 font-mono font-bold text-sm mb-8 shadow-solid-sm">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          状态标签
        </div>

        <h1 className="font-heading font-bold text-6xl md:text-7xl leading-[0.95] text-brand-dark mb-8 tracking-tight">
          主标题
          <span className="text-brand-primary bg-brand-accent/20 px-2">强调词</span>
        </h1>

        <p className="text-xl md:text-2xl font-medium text-brand-dark/80 mb-10 max-w-lg border-l-4 border-brand-primary pl-6 py-2 leading-relaxed">
          副标题描述文字
        </p>

        <div className="flex flex-col sm:flex-row gap-5">
          <Button size="lg">主要 CTA</Button>
          <Button variant="secondary" size="lg">次要 CTA</Button>
        </div>
      </div>

      {/* Visual Element */}
      <div className="relative hidden lg:block">
        {/* Hero 视觉元素 */}
      </div>
    </div>
  </div>
</section>
```

### 4.4 Section 分隔

```jsx
{/* 带边框的 Section */}
<section className="py-24 bg-white border-y-4 border-brand-dark">
  <div className="container mx-auto px-4">
    {/* 内容 */}
  </div>
</section>

{/* 带标题的 Section */}
<section className="py-24 bg-brand-bg">
  <div className="container mx-auto px-4">
    <div className="flex justify-between items-end mb-12 border-b-2 border-brand-dark pb-4">
      <h2 className="font-heading font-bold text-4xl">区块标题</h2>
      <div className="font-mono text-sm">SECTION LABEL</div>
    </div>
    {/* 内容 */}
  </div>
</section>
```

### 4.5 Footer

```jsx
<footer className="bg-brand-dark text-white py-12 border-t-4 border-brand-accent">
  <div className="container mx-auto px-4">
    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-brand-dark font-bold">L</div>
        <span className="font-heading font-bold text-xl">品牌名</span>
      </div>
      <p className="text-gray-400 text-sm font-mono">
        © 2024 品牌名. All rights reserved.
      </p>
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
  --background: #F2F2EE;
  --foreground: #1A1A1A;
  --brand-primary: #2B4C7E;
  --brand-accent: #E07A5F;
  --brand-success: #81B29A;
}

body {
  color: var(--foreground);
  background: var(--background);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 网格背景 */
.bg-grid-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23ccc' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
}

/* 滚动条隐藏 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
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
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          bg: '#F2F2EE',
          dark: '#1A1A1A',
          primary: '#2B4C7E',
          accent: '#E07A5F',
          success: '#81B29A',
          surface: '#FFFFFF',
          border: '#E5E5E5',
        },
      },
      boxShadow: {
        'solid': '4px 4px 0px 0px rgba(0,0,0,0.8)',
        'solid-sm': '2px 2px 0px 0px rgba(0,0,0,0.8)',
        'solid-lg': '8px 8px 0px 0px rgba(0,0,0,0.8)',
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23ccc' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
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
| `tailwind.config.ts` | 主题色与阴影扩展 |
| `app/layout.tsx` | 字体加载（next/font/google） |
| `components/ui/*` | shadcn/ui 组件定制 |

---

## 8. 快速参考

### 常用类名组合

```jsx
// 页面背景
className="min-h-screen bg-brand-bg font-sans text-brand-dark"

// 基础卡片
className="bg-white border-2 border-brand-dark rounded-xl p-5 shadow-solid-sm hover:shadow-solid hover:-translate-y-1.5 transition-all"

// 主按钮
className="bg-brand-dark text-white font-heading font-bold px-5 py-2 rounded-lg border-2 border-brand-dark shadow-solid hover:bg-brand-accent hover:-translate-y-0.5 transition-all"

// 次要按钮
className="bg-white text-brand-dark font-heading font-bold px-5 py-2 rounded-lg border-2 border-brand-dark shadow-solid hover:bg-gray-50 hover:-translate-y-0.5 transition-all"

// 输入框
className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:bg-white transition-colors"

// 标签文字
className="text-xs font-bold text-gray-700 uppercase tracking-wider"

// 等宽信息
className="font-mono text-xs text-gray-400"

// Section 标题
className="font-heading font-bold text-4xl text-brand-dark"

// 状态标签
className="inline-flex items-center gap-1.5 rounded-full font-mono font-medium border px-3 py-1 text-sm"
```

---

**文档版本**: v3.0
**最后更新**: 2026-01-26
**维护者**: Bambi Lab Idea 团队
**设计风格**: Industrial Blueprint
