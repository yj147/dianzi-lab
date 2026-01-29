# 共享组件与导航栏美化 - Development Plan

## Overview

升级导航栏为响应式设计，添加滚动毛玻璃效果、用户下拉菜单和链接状态样式，并优化 Toast 组件的视觉反馈系统。

## Task Breakdown

### Task 1: 安装 DropdownMenu 依赖并封装组件

- **ID**: task-1
- **type**: default
- **Description**: 安装 `@radix-ui/react-dropdown-menu` 依赖包，并参考现有 shadcn/ui 风格在 `components/ui/dropdown-menu.tsx` 中创建封装组件，导出 DropdownMenu、DropdownMenuTrigger、DropdownMenuContent、DropdownMenuItem、DropdownMenuSeparator 等子组件
- **File Scope**: `package.json`, `package-lock.json`, `components/ui/dropdown-menu.tsx`（新建）
- **Dependencies**: None
- **Test Command**: `npm test -- __tests__/components/Navbar.test.tsx --coverage --collectCoverageFrom='components/ui/dropdown-menu.tsx'`
- **Test Focus**:
  - DropdownMenu 组件正确导出所有子组件
  - 子组件可正常组合使用
  - Radix UI props 正确透传

### Task 2: 导航栏功能升级与样式优化

- **ID**: task-2
- **type**: ui
- **Description**: 在 `NavbarClient.tsx` 中实现滚动监听（>50px 触发毛玻璃效果 `backdrop-blur-lg bg-white/80`），为导航链接添加 hover/active 状态（含 `aria-current="page"`），在桌面端集成 DropdownMenu 实现用户下拉菜单（显示邮箱、仪表板链接、登出按钮），验证移动端汉堡菜单功能正常
- **File Scope**: `components/NavbarClient.tsx`, `components/Navbar.tsx`
- **Dependencies**: task-1
- **Test Command**: `npm test -- __tests__/components/Navbar.test.tsx --coverage --collectCoverageFrom='components/Navbar*.tsx'`
- **Test Focus**:
  - 滚动事件触发样式变化（scrollY > 50px）
  - 当前路由链接标记为 active（aria-current="page"）
  - 用户下拉菜单打开/关闭交互
  - 登出按钮触发 signOut 调用
  - 移动端汉堡菜单展开/收起
  - 响应式断点切换（mobile ↔ desktop）

### Task 3: Toast 变体优化与颜色系统

- **ID**: task-3
- **type**: ui
- **Description**: 在 `components/ui/toast.tsx` 中新增 success 和 info 变体，使用 Tailwind 内置颜色类（success: green-500/green-100, destructive: red-500/red-100, info: blue-500/blue-100），更新 `use-toast.ts` 类型定义，确保 `toaster.tsx` 正确渲染新变体
- **File Scope**: `components/ui/toast.tsx`, `components/ui/toaster.tsx`, `components/ui/use-toast.ts`
- **Dependencies**: None
- **Test Command**: `npm test -- __tests__/components/Toast.test.tsx --coverage --collectCoverageFrom='components/ui/toast*.tsx' --collectCoverageFrom='components/ui/use-toast.ts'`
- **Test Focus**:
  - 三种变体（success/destructive/info）正确渲染对应颜色
  - toast() 函数正确接受 variant 参数
  - 多个 toast 同时显示的堆叠行为
  - Toast 自动消失计时器
  - 手动关闭 toast 交互

### Task 4: 测试覆盖率增强与配置优化

- **ID**: task-4
- **type**: default
- **Description**: 调整 `jest.config.ts` 中的 coverage 收集范围和阈值（全局 ≥90%），补充 `__tests__/components/Navbar.test.tsx` 的边界场景测试（滚动阈值边界、未登录状态、移动端交互），新建 `__tests__/components/Toast.test.tsx` 覆盖所有 Toast 行为
- **File Scope**: `jest.config.ts`, `__tests__/components/Navbar.test.tsx`, `__tests__/components/Toast.test.tsx`（新建）
- **Dependencies**: task-2, task-3
- **Test Command**: `npm run test:coverage -- --collectCoverageFrom='components/**/*.{ts,tsx}' --collectCoverageFrom='!components/**/*.stories.tsx'`
- **Test Focus**:
  - 覆盖率达到 ≥90% 阈值
  - Navbar 边界测试：scrollY=49/50/51、未登录、路由切换
  - Toast 边界测试：空文本、超长文本、快速连续触发
  - 移动端特定交互（触摸事件、视口变化）

## Acceptance Criteria

- [ ] 导航栏固定顶部，滚动超过 50px 时显示毛玻璃背景（backdrop-blur-lg bg-white/80）
- [ ] 导航链接具有明确的 hover 和 active 状态，当前页面链接标记 aria-current="page"
- [ ] 移动端导航栏折叠为汉堡菜单且功能正常
- [ ] 桌面端用户下拉菜单显示邮箱、仪表板链接和登出按钮
- [ ] Toast 组件支持 success（绿色）、destructive（红色）、info（蓝色）三种变体
- [ ] 所有组件单元测试通过
- [ ] 代码覆盖率 ≥90%

## Technical Notes

- **滚动检测优化**: 使用 `useEffect` 添加 scroll 监听器，通过 state 记录 `scrolled` 状态，仅在阈值穿越（49→51 或 51→49）时更新 state 以减少重渲染
- **Active 链接判定**: 利用 Next.js `usePathname()` hook 获取当前路由，匹配时添加 active class 和 `aria-current="page"` 属性以符合 WCAG 标准
- **DropdownMenu 封装**: 参考现有 `alert-dialog.tsx` 的封装模式，使用 forwardRef 和 React.ComponentPropsWithoutRef 保持类型安全
- **Toast 颜色策略**: 仅使用 Tailwind 内置颜色类（green-500/red-500/blue-500），避免依赖未定义的设计 token，确保样式一致性
- **测试工具链**: Jest + React Testing Library，使用 `@testing-library/user-event` 模拟用户交互，`jest-environment-jsdom` 模拟浏览器环境
