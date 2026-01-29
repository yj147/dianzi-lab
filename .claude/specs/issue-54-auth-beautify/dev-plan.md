# 登录/注册页面美化 - Development Plan

## Overview

为登录和注册页面添加背景装饰球体、增强毛玻璃效果并引入加载状态 spinner，提升整体视觉体验。

## Task Breakdown

### Task 1: 添加背景装饰球体

- **ID**: task-1
- **type**: ui
- **Description**: 复用 `app/(main)/submit/page.tsx` 的装饰球体结构，将相同的背景装饰元素添加到登录和注册页面，保持视觉一致性
- **File Scope**:
  - `app/(main)/login/page.tsx`
  - `app/(main)/register/page.tsx`
- **Dependencies**: None
- **Test Command**: `npm run lint`
- **Test Focus**:
  - 验证 JSX 语法正确性
  - 确认装饰元素不影响页面布局和表单交互
  - 检查无 a11y 警告

### Task 2: 增强毛玻璃卡片并添加 Spinner

- **ID**: task-2
- **type**: ui
- **Description**:
  1. 提升毛玻璃效果：从 `backdrop-blur-md` 升级到 `backdrop-blur-xl`，提高背景不透明度至 `bg-white/20`，添加 `shadow-2xl` 和 `ring-1 ring-white/30`
  2. 为提交按钮添加 loading 状态，使用 `lucide-react` 的 `Loader2` 图标 + `animate-spin`，确保符合无障碍规范（`aria-busy`、`motion-reduce:animate-none`）
- **File Scope**:
  - `app/(main)/login/LoginForm.tsx`
  - `app/(main)/register/RegisterForm.tsx`
- **Dependencies**: None
- **Test Command**: `npm run lint && npm run build`
- **Test Focus**:
  - 验证增强后的样式类名正确应用
  - 确认 spinner 在 isLoading 状态下正确显示
  - 检查构建无错误，无 TypeScript 类型问题
  - 验证 motion-reduce 和 aria-busy 属性存在

### Task 3: 更新测试覆盖

- **ID**: task-3
- **type**: default
- **Description**: 更新登录页面测试用例，覆盖新增的 spinner 显示逻辑和加载状态，确保测试完整性
- **File Scope**:
  - `__tests__/app/login.test.tsx`
- **Dependencies**: depends on task-2
- **Test Command**: `npm run test -- __tests__/app/login.test.tsx --coverage --collectCoverageFrom='app/(main)/login/**/*.tsx'`
- **Test Focus**:
  - 测试提交时 spinner 显示
  - 测试提交完成后 spinner 消失
  - 测试按钮 disabled 状态与 loading 状态联动
  - 验证 aria-busy 属性在 loading 时为 true
  - 确保代码覆盖率 ≥90%

## Acceptance Criteria

- [ ] 登录和注册页面背景添加装饰球体，与 Submit 页面风格一致
- [ ] 表单卡片应用增强的毛玻璃效果（backdrop-blur-xl、bg-white/20、shadow-2xl、ring-1）
- [ ] 提交按钮在 loading 状态下显示 Loader2 spinner 并禁用交互
- [ ] Spinner 符合无障碍规范（aria-busy、motion-reduce:animate-none）
- [ ] All unit tests pass
- [ ] Code coverage ≥90%
- [ ] `npm run lint` 无警告
- [ ] `npm run build` 成功

## Technical Notes

- **不新增通用组件**：所有修改仅在 page.tsx 和对应的 Form.tsx 文件内完成，避免过度抽象
- **装饰球体实现参考**：严格按照 `app/(main)/submit/page.tsx:6` 的结构复用，包括绝对定位、渐变色、模糊和动画
- **毛玻璃最佳实践**：
  - 使用 `backdrop-blur-xl` 替代 `backdrop-blur-md` 以获得更强的模糊效果
  - 提高不透明度至 `bg-white/20` 以增强卡片可读性
  - 添加 `shadow-2xl` 和 `ring-1 ring-white/30` 提升层次感
- **Spinner 语义要求**：
  - 必须使用 `lucide-react` 的 `Loader2` 图标（已安装）
  - 动画类名：`animate-spin`
  - 响应式动画：添加 `motion-reduce:animate-none` 以尊重用户系统偏好
  - 无障碍属性：按钮添加 `aria-busy={isLoading}`
- **布局约束**：考虑到 `app/(main)/layout.tsx:11` 已添加 `pt-16` 为 Navbar 留空间，装饰球体定位需避免遮挡 Navbar 区域
- **测试策略**：现有测试文件 `__tests__/app/login.test.tsx` 需扩展覆盖 spinner 逻辑，注册页面测试结构类似可延用相同模式
