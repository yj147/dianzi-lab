# Theme Toggle (Light/Dark) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 增加亮色/暗色主题切换：按钮在头部导航栏（主站 Navbar + AdminTopNav），支持移动端显示与可访问性；完成后浏览器验证并用 `gh` 创建 PR。

**Architecture:** 使用 Tailwind `darkMode: 'class'` + 在 `<html>` 上切换 `dark` class。通过 `localStorage` 记忆用户选择，并在 `app/layout.tsx` 注入 inline script 做首屏初始化（避免闪烁/错配）。

**Tech Stack:** Next.js 14 App Router, TailwindCSS, shadcn/ui, TypeScript.

---

### Task 1: Dark mode 基础设施（Tailwind + CSS Variables）

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

**Step 1: 切换 Tailwind dark mode 策略为 class**
- 修改 `tailwind.config.ts` 增加 `darkMode: ['class']`。

**Step 2: 用 `.dark` 覆盖 Token**
- 在 `app/globals.css` 中移除 `@media (prefers-color-scheme: dark)` 的 token 覆盖。
- 增加 `.dark { --background: ...; --foreground: ...; ... }`，并确保对比度达标。
- 必要时为 `.glass-panel` / `.floating-card` 增加暗色适配（避免亮白刺眼）。

**Step 3: 本地验证**
- Run: `npm run lint`
- Run: `npm run test`

---

### Task 2: 主题初始化脚本（首屏无闪烁）

**Files:**
- Modify: `app/layout.tsx`

**Step 1: 注入 theme init script**
- 在 `<head>` 写入 inline script：读取 `localStorage.theme`（`light|dark`），否则跟随系统 `prefers-color-scheme`。
- 设置 `document.documentElement.classList.toggle('dark', isDark)` + `style.colorScheme`。
- 在 `<html>` 增加 `suppressHydrationWarning`。

**Step 2: Root layout class 使用 token**
- 将 `<body>` 的 `bg-[#fdf8ff] text-slate-700` 替换为 `bg-background text-foreground`（保留 `font-sans` 等）。
- Skip link 的 `bg/text/ring-offset` 增加 `dark:` 适配。

---

### Task 3: Theme Toggle Button 组件 + 接入导航栏

**Files:**
- Create: `components/ThemeToggle.tsx`
- Modify: `components/NavbarClient.tsx`
- Modify: `app/admin/_components/AdminTopNav.tsx`

**Step 1: 创建 `ThemeToggle`（client）**
- icon-only button（必须 `aria-label`）
- 点击时切换 `<html>` 的 `dark` class，并写入 `localStorage.theme`。
- 组件样式需在桌面与移动端均可点击（最小触达区域 40px）。

**Step 2: 主站 Navbar 接入**
- 在 `components/NavbarClient.tsx` 的右侧操作区插入 `ThemeToggle`。
- 确保移动端不挤压（必要时调整 gap / padding）。

**Step 3: AdminTopNav 接入**
- 在 `app/admin/_components/AdminTopNav.tsx` 的右侧操作区插入 `ThemeToggle`。

**Step 4: 质量门槛**
- Run: `npm run lint`
- Run: `npm run test`

---

### Task 4: 浏览器验证 + 提交 PR

**Step 1: 本地启动**
- Run: `npm run dev`

**Step 2: Chrome DevTools MCP 验证**
- 桌面：打开首页，切换主题，确认背景/文字/导航栏可读
- 移动端：模拟 390x844，确认按钮可见可点且不溢出

**Step 3: Git / PR**
- 创建分支：`feat/theme-toggle`
- 提交：`feat(ui): add light/dark theme toggle`
- Push：`git push -u origin feat/theme-toggle`
- 用 `gh pr create` 创建 PR（base: `main`）
