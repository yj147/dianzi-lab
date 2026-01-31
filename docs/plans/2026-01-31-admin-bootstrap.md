# Admin Bootstrap (Production) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 让生产环境管理员账号可被“可重复、可审计、低风险”地初始化/重置（不在代码里硬编码个人邮箱/密码，不把明文密码落库/落 git）。

**Architecture:** 继续使用 `prisma/seed.ts` 的 hardened 逻辑；新增一个最小运维脚本，临时拉取 Vercel Production 环境变量到临时文件，交互式输入管理员邮箱/密码后执行 `prisma db seed` 写入 hash。更新 `CLAUDE.md`，明确“本地默认账号仅限开发环境”，并写清生产初始化流程。

**Tech Stack:** Vercel CLI, Prisma seed, Bash

---

### Task 1: 文档澄清生产管理员初始化方式

**Files:**
- Modify: `CLAUDE.md`

**Step 1: 更新 seed 账号描述**
- 把 “admin@dianzi.com / admin123” 明确标注为 **仅本地开发默认值**
- 生产环境必须使用 `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`（且禁止 `admin123`）

**Step 2: 增加生产初始化/重置流程**
- 给出一条命令入口（后续 Task 2/3 提供的脚本/ npm script）
- 说明：生产管理员密码不可找回，只能重置（重新跑 seed）

**Step 3: 本地验证**
- Run: `rg -n "admin123" CLAUDE.md`
- Expected: 只在“本地默认”说明里出现

---

### Task 2: 增加生产管理员 seed 工具脚本（不落地 secrets）

**Files:**
- Create: `scripts/seed-admin-production.sh`

**Step 1: 脚本逻辑**
- `set -euo pipefail`
- `mktemp` 创建临时 env 文件，`trap` 清理
- `vercel env pull <tmpfile> --environment=production -y` 拉取生产 env
- `set -a; source <tmpfile>; set +a` 导出 env
- 交互式输入管理员邮箱与密码（密码隐藏输入）
- 设置 `SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD` 并执行 `npx prisma db seed`

**Step 2: 本地语法验证**
- Run: `bash -n scripts/seed-admin-production.sh`
- Expected: exit code 0

---

### Task 3: 提供 npm 命令入口

**Files:**
- Modify: `package.json`

**Step 1: 新增 scripts**
- 添加 `ops:seed-admin:production` 指向 `bash scripts/seed-admin-production.sh`

**Step 2: 轻量验证（不真的改生产数据）**
- Run: `npm run -s ops:seed-admin:production -- --help`
- Expected: 若脚本不支持参数则直接输出使用说明/提示（允许失败，但不得泄露 secrets）

---

### Task 4: 提交并推送

**Step 1: 检查改动**
- Run: `git diff --name-only`
- Expected: 仅包含本次相关文件

**Step 2: 提交**
- `git commit -am "docs: clarify production admin bootstrap" && git commit ...`（按实际拆分）

**Step 3: 推送**
- Run: `git push`

