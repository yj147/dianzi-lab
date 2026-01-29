# 响应式布局与空状态 - 开发计划

## 概述

为首页已完成工具列表添加空状态展示，当无已完成点子时显示友好的空状态提示（包含图标和文案）。

## 任务分解

### Task 1: 安装 @heroicons/react 依赖

- **ID**: task-1
- **Description**: 安装 @heroicons/react 包以使用 SparklesIcon 图标，添加到项目依赖
- **File Scope**: package.json
- **Dependencies**: None
- **Test Command**: `npm install && npm list @heroicons/react`
- **Test Focus**: 验证依赖安装成功，能够正确引入 @heroicons/react/24/outline

### Task 2: 创建 EmptyState 组件及单元测试

- **ID**: task-2
- **Description**: 创建 EmptyState Server Component，展示 SparklesIcon 图标和"暂无已完成的工具，敬请期待！"文案，使用 Tailwind CSS 实现响应式居中布局
- **File Scope**:
  - components/EmptyState.tsx
  - **tests**/components/EmptyState.test.tsx
- **Dependencies**: depends on task-1
- **Test Command**: `npm run test -- __tests__/components/EmptyState.test.tsx --coverage`
- **Test Focus**:
  - 验证文案"暂无已完成的工具，敬请期待！"正确渲染
  - 验证 SparklesIcon 图标存在（通过 data-testid 或 svg 元素检查）
  - 验证组件包含正确的 CSS 类名（居中、间距、颜色）
  - 验证无 props 时的默认渲染行为

### Task 3: 修改首页集成空状态逻辑及更新测试

- **ID**: task-3
- **Description**: 在 app/page.tsx 中添加条件渲染逻辑：ideas 数组为空时显示 EmptyState 组件，否则显示 IdeaCard 网格；更新 **tests**/app/page.test.tsx 覆盖两种场景
- **File Scope**:
  - app/page.tsx
  - **tests**/app/page.test.tsx
- **Dependencies**: depends on task-2
- **Test Command**: `npm run test -- __tests__/app/page.test.tsx --coverage`
- **Test Focus**:
  - **有数据场景**: 当 prisma.idea.findMany 返回非空数组时，验证 IdeaCard 网格正常渲染，EmptyState 不存在
  - **空数据场景**: 当 prisma.idea.findMany 返回空数组时，验证 EmptyState 组件渲染，IdeaCard 网格不存在
  - 验证"已完成的工具"标题在两种场景下都正常显示
  - 验证响应式网格类名保持不变（grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4）

## 验收标准

- [x] 移动端（375px+）：单列卡片布局（已实现）
- [x] 平板端（768px+）：双列卡片布局（已实现）
- [x] 桌面端（1024px+）：三列或四列卡片布局（已实现）
- [ ] 无已完成点子时显示空状态组件
- [ ] 空状态文案为："暂无已完成的工具，敬请期待！"
- [ ] 空状态包含 SparklesIcon 图标（@heroicons/react/24/outline）
- [ ] 所有单元测试通过
- [ ] 代码覆盖率 ≥90%

## 技术要点

- **图标库**: 使用 @heroicons/react/24/outline 的 SparklesIcon（项目当前使用 lucide-react，新增 heroicons 依赖）
- **组件类型**: EmptyState 实现为 Server Component，无客户端 JavaScript 开销
- **样式方案**: 使用 Tailwind CSS 原子类实现居中布局、文本颜色、图标大小
- **条件渲染**: 基于 `ideas.length === 0` 判断显示空状态或卡片网格
- **测试策略**: Mock Prisma 返回值，覆盖空数组和非空数组两种场景
- **代码风格**: 遵循项目现有的组件结构和测试模式（参考 IdeaCard.test.tsx）
