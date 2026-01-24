"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ValidationResult, FeedbackItem } from "./types";

type ResultPanelProps = {
  result: ValidationResult | null;
  onReset?: () => void;
  isLoading?: boolean;
  className?: string;
};

// 反馈类型到 Alert variant 的映射
const feedbackVariantMap: Record<
  FeedbackItem["type"],
  "success" | "warning" | "destructive"
> = {
  success: "success",
  warning: "warning",
  error: "destructive",
};

// 反馈类型到 Material Symbols 图标的映射
const feedbackIconMap: Record<FeedbackItem["type"], string> = {
  success: "check_circle",
  warning: "warning",
  error: "error",
};

export default function ResultPanel({
  result,
  onReset,
  isLoading = false,
  className,
}: ResultPanelProps) {
  // 加载状态
  if (isLoading) {
    return (
      <div
        className={cn(
          "space-y-4 rounded-3xl bg-white/40 p-6 backdrop-blur-sm",
          className
        )}
      >
        <div className="h-16 animate-pulse rounded-lg bg-lavender-100" />
        <div className="space-y-2">
          <div className="h-12 animate-pulse rounded-lg bg-lavender-50" />
          <div className="h-12 animate-pulse rounded-lg bg-lavender-50" />
        </div>
      </div>
    );
  }

  // 无结果状态
  if (!result) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-3xl bg-white/40 p-8 backdrop-blur-sm",
          className
        )}
      >
        <p className="text-slate-500">完成评估后，结果将在此展示</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "space-y-6 rounded-3xl bg-white/40 p-6 backdrop-blur-sm",
        className
      )}
    >
      {/* 总分展示 */}
      <div className="text-center">
        <p className="mb-2 text-sm text-slate-500">综合评分</p>
        <div className="text-6xl font-bold text-lavender-500">
          {result.overallScore}
        </div>
        <p className="mt-1 text-sm text-slate-400">满分 100</p>
      </div>

      {/* 反馈列表 */}
      {result.feedback.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-slate-700">评估反馈</h3>
          <div className="space-y-2">
            {result.feedback.map((item, index) => (
              <Alert key={index} variant={feedbackVariantMap[item.type]}>
                <AlertDescription className="flex items-start gap-2">
                  <span className="material-symbols-outlined flex-shrink-0 text-base">
                    {feedbackIconMap[item.type]}
                  </span>
                  <span>{item.message}</span>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* 重新评估按钮 */}
      {onReset && (
        <div className="flex justify-center pt-2">
          <Button variant="secondary" onClick={onReset}>
            重新评估
          </Button>
        </div>
      )}
    </div>
  );
}
