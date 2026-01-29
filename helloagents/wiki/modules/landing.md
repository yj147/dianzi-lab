# landing

## 目的

对外展示平台定位与已完成点子（工具）列表，支持搜索与标签筛选，并提供进入提交/注册/登录的入口。

## 模块概述

- **职责:** 首页 Hero、已完成点子列表（含筛选/搜索/空状态）
- **状态:** ✅稳定
- **最后更新:** 2026-01-24

## 规范

### 需求: 首页展示已完成点子（US-1 / US-6 / F1）

**模块:** landing  
首页需展示 `COMPLETED` 状态点子卡片，按完成时间倒序；无数据时展示空状态引导。

#### 场景: 首页有已完成点子

- 展示卡片网格：标题、描述摘要、标签
- 支持 `q`（搜索）与 `tag`（标签）筛选

#### 场景: 首页空状态

- 展示引导文案与跳转到 `/submit` 的按钮

## API接口

- 数据读取：`prisma.idea.findMany(status=COMPLETED, isDeleted=false)`（`app/(main)/page.tsx`）
- 缓存策略：`unstable_cache(..., tags=['completed-ideas'], revalidate=60)`（`app/(main)/page.tsx`）

## 数据模型

### Idea

| 字段        | 类型         | 说明               |
| ----------- | ------------ | ------------------ |
| `status`    | `IdeaStatus` | 仅展示 `COMPLETED` |
| `tags`      | `string[]`   | 用于筛选           |
| `isDeleted` | boolean      | 软删除过滤         |

## 依赖

- `components/Hero.tsx`
- `components/IdeaCard.tsx`
- `lib/db.ts`

## 变更历史

- （暂无）
