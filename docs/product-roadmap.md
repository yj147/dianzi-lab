# 产品路线图

**生成日期**: 2026-01-30
**审视者**: Allen (产品之神)
**状态**: 待实现

---

## 产品定位

**一句话本质**：创作者接收开发需求的入口。

用户从 blog 来 → 提交需求 → 评估筛选 → 报价沟通 → 支付 → 开发 → 交付

---

## 待删除

| 路径 | 原因 |
|------|------|
| `/dashboard/favorites` | 功能未定义，占位页 |
| `/dashboard/settings` | 功能未定义，占位页 |
| `/validator` | PRD 未定义，独立评估工具无必要 |

---

## 待实现

### 1. 首页文案优化

**优先级**: P0

**改动点**:
- Hero 区「筹备中 // COMING SOON」→「开放提交 // NOW OPEN」
- 底部「服务正在筹备中」→「准备好构建了吗？」
- 底部「我们正在打磨最后的细节」→「从一个想法开始，让我们帮你变成现实。」
- CTA「预约首批名额」→「提交你的想法」

---

### 2. 消息系统

**优先级**: P1

**用户端 `/dashboard/inbox`**:
- 消息列表（按时间倒序）
- 每条消息：发送者、内容、时间、关联项目
- 只读，用户不回复

**管理端 `/admin/ideas/[id]`**:
- 项目详情页新增「发送消息」入口
- 消息输入框 + 发送按钮
- 历史消息记录

**数据模型**:
```prisma
model Message {
  id        String   @id @default(cuid())
  content   String
  ideaId    String
  idea      Idea     @relation(fields: [ideaId], references: [id])
  createdAt DateTime @default(now())
}
```

---

### 3. 案例详情页

**优先级**: P1

**新增路由 `/idea/[id]`**:
- 公开可访问（已完成状态的案例）
- 展示内容：
  - 标题、描述、标签
  - 项目截图/预览图
  - 技术栈
  - 开发周期
  - 外部链接（上线地址）

**扩展 Idea 数据模型**:
```prisma
model Idea {
  // 现有字段...

  // 新增字段
  screenshots   String[]  // 截图 URL 数组
  techStack     String[]  // 技术栈标签
  duration      String?   // 开发周期（如 "2周"、"1个月"）
  externalUrl   String?   // 外部链接
  price         Decimal?  // 报价金额
}
```

**管理后台补充**:
- `/admin/ideas/[id]` 新增案例信息编辑表单

---

### 4. 文件交付功能

**优先级**: P2

**功能**:
- 管理员上传交付文件（源代码包、设计稿、文档等）
- 用户下载交付文件

**存储方案**: Supabase Storage

**数据模型**:
```prisma
model Deliverable {
  id        String   @id @default(cuid())
  name      String   // 文件名
  url       String   // 存储 URL
  size      Int      // 文件大小（字节）
  ideaId    String
  idea      Idea     @relation(fields: [ideaId], references: [id])
  createdAt DateTime @default(now())
}
```

**用户端**:
- 在 `/dashboard` 项目卡片或 `/idea/[id]` 详情页展示下载入口
- 仅已完成项目可下载

**管理端**:
- `/admin/ideas/[id]` 新增文件上传区域
- 支持多文件上传
- 显示已上传文件列表，支持删除

---

### 5. 支付功能

**优先级**: P2

**Phase 1: 二维码支付（国内）**

流程：
1. 管理后台给项目设置价格
2. 用户在 inbox 或项目详情看到报价
3. 点击「支付」展示微信/支付宝二维码（静态收款码）
4. 用户扫码付款
5. 管理后台手动确认「已付款」

**数据模型变更**:
```prisma
enum PaymentStatus {
  PENDING     // 待支付
  PAID        // 已支付
  REFUNDED    // 已退款
}

model Idea {
  // 现有字段...
  price         Decimal?       // 报价金额
  paymentStatus PaymentStatus  @default(PENDING)
  paidAt        DateTime?      // 支付时间
}
```

**配置**:
- 环境变量存储收款码图片 URL
- `NEXT_PUBLIC_WECHAT_PAY_QR`
- `NEXT_PUBLIC_ALIPAY_QR`

**Phase 2: Stripe（海外，后期）**

- 接入 Stripe Checkout
- 自动回调确认支付状态
- 支持国际信用卡

---

## 实现顺序建议

| 阶段 | 内容 | 理由 |
|------|------|------|
| **Phase 1** | 删除无用页面 + 首页文案 | 快速清理，消除「未上线」感 |
| **Phase 2** | 消息系统 | 建立沟通渠道，闭环用户体验 |
| **Phase 3** | 案例详情页 | 展示能力，建立信任 |
| **Phase 4** | 支付功能 | 商业闭环 |
| **Phase 5** | 文件交付 | 完整交付体验 |

---

## 不做的事情

| 功能 | 原因 |
|------|------|
| 实时聊天 | 场景不需要，异步消息足够 |
| 用户回复消息 | 保持简单，有问题重新提交 |
| 自动支付回调（Phase 1） | 先跑通流程，量大了再接 |
| 邮件通知 | PRD 明确排除 |
| 评论/投票 | PRD 明确排除 |

---

## 数据模型变更汇总

```prisma
// 新增 Message 表
model Message {
  id        String   @id @default(cuid())
  content   String
  ideaId    String
  idea      Idea     @relation(fields: [ideaId], references: [id])
  createdAt DateTime @default(now())
}

// 新增 Deliverable 表
model Deliverable {
  id        String   @id @default(cuid())
  name      String
  url       String
  size      Int
  ideaId    String
  idea      Idea     @relation(fields: [ideaId], references: [id])
  createdAt DateTime @default(now())
}

// 新增 PaymentStatus 枚举
enum PaymentStatus {
  PENDING
  PAID
  REFUNDED
}

// 扩展 Idea 表
model Idea {
  // 现有字段保持不变

  // 新增字段
  screenshots   String[]
  techStack     String[]
  duration      String?
  externalUrl   String?
  price         Decimal?
  paymentStatus PaymentStatus @default(PENDING)
  paidAt        DateTime?

  // 新增关系
  messages      Message[]
  deliverables  Deliverable[]
}
```

---

_由 Allen 审视，Bambi 确认。_
