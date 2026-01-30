# User QR Payment (Issue #100) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在用户侧（inbox / 项目详情）展示报价与支付状态，并提供微信/支付宝静态收款码扫码支付弹窗，供用户线下扫码付款后等待管理员确认。

**Architecture:** 延续现有 Next.js App Router + Server Actions 模式。`getInboxMessages()` 在服务端读取并白名单 `select` 出 `idea.price/paymentStatus/paidAt`；UI 端用 Client Component 渲染状态徽标与弹窗。为避免 RSC → Client 传递 `Date` 导致的序列化限制，`paidAt` 以 ISO 字符串下发，在客户端再 `new Date()` 格式化展示。二维码图片使用环境变量提供 URL，并在缺失配置时优雅降级（不展示支付入口或弹窗）。

**Tech Stack:** Next.js 14 (App Router), Prisma (PostgreSQL), Tailwind CSS, shadcn/ui (AlertDialog), date-fns

---

### Task 1: 环境变量示例

**Files:**
- Modify: `.env.example`

**Step 1: 添加二维码图片 URL**

新增（保持为空，供部署环境填充）：
- `NEXT_PUBLIC_WECHAT_PAY_QR`
- `NEXT_PUBLIC_ALIPAY_QR`

---

### Task 2: 用户支付 UI 组件

**Files:**
- Create: `components/payment/PaymentStatusBadge.tsx`
- Create: `components/payment/PaymentQRDialog.tsx`
- Create: `components/payment/PaymentStatusWithDialog.tsx`

**Step 1: PaymentStatusBadge**
- `PAID`：展示「已支付」+ 支付时间
- `REFUNDED`：展示「已退款」
- `PENDING` + `price=null`：展示「报价中」
- `PENDING` + `price!=null`：展示「待支付 ¥{price}」+（可选）支付按钮

**Step 2: PaymentQRDialog**
- 显示微信/支付宝切换按钮（仅在对应二维码 URL 存在时展示）
- 二维码缺失时展示占位提示
- 两个二维码都缺失时整体不渲染（避免空弹窗）

**Step 3: PaymentStatusWithDialog**
- 管理弹窗 `open` 状态
- 只在有 `price` 且至少配置一个二维码 URL 时，向 `PaymentStatusBadge` 传入 `onPayClick`
- 接收 `paidAtISO: string | null`，在客户端转换为 `Date` 供 `PaymentStatusBadge` 格式化

---

### Task 3: 扩展 getInboxMessages 返回字段

**Files:**
- Modify: `lib/message-actions.ts`
- Modify: `__tests__/lib/message-actions.test.ts`

**Step 1: 扩展 InboxMessage 类型**
- `idea` 增加：`price: string | null`、`paymentStatus: PaymentStatus`、`paidAt: Date | null`

**Step 2: Prisma select 增加字段并进行价格序列化**
- `price` 从 Prisma Decimal 转为 `string | null`（使用 `.toString()`，兼容 Decimal/number）

**Step 3: 更新单测期望**
- `getInboxMessages` 返回值与 `select` 白名单断言同步更新

---

### Task 4: Inbox 页展示支付状态并支持扫码弹窗

**Files:**
- Modify: `app/(dashboard)/dashboard/inbox/page.tsx`

**Step 1: 引入 PaymentStatusWithDialog**
- 在消息卡片头部区域展示支付状态
- 通过 props 下发 `paidAtISO`（避免传 `Date` 给 Client Component）

---

### Task 5: （可选）项目详情页展示支付状态

**Files:**
- Modify: `lib/idea-actions.ts`
- Modify: `app/idea/[id]/result/page.tsx`

**Step 1: getIdeaWithAssessment select 增加 payment 字段**
- `price/paymentStatus/paidAt`

**Step 2: 详情页顶部展示 PaymentStatusWithDialog**

---

### Task 6: 质量检查

Run: `npm run lint`  
Expected: 无 ESLint 错误。

