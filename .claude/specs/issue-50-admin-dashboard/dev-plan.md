# 管理后台仪表板页面优化 - Development Plan

## Overview
完成管理后台仪表板页面的最后两项用户体验优化：添加鼠标指针样式和更新快捷操作标签文案。

## Task Breakdown

### Task 1: 添加鼠标指针样式
- **ID**: T50-1
- **Description**: 为统计卡片容器添加 `cursor-pointer` 类，提升用户交互体验
- **File Scope**: `app/admin/page.tsx` (第103行，className 属性)
- **Dependencies**: None
- **Test Command**: `npm test -- __tests__/app/admin/users.test.tsx`
- **Test Focus**: 验证统计卡片的交互样式和用户体验，确保鼠标悬停时显示正确的指针样式

### Task 2: 更新快捷操作标签
- **ID**: T50-2
- **Description**: 将快捷操作标签从"垃圾箱"更改为"回收站"，并更新相应的测试断言
- **File Scope**:
  - `app/admin/page.tsx` (第76行) - 更新标签文本从 '垃圾箱' 到 '回收站'
  - `__tests__/app/admin/users.test.tsx` (第60行) - 更新测试断言从 '垃圾箱' 到 '回收站'
- **Dependencies**: None
- **Test Command**: `npm test -- __tests__/app/admin/users.test.tsx`
- **Test Focus**: 验证快捷操作标签显示"回收站"文本，确保测试断言与UI文案保持一致

## Acceptance Criteria
- [ ] 统计卡片容器添加 `cursor-pointer` 样式类
- [ ] 快捷操作标签从"垃圾箱"更新为"回收站"
- [ ] 测试文件中的断言同步更新
- [ ] 所有单元测试通过 (`npm test -- __tests__/app/admin/users.test.tsx`)
- [ ] 代码覆盖率 ≥90%

## Technical Notes
- **任务类型**: UI 细节优化，无业务逻辑变更
- **并行执行**: 两个任务完全独立，可以同时进行
- **实施风险**: 极低 - 修改点精确到行号，影响范围明确
- **测试策略**: 复用现有的管理员页面测试套件，无需新增测试用例
- **技术栈**: Next.js + React + TypeScript + Tailwind CSS
