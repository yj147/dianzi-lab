# Responsive / Mobile UI-UX Audit & Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 修复全站（含 admin）移动端响应式与 UI/UX 问题，补齐移动导航、减少不安全的 `transition-all`、补充 `prefers-reduced-motion`，并确保 `npm run build` 不破。

**Architecture:** 基于现有 Tailwind + shadcn/ui（Radix）组件体系做最小改动；优先复用现有导航模式（`DropdownMenu` / `<details>`），避免引入新依赖与新交互原语。

**Tech Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Prisma

---

### Task 1: 建立“问题清单 + 复现路径”

**Files:**
- Reference: `docs/ui-style-guide.md`
- Reference: `~/.codex/skills/web-design-guidelines/SKILL.md`（通过抓取规则校验）

**Step 1: 列出路由并覆盖移动断点**

Run: `find app -name page.tsx | sort`
Expected: 输出所有页面路由文件

**Step 2: 抓取 Web Interface Guidelines 并用于静态审查**

Run: `curl -fsSL https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md | sed -n '1,120p'`
Expected: 拉到最新规则（a11y / focus / transition / safe-area 等）

---

### Task 2: 修复全局导航（移动端可用）

**Files:**
- Modify: `components/NavbarClient.tsx`

**Step 1: 为 `navLinks` 补齐 `md:hidden` 的移动菜单**
- 复用 `DropdownMenu`（当前文件已使用），避免新增 primitive。
- 移动端按钮：`aria-label="打开菜单"`，触控目标 ≥ 40px（`size-10`）。
- 菜单内容至少包含当前 `navLinks`，并在点击后自动关闭。

**Step 2: 去除不安全的 `transition-all`**
- 覆盖层与菜单项：用 `transition-opacity` / `transition-colors` / `transition-transform` 精确列出。

---

### Task 3: 修复提交页导航（移动端可用 + 遵循规范）

**Files:**
- Modify: `app/(submit)/layout.tsx`

**Step 1: 去掉禁用的字距**
- 移除 `tracking-wider`（规范要求“禁止修改 letter-spacing”）。

**Step 2: 补齐移动端导航入口**
- 增加 `md:hidden` 的菜单（优先用 `<details>`，不引入 client state）。
- 菜单项：`幻象大厅` / `造梦工具` / `关于我们` + 登录/我的工坊。

---

### Task 4: 修复首页 Hero 的移动端排版与交互

**Files:**
- Modify: `components/Hero.tsx`

**Step 1: 调整标题与按钮的移动端字号/间距**
- 目标：320px 宽不溢出、按钮不挤压、文本可读。

**Step 2: 替换 `transition-all`，补 `motion-reduce`**
- 目标：交互动画 ≤ 200ms，且支持 `prefers-reduced-motion`。

---

### Task 5: 修复 Dashboard 顶部导航的移动端拥挤/溢出

**Files:**
- Modify: `app/(dashboard)/dashboard/page.tsx`

**Step 1: 小屏隐藏/缩短品牌文本，压缩 gap/padding**
- 目标：320px 宽不发生横向挤压或溢出。

---

### Task 6: 降低移动端背景动画成本

**Files:**
- Modify: `app/(dashboard)/layout.tsx`
- Modify: `app/admin/layout.tsx`
- Modify: `app/(auth)/login/page.tsx`
- Modify: `app/(auth)/register/page.tsx`

**Step 1: 小屏禁用或降低动画**
- 规则：`animate-none sm:animate-*` + `motion-reduce:animate-none`
- 目标：移动端不卡顿、不耗电，且尊重 reduced motion。

---

### Task 7: 统一消除 `transition-all`（最小风险）

**Files:**
- Modify: `components/ui/button.tsx`
- Modify: 触达的少量页面/组件（仅当仍出现 `transition-all`）

**Step 1: 将基础 Button 的 `transition-all` 改为明确属性**
- 默认使用 `transition-colors`（必要时再加 `transition-shadow`）。

---

### Task 8: 验证（不得影响生产构建）

**Step 1: 本地构建**

Run: `npm run build`
Expected: 成功（Next build 通过）

**Step 2: 质量检查**

Run: `npm run lint`
Expected: 无新增 lint 错误

Run: `npm run test`
Expected: 测试通过（若存在）

---

### Task 9: 创建 PR

**Step 1: 新建分支并提交**

Run: `git checkout -b fix/responsive-uiux`
Run: `git commit -am "fix(ui): responsive nav & reduce transitions"`

**Step 2: 创建 PR（如仓库已配置 gh）**

Run: `gh pr create --fill`
Expected: PR 创建成功（若未登录则提示用户登录）

