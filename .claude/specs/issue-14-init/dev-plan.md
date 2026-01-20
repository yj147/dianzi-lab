# Issue #14 项目初始化 - 开发计划

## 概述
搭建 Next.js 14 + TypeScript + Tailwind CSS 项目脚手架，建立标准目录结构和代码质量工具配置。

## 任务分解

### Task 1: 执行 Next.js 14 项目创建
- **ID**: task-1
- **描述**: 使用 create-next-app 创建 Next.js 14 项目，启用 TypeScript、Tailwind CSS、App Router，禁用 src 目录，配置路径别名为 @/*
- **文件范围**:
  - 根目录配置文件（package.json, tsconfig.json, next.config.ts）
  - app/ 目录（自动生成的 layout.tsx, page.tsx, globals.css）
  - public/ 目录
- **依赖**: None
- **验证命令**:
  ```bash
  npm run build && npm run lint
  ```
- **验证重点**:
  - Next.js 14 项目创建成功
  - TypeScript 配置正确（tsconfig.json 存在且有效）
  - Tailwind CSS 自动配置完成（tailwind.config.ts 和 postcss.config.js 存在）
  - App Router 模式启用（存在 app/ 目录）
  - 项目可正常构建，ESLint 检查通过

### Task 2: 配置代码格式化工具 Prettier
- **ID**: task-2
- **描述**: 创建 Prettier 配置文件，设置代码风格规范（无分号、单引号、2空格缩进、ES5 尾逗号），配置忽略文件列表
- **文件范围**:
  - .prettierrc（配置文件）
  - .prettierignore（忽略规则）
- **依赖**: task-1
- **验证命令**:
  ```bash
  npm run lint && npx prettier --check "**/*.{ts,tsx,js,jsx,json,css,md}"
  ```
- **验证重点**:
  - .prettierrc 配置正确（semi: false, singleQuote: true, tabWidth: 2, trailingComma: 'es5'）
  - .prettierignore 包含 node_modules/, .next/, out/, build/
  - 所有代码文件通过 Prettier 格式检查
  - ESLint 规则不与 Prettier 冲突

### Task 3: 建立项目目录结构
- **ID**: task-3
- **描述**: 创建项目核心目录结构，包括组件目录（components/）、工具函数目录（lib/）、类型定义目录（types/），为后续开发建立规范
- **文件范围**:
  - components/（可复用组件）
  - components/ui/（基础 UI 组件）
  - lib/（工具函数、常量、配置）
  - types/（TypeScript 类型定义）
- **依赖**: task-1
- **验证命令**:
  ```bash
  test -d components/ui && test -d lib && test -d types && npm run build
  ```
- **验证重点**:
  - components/ 和 components/ui/ 目录创建成功
  - lib/ 目录创建成功
  - types/ 目录创建成功
  - 目录结构不影响项目构建

### Task 4: 优化基础页面和布局文件
- **ID**: task-4
- **描述**: 修改根布局文件设置中文语言和元数据，修改首页创建占位内容，优化全局样式配置 Tailwind 基础类
- **文件范围**:
  - app/layout.tsx（根布局）
  - app/page.tsx（首页）
  - app/globals.css（全局样式）
- **依赖**: task-1, task-3
- **验证命令**:
  ```bash
  npm run dev & sleep 3 && curl -I http://localhost:3000 | grep "200 OK" && pkill -f "next dev"
  ```
- **验证重点**:
  - app/layout.tsx 设置 lang="zh-CN"
  - app/layout.tsx 配置基础元数据（title, description）
  - app/page.tsx 包含占位内容（Hero 区域提示）
  - app/globals.css 正确导入 Tailwind 指令
  - 开发服务器启动成功，首页返回 200 状态码

## 验收标准
- [ ] Next.js 14 App Router 项目创建成功
- [ ] TypeScript 配置完成（tsconfig.json 正确配置）
- [ ] Tailwind CSS 配置完成（tailwind.config.ts 和 globals.css 配置正确）
- [ ] 基础目录结构建立（components/ui/, lib/, types/ 存在）
- [ ] Prettier 配置完成（.prettierrc 和 .prettierignore 存在）
- [ ] ESLint 检查通过（npm run lint 无错误）
- [ ] 基础 layout.tsx 和 page.tsx 创建（设置中文语言和占位内容）
- [ ] 开发服务器启动成功（npm run dev 正常运行）
- [ ] 生产构建成功（npm run build 无错误）
- [ ] 所有验证命令通过

## 技术说明
- **项目创建命令**: 使用 `npx create-next-app@14 . --typescript --tailwind --app --src-dir=false --import-alias="@/*"` 确保版本锁定为 Next.js 14
- **目录结构约定**: 不使用 src/ 目录，直接在根目录组织代码，components/ 存放可复用组件，lib/ 存放纯函数工具，types/ 存放全局类型定义
- **代码风格**: Prettier 配置为无分号、单引号、2 空格缩进，与 Tailwind CSS 官方推荐风格一致
- **跳过测试**: 本任务为纯配置任务，不编写单元测试，验证方式为运行构建和 lint 命令
- **路径别名**: 已配置 @/* 别名指向根目录，可使用 @/components/Button 方式导入
- **后续任务依赖**: 完成本任务后，后续功能开发（认证、数据库、UI 组件）将基于此脚手架进行
