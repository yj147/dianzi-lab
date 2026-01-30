# dashboard

## 目的

为登录用户提供“我的点子”列表与进度查看，支持搜索与状态筛选。

## 模块概述

- **职责:** 登录态校验、用户点子列表、筛选与统计展示
- **状态:** ✅稳定
- **最后更新:** 2026-01-24

## 规范

### 需求: 用户查看点子进度（US-7 / F4）

**模块:** dashboard  
用户中心展示“我的点子”列表与状态；按提交时间倒序排列。

#### 场景: 过滤已上线/未上线

- `status=completed` → 仅 `COMPLETED`
- `status=incubating` → 非 `COMPLETED`

#### 场景: 搜索

- `q` 支持对标题/描述做不区分大小写的 contains 查询（长度截断防滥用）

## API接口

- 页面数据读取（Server Component）：`app/(dashboard)/dashboard/page.tsx`

## 数据模型

### Idea

| 字段        | 类型     | 说明           |
| ----------- | -------- | -------------- |
| `userId`    | string   | 仅查询当前用户 |
| `isDeleted` | boolean  | 过滤垃圾箱     |
| `createdAt` | datetime | 倒序排序       |

## 依赖

- `lib/auth.ts`（`getSession`）
- `lib/db.ts`（Prisma）
- `middleware.ts`（路由保护）

## 变更历史

- （暂无）

