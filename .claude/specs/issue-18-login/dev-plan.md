# 用户登录页 - 开发计划

## 概述
实现基于 JWT 的用户登录功能，包含登录表单、会话管理、鉴权中间件和退出登录。

## 任务分解

### Task 1: 基础鉴权层（JWT+Cookie）与用户查询
- **ID**: task-1
- **type**: default
- **Description**: 引入 jose 库；实现 lib/auth.ts（sign/verify JWT、set/clear cookie、getSession）；给 lib/users.ts 增加 getUserByEmail 方法用于登录凭据验证
- **File Scope**:
  - Modify: package.json（新增依赖 jose）
  - Create: lib/auth.ts
  - Modify: lib/users.ts
  - Modify: .env.example（新增 JWT_SECRET= 占位）
  - Create: __tests__/lib/auth.test.ts
- **Dependencies**: None
- **Test Command**: `npm test -- __tests__/lib/auth.test.ts --coverage --collectCoverageFrom='lib/auth.ts' --collectCoverageFrom='lib/users.ts'`
- **Test Focus**:
  - JWT 签名和验证（有效/过期/篡改 token）
  - Cookie 设置和清除（httpOnly、sameSite、secure 属性）
  - getSession 从 cookie 中提取会话（有效/无效/缺失）
  - getUserByEmail 查询用户（存在/不存在）
  - 密码验证（正确/错误密码）

### Task 2: /login 页面 + 表单 + 登录 Server Action
- **ID**: task-2
- **type**: ui
- **Description**: 将占位页改为 email/password 表单（client component）；客户端用 zod 做邮箱格式校验；server action 校验凭据、成功写 cookie 并 redirect('/dashboard')，失败返回"邮箱或密码错误"
- **File Scope**:
  - Modify: app/login/page.tsx
  - Create: app/login/LoginForm.tsx
  - Create: app/login/schema.ts
  - Create: app/login/actions.ts
  - Modify: __tests__/app/login.test.tsx
  - Create: __tests__/app/login/actions.test.ts
- **Dependencies**: depends on task-1
- **Test Command**: `npm test -- __tests__/app/login.test.tsx __tests__/app/login/actions.test.ts --coverage --collectCoverageFrom='app/login/**/*.{ts,tsx}'`
- **Test Focus**:
  - 表单渲染（email/password 字段、提交按钮）
  - 客户端验证（邮箱格式、必填字段）
  - Server action 成功场景（正确凭据 → 设置 cookie → redirect）
  - Server action 失败场景（错误凭据 → 返回错误消息）
  - 错误消息显示（不泄露用户是否存在）

### Task 3: /dashboard 占位页（并做最小鉴权）
- **ID**: task-3
- **type**: ui
- **Description**: 新增 app/dashboard/page.tsx；若无有效 session，则 redirect('/login')；否则显示占位内容（欢迎消息 + 用户邮箱）
- **File Scope**:
  - Create: app/dashboard/page.tsx
  - Create: __tests__/app/dashboard.test.tsx
- **Dependencies**: depends on task-1
- **Test Command**: `npm test -- __tests__/app/dashboard.test.tsx --coverage --collectCoverageFrom='app/dashboard/**/*.{ts,tsx}'`
- **Test Focus**:
  - 未登录用户访问 → redirect 到 /login
  - 已登录用户访问 → 显示占位内容
  - 显示用户邮箱信息
  - Session 过期处理

### Task 4: 全局 Header 增加退出登录
- **ID**: task-4
- **type**: ui
- **Description**: 将 components/Navbar.tsx 拆为 server wrapper + client 子组件；退出用 form action 触发 server action 清 cookie 并 redirect('/login')；根据登录状态显示不同按钮（未登录显示"登录"，已登录显示"退出"）
- **File Scope**:
  - Modify: components/Navbar.tsx（改为 server wrapper）
  - Create: components/NavbarClient.tsx
  - Create: lib/auth-actions.ts（logout server action）
  - Modify: __tests__/components/Navbar.test.tsx
- **Dependencies**: depends on task-1
- **Test Command**: `npm test -- __tests__/components/Navbar.test.tsx --coverage --collectCoverageFrom='components/Navbar*.tsx' --collectCoverageFrom='lib/auth-actions.ts'`
- **Test Focus**:
  - 未登录状态显示"登录"按钮
  - 已登录状态显示"退出"按钮
  - 点击退出 → 清除 cookie → redirect 到 /login
  - Server/Client 组件正确分离

## 验收标准
- [ ] /login 页面实现
- [ ] 表单字段：邮箱、密码
- [ ] 邮箱格式验证
- [ ] 登录成功后跳转用户中心（/dashboard）
- [ ] 登录失败显示错误提示（邮箱或密码错误）
- [ ] 会话持久化（刷新不丢失）
- [ ] 退出登录功能
- [ ] JWT 存储于 httpOnly Cookie
- [ ] Cookie 设置 Secure 和 SameSite=Lax
- [ ] 登录失败不泄露用户是否存在
- [ ] 所有单元测试通过
- [ ] 代码覆盖率 ≥90%

## 技术要点
- **JWT 实现**: 使用 jose 库，算法 HS256，claims 包含 sub(userId)、email、role、exp(7天)
- **Cookie 配置**: name=session, httpOnly=true, sameSite=lax, path=/, secure 仅在生产环境启用
- **安全策略**: 登录失败统一返回"邮箱或密码错误"，不泄露用户是否存在
- **架构模式**: Server Components 用于鉴权检查，Client Components 用于交互表单
- **密码验证**: 使用 bcrypt compare 验证密码哈希
- **环境变量**: JWT_SECRET 必须在 .env 中配置，生产环境使用强随机值
