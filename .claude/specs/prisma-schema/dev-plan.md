# Prisma Schema - 开发计划

## 概述
配置 Prisma ORM 并定义用户管理和想法跟踪的数据库模型，包括 User、Idea 模型及其关系。

## 任务分解

### Task 1: Prisma 初始化与环境配置
- **ID**: task-1
- **type**: quick-fix
- **Description**: 安装 Prisma 相关依赖，初始化 Prisma 项目结构，配置数据库连接环境变量
- **File Scope**: package.json, .env, .env.example, prisma/
- **Dependencies**: None
- **Test Command**: `npx prisma validate`
- **Test Focus**:
  - Prisma CLI 可用
  - 环境变量配置正确
  - Prisma 目录结构创建成功

### Task 2: 数据库模型定义
- **ID**: task-2
- **type**: default
- **Description**: 在 schema.prisma 中定义 User 和 Idea 模型，配置 Role 和 IdeaStatus 枚举，设置一对多关系和索引，启用 omitApi 预览功能
- **File Scope**: prisma/schema.prisma
- **Dependencies**: depends on task-1
- **Test Command**: `npx prisma validate`
- **Test Focus**:
  - User 模型包含所有必需字段（id, email, password, role, createdAt）
  - Idea 模型包含所有必需字段（id, title, description, status, tags, userId, isDeleted, createdAt, updatedAt）
  - Role 枚举包含 USER 和 ADMIN
  - IdeaStatus 枚举包含 PENDING, APPROVED, IN_PROGRESS, COMPLETED
  - User-Idea 关系正确配置
  - 索引正确设置在 userId 和 status 字段
  - generator 配置包含 omitApi 预览功能
  - Schema 语法验证通过

### Task 3: Prisma Client 生成与验证
- **ID**: task-3
- **type**: quick-fix
- **Description**: 生成 Prisma Client 并验证 omit 功能可用，确认类型定义正确生成
- **File Scope**: node_modules/.prisma/client/, node_modules/@prisma/client/
- **Dependencies**: depends on task-2
- **Test Command**: `npx prisma validate && npx prisma generate`
- **Test Focus**:
  - Prisma Client 生成成功
  - 类型定义包含 User 和 Idea 模型
  - omitApi 功能可用（可通过 TypeScript 类型检查验证）
  - 无生成错误或警告

## 验收标准
- [ ] Prisma 依赖安装完成（prisma, @prisma/client）
- [ ] schema.prisma 文件包含 User 和 Idea 模型定义
- [ ] Role 枚举包含 USER 和 ADMIN
- [ ] IdeaStatus 枚举包含 PENDING, APPROVED, IN_PROGRESS, COMPLETED
- [ ] User-Idea 一对多关系正确配置
- [ ] password 字段支持 omit 功能（omitApi 预览功能已启用）
- [ ] `npx prisma validate` 命令执行成功
- [ ] `npx prisma generate` 命令执行成功且无错误
- [ ] 数据库连接环境变量（DATABASE_URL, DIRECT_URL）已配置

## 技术要点
- **Prisma 预览功能**: 使用 `previewFeatures = ["omitApi"]` 启用 omit 功能，允许在查询时排除敏感字段（如 password）
- **数据库提供商**: 使用 PostgreSQL，需要配置 DATABASE_URL（连接池）和 DIRECT_URL（直接连接）
- **字段约束**: title 限制 50 字符，description 限制 1000 字符，通过 `@db.VarChar()` 实现
- **默认值策略**:
  - User.role 默认为 USER
  - Idea.status 默认为 PENDING
  - Idea.isDeleted 默认为 false（软删除标记）
  - 时间戳字段使用 `@default(now())` 和 `@updatedAt`
- **性能优化**: 在 Idea 表的 userId 和 status 字段上创建索引以加速查询
- **ID 生成**: 使用 `@default(cuid())` 生成唯一标识符，适合分布式系统
