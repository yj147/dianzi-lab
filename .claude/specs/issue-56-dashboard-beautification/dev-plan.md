# 用户中心页面美化 - Development Plan

## Overview

为用户中心页面应用毛玻璃卡片效果、hover 动效、增强空状态交互,提升视觉体验和用户引导。

## Task Breakdown

### Task 1: EmptyState 组件增强

- **ID**: task-1
- **type**: ui
- **Description**: 为 EmptyState 组件添加可选的 `action?: ReactNode` 属性,用于在空状态下渲染行动按钮或其他交互元素,提升用户引导体验
- **File Scope**:
  - `components/EmptyState.tsx`
  - `__tests__/components/EmptyState.test.tsx`
- **Dependencies**: None
- **Test Command**: `npm run test -- --testPathPattern="EmptyState" --coverage --collectCoverageFrom='components/EmptyState.tsx'`
- **Test Focus**:
  - 测试未传入 action 时不渲染额外元素(保持向后兼容)
  - 测试传入 action prop 时正确渲染该元素
  - 测试 icon 和 message 的默认行为不受影响
  - 确保代码覆盖率 ≥90%

### Task 2: Dashboard 页面视觉升级

- **ID**: task-2
- **type**: ui
- **Description**:
  1. **头部增强**: 将返回首页链接改造为按钮样式(如 `inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors`),提升可见性
  2. **卡片毛玻璃效果**: 将 `bg-white` 改为 `bg-white/80 backdrop-blur-xl border border-white/20`,打造透明感
  3. **卡片 hover 动效**: 添加 `hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`,提升交互反馈
  4. **空状态优化**: 为 EmptyState 传入 action 属性,渲染"提交第一个点子"按钮,移除第 75-84 行的独立 CTA 区域
- **File Scope**:
  - `app/(main)/dashboard/page.tsx`
  - `__tests__/app/dashboard.test.tsx`
- **Dependencies**: depends on task-1
- **Test Command**: `npm run test -- --testPathPattern="dashboard" --coverage --collectCoverageFrom='app/(main)/dashboard/**/*.tsx'`
- **Test Focus**:
  - 测试空状态下 EmptyState 正确渲染 action 按钮
  - 测试有点子时卡片正确应用毛玻璃和 hover 样式类名
  - 测试头部返回链接样式类名正确应用
  - 测试未登录时仍然重定向到 /login
  - 确保代码覆盖率 ≥90%

## Acceptance Criteria

- [ ] 页面头部返回首页链接采用按钮样式,清晰可见
- [ ] 点子卡片采用毛玻璃效果(bg-white/80 backdrop-blur-xl border border-white/20)
- [ ] 状态徽章颜色与管理后台一致(已验证:通过共享 STATUS_CONFIG 实现,无需修改)
- [ ] 卡片 hover 效果流畅(hover:shadow-xl hover:-translate-y-1 transition-all duration-300)
- [ ] 空状态显示鼓励性文案并内置"提交第一个点子"按钮,移除独立 CTA 区域
- [ ] EmptyState 组件支持可选的 action 属性
- [ ] All unit tests pass
- [ ] Code coverage ≥90%
- [ ] `npm run lint` 无警告
- [ ] `npm run build` 成功

## Technical Notes

- **毛玻璃卡片最佳实践**:
  - 使用 `bg-white/80` 而非 `bg-white` 以实现半透明效果
  - 添加 `backdrop-blur-xl` 实现背景模糊
  - 添加 `border border-white/20` 增强透明玻璃质感
  - 在渐变背景(`bg-gradient-to-br from-blue-50 to-cyan-50`)上效果最佳
- **Hover 动效约束**:
  - 使用 `transition-all duration-300` 确保动画流畅自然
  - `hover:-translate-y-1` 产生轻微上浮效果,提升反馈感
  - 添加 `cursor-pointer` 明确交互意图
- **EmptyState 向后兼容**:
  - action 属性为可选,现有调用无需修改
  - 仅在传入 action 时渲染该元素,否则保持原有结构
- **Dashboard 结构优化**:
  - 当前第 75-84 行的独立 CTA 区域与 EmptyState 功能重复
  - 通过 action prop 将按钮整合到 EmptyState 内部,减少冗余代码
  - 保持 Dashboard 为 Server Component,无需引入客户端状态
- **状态徽章一致性**:
  - StatusBadge 已通过 `components/StatusBadge.tsx` 的 STATUS_CONFIG 实现颜色统一
  - Dashboard 和 Admin 页面均使用该共享配置,无需额外修改
- **测试策略**:
  - EmptyState 测试需覆盖 action prop 的有无两种情况
  - Dashboard 测试需验证空状态和有数据两种场景下的样式和结构
  - 保持现有 mock 结构(getSession、prisma),仅扩展断言
