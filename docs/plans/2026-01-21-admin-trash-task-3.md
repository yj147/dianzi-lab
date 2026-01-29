# Admin Trash (task-3) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在 `/admin/trash` 实现回收站：展示 `isDeleted=true` 的点子列表，支持恢复、永久删除（AlertDialog 确认）与空状态。

**Architecture:** `app/admin/trash/page.tsx` 作为 Server Component 直接用 Prisma 查询回收站数据；`TrashTable` 作为 Client Component 负责调用 Server Actions，并在操作完成后用 `router.refresh()` 刷新列表数据；删除确认使用 `components/ui/alert-dialog.tsx`（shadcn 风格封装 Radix AlertDialog primitives）。

**Tech Stack:** Next.js App Router, Prisma, TailwindCSS, Radix UI, Jest + Testing Library.

---

### Task 0: 安装依赖（Radix AlertDialog）

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`

**Step 1: Install**

- Run: `npm install @radix-ui/react-alert-dialog`

---

### Task 1: Trash 最小集成测试（RED）

**Files:**

- Create: `__tests__/app/admin/trash.test.tsx`

**Step 1: Write failing tests**

- 覆盖：Server Page 查询 `isDeleted=true` 并渲染表格
- 覆盖：空状态（使用 `EmptyState`）
- 覆盖：恢复按钮触发 `restoreIdea()` 并调用 `router.refresh()`
- 覆盖：永久删除按钮打开 AlertDialog；点击确认触发 `permanentDeleteIdea()` 并 `router.refresh()`

**Step 2: Run test to verify it fails**

- Run: `npm test -- __tests__/app/admin/trash.test.tsx`
- Expected: FAIL（模块缺失或断言失败均可）

---

### Task 2: AlertDialog 组件（GREEN）

**Files:**

- Create: `components/ui/alert-dialog.tsx`

**Step 1: Implement minimal component**

- 参考 shadcn/ui 封装：`AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogAction`, `AlertDialogCancel` 等
- 默认样式可用（Overlay/Content 基础布局），Action 支持红色 destructive 风格

**Step 2: Run tests**

- Run: `npm test -- __tests__/app/admin/trash.test.tsx`

---

### Task 3: 回收站 Server Actions（GREEN）

**Files:**

- Create: `app/admin/trash/actions.ts`

**Step 1: Implement**

- `restoreIdea(ideaId)` → `prisma.idea.update({ data:{ isDeleted:false } })`
- `permanentDeleteIdea(ideaId)` → `prisma.idea.delete({ where:{ id } })`
- 复用 `getSession()` 校验 `role === 'ADMIN'`，否则抛错

**Step 2: Run tests**

- Run: `npm test -- __tests__/app/admin/trash.test.tsx`

---

### Task 4: 回收站页面（Server Component）+ 表格（Client Component）

**Files:**

- Create: `app/admin/trash/page.tsx`
- Create: `app/admin/trash/_components/TrashTable.tsx`

**Step 1: Implement page**

- `getTrashedIdeas()`：`where: { isDeleted:true }`，`include user.email`，`orderBy updatedAt desc`
- `ideas.length === 0` 时使用 `components/EmptyState.tsx` 显示空状态

**Step 2: Implement table**

- 列：标题 / 提交者邮箱 / 删除时间（`updatedAt`）/ 操作（恢复 + 永久删除）
- 恢复按钮直接调用 `restoreIdea()`；删除按钮打开 AlertDialog 确认后调用 `permanentDeleteIdea()`
- 每次操作完成后调用 `router.refresh()`

**Step 3: Run tests**

- Run: `npm test -- __tests__/app/admin/trash.test.tsx`
