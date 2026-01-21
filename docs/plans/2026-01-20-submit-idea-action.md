# Submit Idea Server Action Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 实现 `submitIdea(formData)` server action：未登录重定向；表单安全读取 + Zod 校验；成功创建 Idea 后返回 `{ success: true, ideaId }`；失败返回 `{ success: false, error, field }`。

**Architecture:** `app/submit/actions.ts` 负责：读取 `FormData` → 过滤 tags → `submitIdeaSchema.safeParse` → `prisma.idea.create` → 返回 `ActionResult`。测试通过 Jest mock `next/navigation` / `@/lib/auth` / `@/lib/db`，在 node 环境验证分支行为。

**Tech Stack:** Next.js(App Router server action) + Zod + Prisma + Jest

---

### Task 1: 写 server action 的失败测试（RED）

**Files:**
- Create: `__tests__/app/submit/actions.test.ts`

**Step 1: 写用例**

覆盖：
- 未登录：`redirect('/login')`
- 校验失败：返回 `{ success: false, error, field }`
- 成功：返回 `{ success: true, ideaId }`，并调用 `prisma.idea.create`（`status='PENDING'`）
- tags 过滤：忽略非法 tag

**Step 2: 运行测试确认失败**

Run: `npm test -- --testPathPattern=submit/actions`
Expected: FAIL（当前实现成功分支会 `redirect`，且对缺失字段处理不安全）

---

### Task 2: 实现 submitIdea（GREEN）

**Files:**
- Modify: `app/submit/actions.ts`

**Step 1: 安全读取 FormData**
- `title/description`: 非 string 或 null → `''`（触发 schema 自定义中文错误信息）
- `tags`: 仅保留 string 且属于 `TAGS` 的项

**Step 2: 校验与返回**
- schema 失败：取首个 issue，返回 `{ success: false, error, field }`
- 创建成功：`status` 默认为 `PENDING`，返回 `{ success: true, ideaId }`

---

### Task 3: 运行验证（GREEN）

Run: `npm test -- --testPathPattern=submit/actions`
Expected: PASS

