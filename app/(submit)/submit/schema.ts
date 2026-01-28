import { z } from "zod";

export const TAGS = ["工具", "效率", "娱乐", "学习", "其他"] as const;

export const BUDGET_RANGES = [
  "1万以内",
  "1-3万",
  "3-5万",
  "5-10万",
  "10万以上",
  "不确定，需要评估"
] as const;

export const submitIdeaSchema = z.object({
  title: z
    .string()
    .min(1, "标题不能为空")
    .max(50, "标题不能超过50个字符"),
  description: z
    .string()
    .min(1, "描述不能为空")
    .max(1000, "描述不能超过1000个字符"),
  budgetRange: z
    .enum(BUDGET_RANGES, { required_error: "请选择预算范围" }),
  contact: z
    .string()
    .min(1, "联系方式不能为空")
    .max(50, "联系方式不能超过50个字符"),
  tags: z.array(z.enum(TAGS)),
});

export type SubmitIdeaInput = z.infer<typeof submitIdeaSchema>;
