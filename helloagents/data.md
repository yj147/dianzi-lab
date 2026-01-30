# 数据模型

## 概述

数据层使用 Supabase PostgreSQL，应用侧通过 Prisma 访问。点子（Idea）与用户（User）为一对多关系；删除采用软删除（`isDeleted`）。

## 数据表/模型

### User

**描述:** 用户账户与角色信息（管理员/普通用户）。

| 字段名         | 类型       | 约束 | 说明                        |
| -------------- | ---------- | ---- | --------------------------- |
| `id`           | `String`   | 主键 | CUID                        |
| `email`        | `String`   | 唯一 | 统一按小写存储              |
| `passwordHash` | `String`   | 非空 | 映射到数据库列名 `password` |
| `role`         | `Role`     | 非空 | 默认 `USER`                 |
| `createdAt`    | `DateTime` | 非空 | 创建时间                    |

**关联关系:**

- `User (1) -> (N) Idea`

### Idea

**描述:** 用户提交的点子，管理员推动其从待审核到完成。

| 字段名        | 类型         | 约束 | 说明                     |
| ------------- | ------------ | ---- | ------------------------ |
| `id`          | `String`     | 主键 | CUID                     |
| `title`       | `String`     | 非空 | 最大 50 字符             |
| `description` | `String`     | 非空 | 最大 1000 字符           |
| `status`      | `IdeaStatus` | 非空 | 默认 `PENDING`           |
| `tags`        | `String[]`   |      | 多选标签（应用层约束）   |
| `userId`      | `String`     | 索引 | 外键指向 `User.id`       |
| `isDeleted`   | `Boolean`    | 非空 | 软删除标记，默认 `false` |
| `createdAt`   | `DateTime`   | 非空 | 创建时间                 |
| `updatedAt`   | `DateTime`   | 非空 | 更新时间                 |

**索引:**

- `@@index([userId])`
- `@@index([status])`

**关联关系:**

- `Idea (N) -> (1) User`

### 枚举

#### Role

- `USER`
- `ADMIN`

#### IdeaStatus

- `PENDING`
- `APPROVED`
- `IN_PROGRESS`
- `COMPLETED`

## 业务规则补充

- **状态流转**: `PENDING → APPROVED → IN_PROGRESS → COMPLETED`
- **标签集合（应用层）**: `工具 / 效率 / 娱乐 / 学习 / 其他`
- **软删除**: `isDeleted=true` 视为进入垃圾箱；仅管理员可恢复或永久删除。

