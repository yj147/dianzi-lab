# JWT+Cookie Auth Layer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在 `lib/` 提供最小、可测试的 JWT 会话能力（HS256 + 7天过期）并用 httpOnly cookie 持久化，同时补齐按邮箱查询用户的方法。

**Architecture:** `lib/auth.ts` 负责 JWT 签发/校验与 cookie 读写；`getSession()` 从 `session` cookie 提取 token 并验证，失败返回 `null`。`lib/users.ts` 负责数据库查询（Prisma）。

**Tech Stack:** Next.js(App Router) + jose(HS256 JWT) + Prisma + Jest

---

### Task 1: 引入 jose 依赖

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

**Step 1: 安装依赖**

Run: `npm install jose`
Expected: `added 1 package`，`package.json` 出现 `jose`

---

### Task 2: 为 auth/users 写失败测试（RED）

**Files:**
- Create: `__tests__/lib/auth.test.ts`

**Step 1: 写失败用例（JWT / cookie / getSession / getUserByEmail）**

覆盖：
- sign/verify：有效 token 返回 payload；过期/篡改 token 失败
- cookie：set/clear 的属性正确（httpOnly/sameSite/path/secure）
- getSession：cookie 缺失/无效返回 null；有效返回 payload
- getUserByEmail：存在返回 user；不存在返回 null；email 归一化

**Step 2: 运行测试确认失败**

Run: `npm test -- __tests__/lib/auth.test.ts`
Expected: FAIL（缺少 `lib/auth.ts` / 缺少 `getUserByEmail` 或断言不满足）

---

### Task 3: 实现最小功能（GREEN）

**Files:**
- Create: `lib/auth.ts`
- Modify: `lib/users.ts`
- Modify: `.env.example`

**Step 1: 实现 lib/auth.ts**

要求：
- `signJWT({ sub, email, role })` → HS256, `exp=7d`
- `verifyJWT(token)` → 校验签名与 exp，返回 payload（包含 `sub/email/role/exp`）
- `setSessionCookie(token)` → `session` httpOnly + sameSite=lax + path=/ + secure=prod only
- `clearSessionCookie()` → 清 cookie（同属性 + maxAge=0）
- `getSession()` → 从 cookie 读取并验证，失败返回 `null`

**Step 2: 实现 lib/users.ts 的 getUserByEmail(email)**

要求：
- 归一化 `email.trim().toLowerCase()`
- `prisma.user.findUnique({ where: { email } })`

**Step 3: 更新 .env.example**

新增：`JWT_SECRET=` 占位

---

### Task 4: 运行验证（GREEN + Coverage）

**Step 1: 运行目标测试 + coverage**

Run: `npm test -- __tests__/lib/auth.test.ts --coverage`
Expected: PASS；coverage ≥ 90%

