# ideas

## 目的

实现点子从“提交”到“审核推进”再到“完成展示”的全生命周期（含软删除与恢复）。

## 模块概述

- **职责:** 点子提交、状态流转、垃圾箱操作、缓存失效
- **状态:** ✅稳定
- **最后更新:** 2026-01-24

## 规范

### 需求: 用户提交点子（US-4 / F3）

**模块:** ideas  
登录用户可提交标题/描述/标签；提交后默认状态为待审核。

#### 场景: 正常提交

前置条件：已登录

- 校验：标题≤50、描述≤1000、标签在预设集合内
- 创建后 `status=PENDING`

### 需求: 管理后台管理点子（US-5）

**模块:** ideas  
管理员可按状态筛选，并执行状态流转；可软删除进入垃圾箱。

#### 场景: 状态流转

- `PENDING → APPROVED → IN_PROGRESS → COMPLETED`
- 状态变化后首页展示应及时更新

#### 场景: 垃圾箱

- 软删除：`isDeleted=true`
- 恢复：`isDeleted=false`
- 永久删除：记录应从数据库移除

## API接口

- [SERVER ACTION] `submitIdea(formData)`（`app/(submit)/submit/actions.ts`）
- [SERVER ACTION] `updateIdeaStatus(ideaId,status)`（`app/admin/ideas/actions.ts`）
- [SERVER ACTION] `moveToTrash(ideaId)`（`app/admin/ideas/actions.ts`）
- [SERVER ACTION] `restoreIdea(ideaId)`（`app/admin/trash/actions.ts`）
- [SERVER ACTION] `permanentDeleteIdea(ideaId)`（`app/admin/trash/actions.ts`）

## 数据模型

### Idea

| 字段        | 类型         | 说明   |
| ----------- | ------------ | ------ |
| `status`    | `IdeaStatus` | 状态机 |
| `isDeleted` | boolean      | 垃圾箱 |
| `userId`    | string       | 作者   |

## 依赖

- `lib/auth.ts`（会话/角色）
- `lib/db.ts`
- `next/cache`（`revalidateTag('completed-ideas')`）

## 变更历史

- （暂无）
