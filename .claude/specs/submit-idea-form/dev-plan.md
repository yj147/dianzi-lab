# 点子提交表单 - 开发计划

## 概述
实现用户提交点子的表单页面，支持标题、描述输入和多标签选择，提交后显示成功提示并跳转用户中心。

## 任务分解

### Task 1: 安装并接入 shadcn Toast 组件
- **ID**: task-1
- **描述**: 手动引入 shadcn/ui 的 Toast 组件及其依赖，配置 Toaster 到根布局，补充 cn() 工具函数
- **文件范围**:
  - 新建: `components/ui/toast.tsx`, `components/ui/toaster.tsx`, `components/ui/use-toast.ts`
  - 修改: `app/layout.tsx` (挂载 Toaster 组件)
  - 修改: `lib/utils.ts` (补充 cn() 函数)
  - 修改: `package.json` (添加 toast 相关依赖)
- **依赖关系**: None
- **测试命令**: `npm run build`
- **测试重点**:
  - 构建成功无报错
  - Toast 组件可正常导入
  - Toaster 在页面中正确渲染

### Task 2: 完成 submit server action
- **ID**: task-2
- **描述**: 实现服务端提交逻辑，包括安全读取 FormData、数据校验、Prisma 创建记录、返回结果
- **文件范围**:
  - 修改: `app/submit/actions.ts` (实现 submitIdea action)
  - 可能涉及: `prisma/schema.prisma` (确认 Idea 模型字段)
- **依赖关系**: None
- **测试命令**: `npm test -- --testPathPattern=submit/actions`
- **测试重点**:
  - 正常提交返回 {success: true, ideaId}
  - 缺少必填字段返回错误
  - 非法数据格式返回错误
  - 未登录用户被拒绝
  - 数据库记录正确创建，状态为 PENDING

### Task 3: 实现 /submit 表单 UI 和标签切换
- **ID**: task-3
- **描述**: 创建客户端表单组件，使用 React Hook Form + Zod 校验，实现标签多选 toggle UI，成功后显示 toast 并跳转
- **文件范围**:
  - 修改: `app/submit/page.tsx` (页面入口)
  - 新建: `app/submit/SubmitForm.tsx` (客户端表单组件)
  - 可能新建: `lib/validations/idea.ts` (Zod schema)
- **依赖关系**: 依赖 task-1 (Toast), task-2 (server action)
- **测试命令**: `npm test -- --testPathPattern=submit.test`
- **测试重点**:
  - 表单渲染包含标题、描述、标签字段
  - 预设标签：工具、效率、娱乐、学习、其他
  - 标签可点击切换选中状态
  - 必填字段校验生效
  - 提交成功显示 toast
  - 提交成功后跳转到用户中心
  - 提交失败显示错误信息

### Task 4: 单元测试与覆盖率验证
- **ID**: task-4
- **描述**: 编写完整的单元测试，覆盖所有业务场景，确保覆盖率 ≥90%
- **文件范围**:
  - 修改: `__tests__/app/submit.test.tsx` (UI 组件测试)
  - 新建: `__tests__/app/submit/actions.test.ts` (server action 测试)
- **依赖关系**: 依赖 task-1, task-2, task-3
- **测试命令**: `npm run test:coverage -- --collectCoverageFrom='app/submit/**/*.{ts,tsx}'`
- **测试重点**:
  - Happy path: 正常提交流程
  - Edge cases: 空输入、超长输入、特殊字符
  - Error handling: 网络错误、服务端错误、未登录
  - State transitions: 表单状态变化、标签选择状态
  - 覆盖率报告显示 ≥90%

## 验收标准
- [ ] /submit 页面可正常访问（已登录用户）
- [ ] 表单包含标题（必填）、描述（必填）、标签（可选多选）字段
- [ ] 预设标签：工具、效率、娱乐、学习、其他
- [ ] 标签 UI 支持点击切换选中状态
- [ ] 提交后点子状态默认为 PENDING
- [ ] 提交成功显示成功提示（Toast）
- [ ] 提交成功后自动跳转到用户中心
- [ ] 未登录用户被 middleware 拦截
- [ ] 客户端和服务端均校验数据合法性
- [ ] 所有单元测试通过
- [ ] 代码覆盖率 ≥90%

## 技术要点
- **鉴权**: /submit 路由已被 middleware 保护，无需额外鉴权逻辑
- **表单库**: 使用 React Hook Form + Zod 进行客户端校验
- **服务端校验**: Server Action 中必须再次校验，防止绕过客户端
- **Toast 组件**: 手动引入 shadcn/ui Toast，不使用 CLI 安装
- **标签存储**: 标签以数组形式存储在 Prisma Idea 模型中
- **跳转目标**: 成功后跳转到用户中心（需确认具体路由路径）
- **错误处理**: Server Action 返回结构化错误信息，前端统一处理
