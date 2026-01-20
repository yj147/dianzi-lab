# Hero 区域 - 开发计划

## Issue 引用
- **Issue**: #21 [Epic: 首页展示] Hero 区域
- **URL**: https://github.com/yj147/dianzi-lab/issues/21

## 概述
实现首页 Hero 区域，包含导航栏、标题、副标题、CTA 按钮和背景渐变效果，确保首屏加载性能（LCP < 2.5s）。

## 任务拆分

### Task 1: 实现导航栏 + Hero 首屏布局
- **ID**: task-1
- **type**: ui
- **描述**: 创建 Navbar 和 Hero 组件，实现首屏布局、渐变背景、响应式设计
- **文件范围**:
  - `app/layout.tsx` - 添加 Navbar
  - `app/page.tsx` - 集成 Hero 组件
  - `components/Navbar.tsx` - 导航栏组件（Logo、导航链接、登录按钮）
  - `components/Hero.tsx` - Hero 区域（标题、副标题、CTA 按钮、渐变背景）
  - `app/globals.css` - 可能需要的全局样式
- **依赖**: 无
- **测试命令**: `npm run dev` 并手动验证渲染效果和 LCP 性能
- **测试焦点**:
  - Hero 区域占据全屏（min-h-screen）
  - 导航栏包含 Logo、首页、提交点子、登录按钮
  - 背景渐变效果（蓝→青→白）正确显示
  - 响应式布局在移动端和桌面端正常

### Task 2: 补齐路由占位
- **ID**: task-2
- **type**: quick-fix
- **描述**: 创建 /submit 和 /login 路由占位页面，添加 #tools 锚点支持
- **文件范围**:
  - `app/submit/page.tsx` - 提交点子页面占位
  - `app/login/page.tsx` - 登录页面占位
  - `app/page.tsx` - 添加 id="tools" 锚点区域
- **依赖**: 无
- **测试命令**: `npm run dev` 并验证路由跳转和锚点滚动
- **测试焦点**:
  - 点击"提交点子"按钮导航到 /submit
  - 点击"登录"按钮导航到 /login
  - 点击"浏览工具"按钮平滑滚动到 #tools 锚点

### Task 3: 配置 Jest + RTL 测试基础设施
- **ID**: task-3
- **type**: default
- **描述**: 安装并配置 Jest 和 React Testing Library，支持 TypeScript 和 Next.js 14
- **文件范围**:
  - `package.json` - 添加测试依赖（jest, @testing-library/react, @testing-library/jest-dom 等）
  - `jest.config.ts` - Jest 配置（支持 TypeScript、模块解析、覆盖率）
  - `jest.setup.ts` - 测试环境初始化
  - `.gitignore` - 忽略覆盖率目录
- **依赖**: 无
- **测试命令**: `npm test -- --version` 验证 Jest 安装成功
- **测试焦点**:
  - Jest 能正确解析 TypeScript 和 JSX
  - 能 import Next.js 组件和模块
  - 覆盖率收集配置正确

### Task 4: 编写组件渲染测试
- **ID**: task-4
- **type**: default
- **描述**: 为 Navbar 和 Hero 组件编写 Jest + RTL 测试，验证渲染和交互
- **文件范围**:
  - `__tests__/components/Navbar.test.tsx` - 导航栏测试
  - `__tests__/components/Hero.test.tsx` - Hero 区域测试
- **依赖**: 依赖 task-1, task-3
- **测试命令**: `npm test -- --coverage --collectCoverageFrom='components/**/*.{ts,tsx}' --collectCoverageFrom='app/**/*.{ts,tsx}' --collectCoverageFrom='!**/*.d.ts'`
- **测试焦点**:
  - Navbar 渲染正确元素（Logo、导航链接、登录按钮）
  - Hero 渲染标题"点子实验室"和副标题"你的创意，我们来实现"
  - CTA 按钮正确显示并包含正确 href 属性
  - 使用 screen.getByRole 确保可访问性

## 执行顺序

### 并行执行组
- **组 1**: task-1, task-2, task-3 可以并行执行（无依赖关系）
- **组 2**: task-4 必须等待 task-1 和 task-3 完成后执行

### 推荐顺序
1. 先执行 task-3（配置测试环境）
2. 并行执行 task-1 和 task-2（UI 实现和路由占位）
3. 最后执行 task-4（编写测试）

## 验收标准映射

- [ ] Hero 区域占据首屏（min-h-screen）→ task-1
- [ ] 标题：点子实验室 → task-1
- [ ] 副标题：你的创意，我们来实现 → task-1
- [ ] CTA 按钮1：提交点子（链接 /submit）→ task-1, task-2
- [ ] CTA 按钮2：浏览工具（锚点 #tools）→ task-1, task-2
- [ ] 背景渐变效果（蓝→青→白）→ task-1
- [ ] 导航栏：Logo、首页、提交点子、登录按钮 → task-1
- [ ] LCP < 2.5s → task-1（使用 Server Component，避免客户端渲染）
- [ ] Jest + RTL 组件渲染测试 → task-3, task-4
- [ ] 所有单元测试通过 → task-4
- [ ] 代码覆盖率 ≥90% → task-4

## 技术约束

- **框架**: Next.js 14 App Router + TypeScript
- **样式**: Tailwind CSS（使用渐变工具类如 `bg-gradient-to-b from-blue-500 via-cyan-400 to-white`）
- **测试**: Jest + React Testing Library
- **性能**:
  - LCP < 2.5s：优先使用 Server Component，仅交互组件标记 'use client'
  - 避免大型客户端 bundle，延迟加载非关键资源
- **可访问性**:
  - 使用语义化 HTML（`<nav>`, `<main>`, `<h1>`, `<button>`）
  - 按钮使用 `<Link>` 或 `<a>` 标签，确保键盘导航
  - 渐变背景确保文字对比度 ≥4.5:1

## 技术决策

1. **组件拆分策略**:
   - Navbar 和 Hero 独立组件，便于测试和复用
   - Navbar 可能需要 'use client'（如果有移动端菜单交互）
   - Hero 优先使用 Server Component

2. **路由占位实现**:
   - /submit 和 /login 先返回简单占位内容（如 "开发中"）
   - 后续 Epic 会实现完整功能

3. **测试覆盖优先级**:
   - 组件渲染（必须）
   - 导航链接和按钮属性（必须）
   - 样式类验证（可选，Tailwind 类存在即可）

4. **性能优化**:
   - 避免使用 'use client' 除非必要
   - 字体使用 next/font 优化
   - 渐变使用 CSS 类而非图片
