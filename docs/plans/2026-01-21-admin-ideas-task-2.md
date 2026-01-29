# Admin Ideas (task-2) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在 `/admin/ideas` 实现点子列表与状态管理：列表（isDeleted=false）、状态筛选（URL 参数）、状态变更、移至垃圾箱，并补齐最小集成测试。

**Architecture:** `app/admin/ideas/page.tsx` 作为 Server Component 直接用 Prisma 查询；`IdeasTable` 作为 Client Component 负责读取 `useSearchParams`、更新 URL、调用 Server Actions，并用 `router.refresh()` 刷新列表数据。

**Tech Stack:** Next.js App Router, Prisma, TailwindCSS, Jest + Testing Library.

---

### Task 1: Admin Ideas Page（Server Component）

**Files:**

- Create: `app/admin/ideas/page.tsx`

**Step 1: Write failing test**

- 覆盖：默认加载（无 status 参数）与带 `?status=PENDING` 时 Prisma where 条件正确。

**Step 2: Run test to verify it fails**

- Run: `npm test -- __tests__/app/admin/ideas.test.tsx`
- Expected: 失败（模块缺失/断言失败均可）

**Step 3: Implement minimal code**

- 解析 `searchParams.status`（非法值视为不过滤）
- `prisma.idea.findMany({ where: { isDeleted:false, ...(status && { status }) } ... })`

**Step 4: Run test to verify it passes**

- Run: `npm test -- __tests__/app/admin/ideas.test.tsx`

---

### Task 2: IdeasTable（Client Component）

**Files:**

- Create: `app/admin/ideas/_components/IdeasTable.tsx`

**Step 1: Write failing test**

- 覆盖：筛选下拉读取 URL `status`；变更筛选时 `router.push()` + `router.refresh()`。
- 覆盖：每行“状态变更下拉”触发 `updateIdeaStatus()`；“移至垃圾箱”触发 `moveToTrash()`。

**Step 2: Run test to verify it fails**

- Run: `npm test -- __tests__/app/admin/ideas.test.tsx`

**Step 3: Implement minimal code**

- 复用 `STATUS_CONFIG` + `StatusBadge`
- 下拉选项：`全部` + `PENDING/APPROVED/IN_PROGRESS/COMPLETED`
- URL 更新规则：选择 `全部` → `/admin/ideas`；否则 `/admin/ideas?status=...`

**Step 4: Run test to verify it passes**

- Run: `npm test -- __tests__/app/admin/ideas.test.tsx`

---

### Task 3: Server Actions

**Files:**

- Create: `app/admin/ideas/actions.ts`

**Step 1: Write failing test**

- 覆盖：调用 `updateIdeaStatus(ideaId, status)` 会触发 `prisma.idea.update({data:{status}})`；`moveToTrash(ideaId)` 会触发 `prisma.idea.update({data:{isDeleted:true}})`。

**Step 2: Implement minimal code**

- 在 action 内校验 `getSession()` 且 `role === 'ADMIN'`，否则抛错

**Step 3: Run test to verify it passes**

- Run: `npm test -- __tests__/app/admin/ideas.test.tsx`
