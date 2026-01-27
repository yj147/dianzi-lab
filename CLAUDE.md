# CLAUDE.md - Bambi Lab Idea 仓库指南

## 项目概述

Bambi Lab Idea 是一个软件开发服务平台：用户提交点子 → 管理员审核 → 推进开发 → 首页展示已完成案例。

**技术栈**: Next.js 14 (App Router) + Prisma + Supabase (PostgreSQL) + Tailwind CSS + shadcn/ui

## 文档基准 (SSOT)

| 文档 | 用途 |
|------|------|
| `docs/dianzi-prd.md` | 需求与验收标准。功能必须对照 PRD，禁止 Scope Creep。 |
| `docs/ui-style-guide.md` | 视觉规范（Design Tokens、玻璃态、间距）。禁止凭感觉调色。 |
| `tests/dianzi-test-cases.md` | 测试用例。测试代码应对应 TC 编号。 |

## 项目结构

```
app/
├── (main)/           # 公开路由组
│   ├── page.tsx      # 首页（Hero + 已完成点子）
│   ├── login/        # 登录
│   ├── register/     # 注册
│   ├── submit/       # 提交点子（需登录）
│   └── dashboard/    # 用户中心（需登录）
├── admin/            # 管理后台（需 ADMIN 角色）
│   ├── page.tsx      # 仪表板统计
│   ├── ideas/        # 点子管理
│   ├── users/        # 用户管理
│   └── trash/        # 垃圾箱
├── layout.tsx        # 根布局
└── globals.css       # 全局样式变量

components/
├── Hero.tsx          # 首页 Hero 区
├── IdeaCard.tsx      # 点子卡片
├── StatusBadge.tsx   # 状态标签
├── NavbarClient.tsx  # 导航栏
├── EmptyState.tsx    # 空状态
└── ui/               # shadcn/ui 组件（alert-dialog, dropdown-menu, toast, tooltip）

lib/
├── auth.ts           # JWT 签发/验证 (jose)、Session Cookie 管理
├── db.ts             # Prisma Client 实例
├── users.ts          # 用户查询
├── constants.ts      # 常量（标签列表等）
└── utils.ts          # cn() 等工具函数

middleware.ts         # 路由保护：/dashboard/* 和 /admin/* 需登录，/admin/* 需 ADMIN

prisma/
├── schema.prisma     # User + Idea 模型
└── seed.ts           # 管理员种子 admin@dianzi.com / admin123
```

## 数据模型

```prisma
model User {
  id, email (unique), passwordHash, role (USER|ADMIN), createdAt, ideas[]
}

model Idea {
  id, title (max 50), description (max 1000), status, tags[], userId, isDeleted, createdAt, updatedAt
}

enum IdeaStatus { PENDING → APPROVED → IN_PROGRESS → COMPLETED }
```

## 常用命令

```bash
# 开发
npm run dev           # 启动开发服务器 (localhost:3000)
npm run build         # 生产构建
npm run start         # 启动生产服务器

# 质量
npm run lint          # ESLint 检查
npm run format        # Prettier 格式化

# 测试
npm run test          # 运行 Jest 测试
npm run test:coverage # 运行测试并生成覆盖率报告

# 数据库 (Supabase PostgreSQL)
npx prisma generate   # 生成 Prisma Client
npx prisma db push    # 推送 Schema 到数据库
npx prisma db seed    # 执行种子脚本
npx prisma migrate dev --name <name>  # 创建迁移
```

## 认证机制

- **JWT**: 使用 `jose` 库，HS256 算法，7 天过期
- **Cookie**: `session`，httpOnly，sameSite=lax
- **Middleware**: 保护 `/dashboard/*` 和 `/admin/*`
- **角色**: `USER` 只能访问用户中心；`ADMIN` 可访问管理后台
- **种子账号**: `admin@dianzi.com` / `admin123`

## 代码规范

- **路径别名**: `@/components/...`, `@/lib/...`
- **命名**: 文件 kebab-case，组件 PascalCase，hooks `use...`
- **CSS**: 严格遵循 `docs/ui-style-guide.md`，使用 Design Tokens
- **注释**: 中文，独立成行，只在意图不明显时添加

## 核心原则

1. **KISS/YAGNI**: 只解决真实问题，拒绝过度设计
2. **PRD 驱动**: 未在 PRD 定义的功能 = Scope Creep
3. **零破坏性**: 禁止破坏现有功能/API
4. **中文交流**: 代码术语保持英文，其余用中文

---

## 编程原则

### 可读性优先
代码是写给人看的，只是恰好机器可以执行。

### DRY
避免复制，通过抽象复用逻辑。

### 高内聚，低耦合
相关功能放一起，模块间依赖越少越好。

### 避免过度工程化
- 严格围绕当前需求解决真实问题
- 架构保持 Next.js + Supabase 全栈，不引入无关微服务
- 功能开发围绕"单一作者/管理员"的前提

### 本地开发优先
- 日常开发在 Supabase CLI 本地环境完成
- 结构变更：本地完成 → `supabase db diff -f migration_name` → 版本控制

---

## 执行指令

### 语言规范
- 代码实体与技术术语保持英文
- 代码注释用中文，独立成行，禁止行尾注释

### 批判性反馈
- 主动识别用户指令与仓库规范的冲突
- 以技术事实为准，必要时直接反驳不合理方案

### 开发策略
- 不允许"绕过"编译/逻辑错误，必须根治
- 依赖冲突找兼容路径，不简单降级
- 严禁占位符、虚假数据伪装完成度

### 代码维护
- 新测试必须归入 `_tests_/` 目录，不在根目录乱建
- 任务结束优先更新已有文档，而不是新建"总结文档"

> **例外**：跨会话复杂任务允许创建状态文件（如 `progress.txt`），但禁止无关的"额外总结文档"。
