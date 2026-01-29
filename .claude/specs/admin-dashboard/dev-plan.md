# 管理员后台系统 - Development Plan

## Overview

实现完整的管理员后台系统，包括布局导航、点子管理（列表/状态变更/回收站）、统计面板和用户管理功能。

## Task Breakdown

### Task 1: 管理员后台布局与导航

- **ID**: task-1
- **Description**: 实现管理员后台布局与导航，包括侧边栏、当前路由高亮、移动端折叠、显示邮箱和登出功能
- **File Scope**: app/admin/layout.tsx, app/admin/page.tsx, app/admin/\_components/AdminSidebar.tsx, app/admin/\_components/AdminHeader.tsx
- **Dependencies**: None
- **Test Command**: `npm test -- __tests__/app/admin/layout.test.tsx --coverage --coveragePathPattern=app/admin`
- **Test Focus**: 侧边栏渲染、路由高亮状态、移动端响应式行为、登出功能触发

### Task 2: 点子列表与状态管理

- **ID**: task-2
- **Description**: 实现点子列表页面，支持通过 URL 参数进行状态筛选、状态变更操作和移至回收站功能
- **File Scope**: app/admin/ideas/page.tsx, app/admin/ideas/actions.ts, app/admin/ideas/\_components/IdeasTable.tsx
- **Dependencies**: task-1
- **Test Command**: `npm test -- __tests__/app/admin/ideas.test.tsx --coverage --coveragePathPattern=app/admin/ideas`
- **Test Focus**: 列表数据渲染、状态筛选逻辑、状态变更操作、移至回收站功能、Server Actions 调用

### Task 3: 回收站功能

- **ID**: task-3
- **Description**: 实现回收站页面，显示已删除点子（isDeleted=true），支持恢复、永久删除（带 AlertDialog 确认）和空状态展示
- **File Scope**: app/admin/trash/page.tsx, app/admin/trash/\_components/TrashTable.tsx, app/admin/trash/actions.ts, components/ui/alert-dialog.tsx
- **Dependencies**: task-1, task-2
- **Test Command**: `npm test -- __tests__/app/admin/trash.test.tsx --coverage --coveragePathPattern=app/admin/trash`
- **Test Focus**: 回收站列表渲染、恢复功能、永久删除确认对话框交互、空状态显示、AlertDialog 组件行为

### Task 4: 统计面板与用户管理

- **ID**: task-4
- **Description**: 实现统计面板（使用 Prisma $transaction 聚合数据）和用户管理页面（用户列表含关联点子数量）
- **File Scope**: app/admin/page.tsx, app/admin/users/page.tsx, app/admin/users/\_queries.ts
- **Dependencies**: task-1
- **Test Command**: `npm test -- __tests__/app/admin/users.test.tsx --coverage --coveragePathPattern=app/admin`
- **Test Focus**: 统计数据准确性（总数/状态分布）、用户列表渲染、点子数量关联查询、$transaction 使用正确性

## Acceptance Criteria

- [ ] 管理员后台布局完整，包含侧边栏和导航系统
- [ ] 点子列表支持状态筛选和状态变更操作
- [ ] 回收站支持恢复和永久删除（带确认对话框）
- [ ] 统计面板显示关键数据（点子总数、状态分布等）
- [ ] 用户管理列表显示用户信息及关联点子数量
- [ ] 所有单元测试通过
- [ ] 代码覆盖率 ≥90%

## Technical Notes

- **布局架构**: 使用 `app/admin/layout.tsx` 作为管理员后台外壳（Sidebar + main content）
- **数据获取**: Server Component + Prisma 直接查询（遵循 `app/dashboard/page.tsx` 模式）
- **数据变更**: Server Actions（与现有 `logout()`/`submitIdea()` 保持一致）
- **刷新策略**: 操作完成后使用 `router.refresh()` 刷新数据
- **AlertDialog**: 添加 `@radix-ui/react-alert-dialog` 依赖和 `components/ui/alert-dialog.tsx`（shadcn 模式）
- **权限保护**: `/admin/*` 路由已由中间件保护（ADMIN 角色），无需额外验证
- **数据加载**: 一次性加载所有数据（无分页需求）
- **依赖关系**: T29 为基础任务，T30/T32 依赖 T29，T31 依赖 T29 和 T30
