import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email("请输入有效的邮箱地址"),
    password: z.string().min(6, "密码至少6位"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次密码输入不一致",
    path: ["confirmPassword"],
  });
