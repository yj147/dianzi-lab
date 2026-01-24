# 架构设计

## 总体架构
```mermaid
flowchart TD
    Browser[Browser] --> Next[Next.js App Router]
    Next --> RSC[Server Components / Server Actions]
    RSC --> Prisma[Prisma Client]
    Prisma --> DB[(Supabase Postgres)]
    Next <-->|Cookie: session (JWT)| Browser
```

## 技术栈
- **应用框架**: Next.js 14（App Router）
- **交互形态**: Server Actions（表单提交）+ Server Components（数据查询）
- **数据访问**: Prisma
- **数据库**: Supabase PostgreSQL
- **认证**: HS256 JWT（`jose`）+ `session` httpOnly Cookie
- **样式**: Tailwind CSS + shadcn/ui

## 核心流程
```mermaid
sequenceDiagram
    participant U as User
    participant N as Next.js
    participant A as Server Action
    participant P as Prisma
    participant D as Postgres

    U->>N: 提交注册表单
    N->>A: registerUser(FormData)
    A->>P: prisma.user.create()
    P->>D: INSERT user
    A->>N: redirect(/login)

    U->>N: 提交登录表单
    N->>A: loginUser(FormData)
    A->>P: prisma.user.findUnique()
    P->>D: SELECT user
    A->>N: set cookie + redirect(callbackUrl)

    U->>N: 浏览首页（已完成点子）
    N->>P: prisma.idea.findMany(status=COMPLETED)
    P->>D: SELECT ideas
    N-->>U: 渲染卡片列表（含筛选/搜索）
```

```mermaid
sequenceDiagram
    participant Admin as Admin
    participant N as Next.js
    participant A as Server Action
    participant P as Prisma
    participant D as Postgres

    Admin->>N: 在后台修改点子状态
    N->>A: updateIdeaStatus(ideaId,status)
    A->>P: prisma.idea.update()
    P->>D: UPDATE idea
    A->>N: revalidateTag(completed-ideas)
    N-->>Admin: 列表刷新/首页缓存失效
```

## 重大架构决策
完整的 ADR 存储在各变更的 `how.md` 中，本章节提供索引。

| adr_id | title | date | status | affected_modules | details |
|--------|-------|------|--------|------------------|---------|
| （暂无） |  |  |  |  |  |

