# API 手册

## 概述
本项目不提供对外 REST API；主要交互通过 Next.js Server Actions（表单提交）完成。本文档将“可调用的服务边界”按模块记录，便于追踪输入/输出与权限约束。

## 认证方式
- **会话载体**: `session` Cookie（httpOnly，`sameSite=lax`，生产环境 `secure`）
- **令牌内容**: HS256 JWT（`jose`），默认 7 天过期，payload 关键字段：`sub` / `email` / `role`
- **路由保护**:
  - `middleware.ts`: `/dashboard/*` 与 `/admin/*` 未登录重定向到 `/login`
  - `app/admin/layout.tsx`: 仅 `ADMIN` 可访问，否则 `redirect('/dashboard')`


## 接口列表

### Auth

#### [SERVER ACTION] `registerUser(formData)`
**文件:** `app/(auth)/register/actions.ts`  
**输入(FormData):** `email` / `password` / `confirmPassword`  
**输出:** `{ success: true }` 或 `{ success: false; error; field? }`  
**行为:** 创建用户后 `redirect('/login')`；邮箱唯一冲突映射为可读错误。

#### [SERVER ACTION] `loginUser(formData)`
**文件:** `app/(auth)/login/actions.ts`  
**输入(FormData):** `email` / `password` / `callbackUrl`（可选）  
**输出:** `{ success: true }` 或 `{ success: false; error; field? }`  
**行为:** 校验密码后签发 JWT、写入 `session` Cookie，并 `redirect` 到安全的 `callbackUrl`。  
**安全:** 防 open redirect（仅允许以 `/` 开头且禁止 `//` 与反斜杠）；托管环境阻断 `ADMIN` 使用已知默认口令 `admin123`。

#### [SERVER ACTION] `logout()`
**文件:** `lib/auth-actions.ts`  
**行为:** 清除 `session` Cookie，并 `redirect('/login')`。


### Ideas

#### [SERVER ACTION] `submitIdea(formData)`
**文件:** `app/(submit)/submit/actions.ts`  
**权限:** 登录用户  
**输入(FormData):** `title` / `description` / `tags`（多选）  
**输出:** `{ success: true; ideaId }` 或 `{ success: false; error; field? }`  
**行为:** 创建点子，默认 `status=PENDING`、`isDeleted=false`。


### Admin / Ideas

#### [SERVER ACTION] `updateIdeaStatus(ideaId, status)`
**文件:** `app/admin/ideas/actions.ts`  
**权限:** `ADMIN`（不满足会抛 `Unauthorized`）  
**行为:** 更新点子状态；调用 `revalidateTag('completed-ideas')` 使首页缓存失效。

#### [SERVER ACTION] `moveToTrash(ideaId)`
**文件:** `app/admin/ideas/actions.ts`  
**权限:** `ADMIN`  
**行为:** 软删除（`isDeleted=true`）；调用 `revalidateTag('completed-ideas')`。


### Admin / Trash

#### [SERVER ACTION] `restoreIdea(ideaId)`
**文件:** `app/admin/trash/actions.ts`  
**权限:** `ADMIN`  
**行为:** 从垃圾箱恢复（`isDeleted=false`）；调用 `revalidateTag('completed-ideas')`。

#### [SERVER ACTION] `permanentDeleteIdea(ideaId)`
**文件:** `app/admin/trash/actions.ts`  
**权限:** `ADMIN`  
**行为:** 永久删除（`DELETE`）；调用 `revalidateTag('completed-ideas')`。


### Admin / Users

#### [SERVER QUERY] `getUsers()`
**文件:** `app/admin/users/_queries.ts`  
**权限:** 由管理后台布局统一保证 `ADMIN`。  
**输出:** 用户列表（含点子数量聚合）。

