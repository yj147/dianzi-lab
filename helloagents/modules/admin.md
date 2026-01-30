# admin

## 目的

为管理员提供点子管理（筛选/状态流转/软删除）、垃圾箱（恢复/永久删除）与用户列表视图。

## 模块概述

- **职责:** 管理端权限控制、点子列表与操作、用户列表、垃圾箱
- **状态:** ✅稳定
- **最后更新:** 2026-01-24

## 规范

### 需求: 管理后台管理点子（US-5 / F5）

**模块:** admin  
管理员可按状态筛选点子，并执行状态修改与软删除。

#### 场景: 访问控制

- 非管理员访问 `/admin/*` 必须被拒绝（重定向到 `/dashboard`）

#### 场景: 状态修改

- 修改后需触发首页缓存失效（`revalidateTag('completed-ideas')`）

### 需求: 用户管理（US-5）

**模块:** admin  
展示用户列表与点子数量聚合。

## API接口

- [SERVER ACTION] `updateIdeaStatus` / `moveToTrash`（`app/admin/ideas/actions.ts`）
- [SERVER ACTION] `restoreIdea` / `permanentDeleteIdea`（`app/admin/trash/actions.ts`）
- [SERVER QUERY] `getUsers()`（`app/admin/users/_queries.ts`）

## 数据模型

### User / Idea

| 字段             | 类型    | 说明     |
| ---------------- | ------- | -------- |
| `User.role`      | `Role`  | 访问控制 |
| `Idea.isDeleted` | boolean | 垃圾箱   |

## 依赖

- `lib/auth.ts`（`getSession`）
- `lib/db.ts`
- `middleware.ts`

## 变更历史

- （暂无）

