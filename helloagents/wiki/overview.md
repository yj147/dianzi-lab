# Bambi Lab Idea

> 本文件包含项目级别的核心信息。详细的模块文档见 `modules/` 目录。


## 1. 项目概述

### 目标与背景
Bambi Lab Idea 是一个软件开发服务平台：用户提交点子 → 管理员审核推进 → 已完成案例在首页展示。目标是完成课程作业的核心功能要求，并形成可演示的全栈应用。

### 范围
- **范围内:** 首页展示已完成点子、邮箱密码注册/登录、点子提交、用户中心进度查看、管理后台审核与状态流转、垃圾箱（软删除/恢复/永久删除）
- **范围外:** 点子编辑/删除（用户端）、邮件通知、评论/投票、附件上传、多语言

### 干系人
- **产品/验收:** `docs/dianzi-prd.md`
- **视觉规范:** `docs/ui-style-guide.md`
- **测试用例:** `tests/dianzi-test-cases.md`


## 2. 模块索引

| 模块名称 | 职责 | 状态 | 文档 |
|---------|------|------|------|
| landing | 首页与已完成点子展示 | ✅稳定 | [landing](modules/landing.md) |
| auth | 注册/登录/会话管理 | ✅稳定 | [auth](modules/auth.md) |
| ideas | 点子提交与状态流转 | ✅稳定 | [ideas](modules/ideas.md) |
| dashboard | 用户中心（我的点子） | ✅稳定 | [dashboard](modules/dashboard.md) |
| admin | 管理后台（点子/用户/垃圾箱） | ✅稳定 | [admin](modules/admin.md) |


## 3. 快速链接
- [技术约定](../project.md)
- [架构设计](arch.md)
- [API 手册](api.md)
- [数据模型](data.md)
- [变更历史](../history/index.md)
- [PRD](../../docs/dianzi-prd.md)
- [UI Style Guide](../../docs/ui-style-guide.md)
- [测试用例](../../tests/dianzi-test-cases.md)
