// 维度定义
export type Dimension = {
  key: string;
  label: string;
  description: string;
};

// 维度分数
export type DimensionScore = {
  key: string;
  value: number;
};

// 表单数据
export type ValidatorFormData = {
  scores: DimensionScore[];
};

// 反馈条目
export type FeedbackItem = {
  type: "success" | "warning" | "error";
  message: string;
};

// 验证结果
export type ValidationResult = {
  overallScore: number;
  feedback: FeedbackItem[];
  scores: DimensionScore[];
};

// 雷达图数据点
export type RadarDataPoint = {
  dimension: string;
  score: number;
  fullMark: number;
};
