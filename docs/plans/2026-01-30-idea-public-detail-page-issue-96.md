# Public Idea Detail Page (Issue #96) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 新增公开路由 `/idea/[id]`，仅展示 `COMPLETED` 状态的案例详情页（其他状态 404），并覆盖核心 UI / 交互测试。

**Architecture:** Next.js App Router + Server Component 页面直接 Prisma 查询（`findFirst` + `status=COMPLETED` + `isDeleted=false`），不满足条件统一 `notFound()`。截图画廊用 client component 管理弹窗状态；空字段全部条件渲染，避免出现空区块。

**Tech Stack:** Next.js 14, Prisma, Tailwind, shadcn/ui, Jest + React Testing Library

---

### Task 1: 公开详情页路由（Server Component）

**Files:**
- Create: `app/idea/[id]/page.tsx`

**Step 1: Prisma 查询 + 404**

- 查询：`prisma.idea.findFirst({ where: { id, status: 'COMPLETED', isDeleted:false }, select: { ... } })`
- 不存在：`notFound()`

**Step 2: 页面结构**

- Hero：标题、描述、标签（空数组则隐藏）
- Main：截图画廊（无截图则隐藏 + layout 自动变单列）、信息卡（技术栈/开发周期按需展示）
- CTA：存在 `externalUrl` 则显示 primary 按钮；始终提供返回首页的 secondary 按钮

---

### Task 2: 组件（截图画廊 + 技术栈标签）

**Files:**
- Create: `components/idea/ScreenshotGallery.tsx`
- Create: `components/idea/TechStackBadges.tsx`

**Step 1: TechStackBadges**

- 输入：`string[]`
- 过滤空白字符串；空数组返回 `null`
- 样式复用现有 tag（`rounded-full bg-muted ... font-mono text-xs`）

**Step 2: ScreenshotGallery**

- 网格：移动 1 列，桌面 2-3 列（`sm:grid-cols-2 lg:grid-cols-3`）
- 点击缩略图打开 Modal（`role="dialog" aria-modal="true"`）
- 支持：点击遮罩关闭、Esc 关闭、可访问的关闭按钮（有 `aria-label`）

---

### Task 3: 测试（Jest + RTL）

**Files:**
- Create: `__tests__/app/idea/[id]/page.test.tsx`

**Scenarios:**
- `COMPLETED` 正常渲染：标题/描述/标签/技术栈/开发周期/外部链接/截图缩略图
- 404：Prisma 返回 `null` → `notFound()` 被调用
- 空状态：tags/screenshots/techStack/duration/externalUrl 为空时对应区块不渲染
- 交互：点击截图打开 Modal；点击关闭或 Esc 关闭

Run: `npm run test`  
Expected: 全部通过（覆盖新组件，避免整体覆盖率下降）。

---

### Task 4: 构建验证

Run: `npm run build`  
Expected: `next build` 成功，无类型/ESLint/Prisma 生成错误。

