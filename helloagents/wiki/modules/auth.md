# auth

## 目的
提供邮箱密码注册/登录/退出，以及基于 JWT Cookie 的会话管理与角色识别。

## 模块概述
- **职责:** 注册、登录、会话写入与读取（`session` Cookie）
- **状态:** ✅稳定
- **最后更新:** 2026-01-24

## 规范

### 需求: 用户注册与登录（US-2 / F2）
**模块:** auth  
用户通过邮箱密码注册与登录；登录态需持久化（刷新不丢失）。

#### 场景: 注册成功
前置条件：邮箱未注册、密码≥6位、确认密码一致  
- 注册成功后跳转到 `/login`

#### 场景: 登录成功
前置条件：账号存在、密码正确  
- 写入 `session` Cookie
- 默认跳转到 `/dashboard`（管理员默认 `/admin`）

### 需求: 管理员登录（US-3）
**模块:** auth  
管理员账号通过种子数据预设；生产环境必须通过环境变量注入口令，禁止默认口令。

#### 场景: 管理员默认落地页
- 管理员登录后默认进入 `/admin`

## API接口
- [SERVER ACTION] `registerUser(formData)`（`app/(auth)/register/actions.ts`）
- [SERVER ACTION] `loginUser(formData)`（`app/(auth)/login/actions.ts`）
- [SERVER ACTION] `logout()`（`lib/auth-actions.ts`）
- 会话工具：`signJWT/verifyJWT/getSession`（`lib/auth.ts`）

## 数据模型
### User
| 字段 | 类型 | 说明 |
|------|------|------|
| `email` | string | 唯一 |
| `passwordHash` | string | bcrypt hash |
| `role` | `USER|ADMIN` | 访问控制 |

## 依赖
- `lib/auth.ts`
- `lib/users.ts`
- `prisma/schema.prisma`

## 变更历史
- （暂无）

