# 项目技术约定

## 技术栈
- **核心**: Next.js 14（App Router）/ React 18 / TypeScript
- **数据**: Prisma + Supabase PostgreSQL
- **样式**: Tailwind CSS + shadcn/ui（Radix）
- **认证**: `jose` + HS256 JWT（`session` httpOnly Cookie）
- **测试**: Jest + Testing Library


## 开发约定
- **文档基准（SSOT）**: `docs/dianzi-prd.md`、`docs/ui-style-guide.md`、`tests/dianzi-test-cases.md`
- **代码规范**: `npm run lint`（ESLint）、`npm run format`（Prettier）
- **命名约定**:
  - 组件：PascalCase
  - 文件：与现有目录保持一致（按模块分组，不强行统一）
  - 路径别名：`@/components/*`、`@/lib/*`
- **样式规范**: 严格遵循 `docs/ui-style-guide.md`（Design Tokens、玻璃态、间距与动画约束）


## 配置与环境变量
仅记录变量名与用途，禁止写入任何密钥值。

- `DATABASE_URL`: Prisma 应用连接（建议走 Supabase transaction pooler + pgbouncer）
- `DIRECT_URL`: Prisma 迁移/DDL 连接（session pooler）
- `DATABASE_SCHEMA`: 预览环境可选 schema 隔离（例如 `preview`）
- `JWT_SECRET`: JWT 签名密钥（必填）
- `SEED_ADMIN_EMAIL`: 管理员种子账号（仅用于初始化）
- `SEED_ADMIN_PASSWORD`: 管理员种子密码（生产必须强口令，禁止默认口令）


## 错误与日志
- **用户可预期错误**: Server Action 返回结构化结果（如 `{ success: false, error, field }`），前端负责展示提示。
- **权限错误**: 管理端操作要求 `ADMIN`；不满足时拒绝访问（布局层 `redirect`）或抛出 `Unauthorized`。
- **异常处理**: 不在文档中固化日志格式；以“最小泄露 + 可定位”为原则，避免把敏感信息写入日志/响应。


## 测试与流程
- **测试用例对照**: `tests/dianzi-test-cases.md`
- **执行命令**: `npm run test` / `npm run test:coverage`
- **新增测试位置**: 以仓库约定为准（现有目录包含 `__tests__/` 与 `tests/`）。

