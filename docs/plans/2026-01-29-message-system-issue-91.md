# Message System (Issue #91) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 实现 Message 数据模型与 3 个 Server Actions（createMessage / getMessagesByIdeaId / getInboxMessages），并用 Jest 覆盖核心权限与校验场景。

**Architecture:** 延续现有模式：`getSession()` 获取登录态；未登录统一 `redirect('/login')`；业务校验/权限失败返回 `{ success:false, error }`（仅 `createMessage`）；查询接口返回数组（无权限或不存在返回空数组）。所有 Prisma 读取使用 `select` 白名单避免泄露敏感字段（如 `passwordHash`）。

**Tech Stack:** Next.js 14 (Server Actions), Prisma (PostgreSQL), Jest

---

### Task 1: Prisma Schema 变更

**Files:**
- Modify: `prisma/schema.prisma`

**Step 1: 修改 schema**

关键点：
- `User` 增加 `sentMessages` / `receivedMessages` 关系
- `Idea` 增加 `messages` 关系
- 新增 `Message` 模型：`senderId` / `receiverId` / `ideaId` / `isRead` / `createdAt` + 索引

**Step 2: 推送到数据库**

Run: `npx prisma db push`  
Expected: 数据库与 schema 同步（无报错）。

**Step 3: 生成 Prisma Client**

Run: `npx prisma generate`

---

### Task 2: Server Actions（lib/message-actions.ts）

**Files:**
- Create: `lib/message-actions.ts`

**Step 1: createMessage(ideaId, receiverId, content)**

要求：
- 未登录：`redirect('/login')`
- 校验：`content.trim().length` 在 `[1, 1000]`
- 校验：`idea` 存在且 `isDeleted=false`
- 校验：`receiver` 存在
- 校验：不允许 `receiverId === session.sub`
- 权限：`session.sub === idea.userId` 或 `receiverId === idea.userId`
- 返回：`{ success:true, messageId }` 或 `{ success:false, error }`

**Step 2: getMessagesByIdeaId(ideaId)**

要求：
- 未登录：`redirect('/login')`
- 权限：`idea.userId === session.sub` 或该用户是此 `ideaId` 下任一消息的参与者（sender/receiver）
- 返回：按 `createdAt ASC`，包含 `sender/receiver` 的 `id/email`

**Step 3: getInboxMessages()**

要求：
- 未登录：`redirect('/login')`
- 返回：`receiverId === session.sub` 的消息，按 `createdAt DESC`，包含 `sender` 与 `idea(id,title)`

---

### Task 3: 单元测试（Jest）

**Files:**
- Create: `__tests__/lib/message-actions.test.ts`

**Scenarios:**
- `createMessage`: 成功、未登录 redirect、内容校验、权限校验、禁止自发
- `getMessagesByIdeaId`: owner 可查看、参与者可查看、无关用户不可查看
- `getInboxMessages`: 返回当前用户消息且按时间倒序

Run: `npm run test`  
Expected: 全部测试通过。

