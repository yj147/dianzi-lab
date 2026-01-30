# 项目上下文

## 1. 基本信息

```yaml
名称: Bambi Lab Idea
描述: 用户提交点子 → 管理员审核推进 → 首页展示已完成案例的全栈平台
类型: Web应用
状态: 稳定
```

## 2. 技术上下文

```yaml
语言: TypeScript
框架: Next.js 14（App Router）
包管理器: npm
构建工具: Next.js（`next build`）+ Prisma（构建前 `prisma generate`）
```

### 主要依赖
| 依赖 | 版本 | 用途 |
|------|------|------|
| `next` | `14.2.35` | Web 框架（App Router） |
| `react` / `react-dom` | `^18` | UI 渲染 |
| `prisma` / `@prisma/client` | `^6.2.0` | 数据访问 / ORM |
| `@supabase/supabase-js` | `^2.93.3` | Supabase 客户端 |
| `tailwindcss` | `^3.4.1` | 样式 |
| `jose` | `^6.1.3` | JWT |
| `bcrypt` | `^5.1.1` | 密码哈希 |
| `jest` | `^30.2.0` | 单元测试 |

## 3. 项目概述

### 核心功能
- 首页展示已完成点子（搜索/标签筛选/空状态引导）
- 邮箱密码注册/登录/退出（JWT Cookie 会话）
- 提交点子（标题/描述/标签）
- 用户中心查看“我的点子”进度（筛选/搜索）
- 管理后台：点子审核推进、状态流转、垃圾箱、用户列表

### 项目边界
```yaml
范围内:
  - 首页展示已完成点子
  - 邮箱密码注册/登录
  - 点子提交
  - 用户中心进度查看
  - 管理后台审核与状态流转
  - 垃圾箱（软删除/恢复/永久删除）
范围外:
  - 点子编辑/删除（用户端）
  - 邮件通知
  - 评论/投票
  - 附件上传
  - 多语言
```

## 4. 开发约定

### 代码规范
```yaml
命名风格: 组件 PascalCase，hooks useXxx
文件命名: 与现有目录保持一致（按模块分组，不强行统一）
目录组织: app/（路由与页面）+ components/ + lib/ + prisma/
```

### 错误处理
```yaml
错误码格式: 不做统一错误码；Server Action 返回结构化结果（success/error/field）
日志级别: 未强制；遵循“最小泄露 + 可定位”，禁止输出敏感信息
```

### 测试要求
```yaml
测试框架: Jest + Testing Library
覆盖率要求: 未硬性约束（以 tests/dianzi-test-cases.md 为验收基准）
测试文件位置: tests/、__tests__/（已有）；新增测试按仓库约定归入 _tests_/
```

### Git规范
```yaml
分支策略: 未强制（按团队流程）
提交格式: 未强制（建议简洁可追溯）
```

## 5. 当前约束（源自历史决策）

> 当前尚无归档方案包；以下约束直接来自仓库 SSOT 文档/实现约束。

| 约束 | 原因 | 决策来源 |
|------|------|---------|
| PRD 驱动：未在 PRD 定义的功能 = Scope Creep | 避免跑偏，保证可验收 | [docs/dianzi-prd.md](../docs/dianzi-prd.md) |
| UI 严格遵循 Design Tokens | 视觉一致与可维护性 | [docs/ui-style-guide.md](../docs/ui-style-guide.md) |
| `/admin/*` 仅 `ADMIN` 可访问 | 权限隔离 | [middleware.ts](../middleware.ts) |

## 6. 已知技术债务（可选）

（暂无）

