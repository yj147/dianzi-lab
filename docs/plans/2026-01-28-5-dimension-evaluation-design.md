# 5 维度评估方案设计（2026-01-28）

## 背景

当前评估体系为 9 维度，用户与运营反馈复杂度偏高，需收敛为 5 个核心维度，并删除旧字段与规则。

## 目标

- 评估维度从 9 简化为 5：clarity / tech / budget / urgency / value
- 评分模型 KISS：等权平均，0-10 -> 0-100
- UI/规则/数据模型全链路一致，避免硬编码
- 删除旧字段与旧规则，不迁移历史评估数据

## 非目标

- 不保留或迁移历史 9 维评估记录
- 不引入复杂权重或乘数惩罚

## 维度定义

| key     | 中文名     | 说明                 | 评分范围 |
| ------- | ---------- | -------------------- | -------- |
| clarity | 需求清晰度 | 需求是否明确、可验证 | 0-10     |
| tech    | 技术可行性 | 技术复杂度与可实现性 | 0-10     |
| budget  | 预算充足度 | 预算是否支撑交付     | 0-10     |
| urgency | 时间紧迫度 | 时效压力与窗口期     | 0-10     |
| value   | 商业价值   | 价值规模与重要性     | 0-10     |

## 评分模型

- 每维 0-10
- 最终分数：round((sum / 50) \* 100)
- 不使用乘数惩罚

## 数据模型变更

- `prisma/schema.prisma`:
  - `Assessment` 删除旧 9 维字段
  - 新增 `clarity/tech/budget/urgency/value`（`SmallInt`）
  - `finalScore/feedback` 保留
- `lib/validator.ts`:
  - `AssessmentInput` / `assessmentInputSchema` / 权重表改为 5 维
- `rules/validator_v1.rules.json`:
  - 规则条件字段统一改为新 key，删除旧 key 规则

## UI/文案与数据流

- `components/validator/constants.ts` 仅保留 5 维
- 表单滑块、雷达图、结果展示全部由 `DIMENSIONS` 驱动
- 提交页与结果页文案改为“5 维度”
- 管理后台/详情页读取与展示新字段

## 迁移策略（破坏性）

- 开发环境：`prisma db push` 覆盖 schema
- 线上：直接删除旧字段或清空 `Assessment` 表
- 不做历史数据迁移

## 测试策略

- 更新 `tests/dianzi-test-cases.md` 中评估维度相关用例
- 更新现有 Jest 组件测试：
  - 滑块数量与文案
  - 结果页维度数量
  - 评分计算的基准用例

## 风险与缓解

- 风险：历史评估数据丢失
  - 缓解：明确告知并在上线前清理评估表
- 风险：规则 key 不一致导致空反馈
  - 缓解：规则与 schema 同步改动，添加最小单测
