import type { Dimension } from "./types";

// 5 个核心评估维度
export const DIMENSIONS: Dimension[] = [
  { key: "clarity", label: "需求清晰度", description: "对想要的功能有多明确？" },
  { key: "tech", label: "技术可行性", description: "技术实现的复杂度和可行性" },
  { key: "budget", label: "预算充足度", description: "资源是否充足" },
  { key: "urgency", label: "时间紧迫度", description: "项目的时间要求" },
  { key: "value", label: "商业价值", description: "项目的商业意义和价值" },
];

// 滑块默认值
export const DEFAULT_SCORE = 0;

// 滑块范围
export const MIN_SCORE = 0;
export const MAX_SCORE = 10;
