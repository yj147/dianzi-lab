"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, BarChart3, RotateCcw, Sparkles } from "lucide-react";
import { submitIdeaSchema, SubmitIdeaInput, TAGS } from "./schema";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ValidatorForm from "@/components/validator/ValidatorForm";
import RadarChart from "@/components/validator/RadarChart";
import ResultPanel from "@/components/validator/ResultPanel";
import { submitIdeaWithAssessment } from "@/lib/idea-actions";
import { calculateScore, getRuleFeedback } from "@/lib/validator";
import type { ValidatorFormData, DimensionScore, ValidationResult, FeedbackItem } from "@/components/validator/types";
import type { AssessmentInput } from "@/lib/validator";

const MIN_SCORE_TO_SUBMIT = 50;

type Step = "idea" | "assessment" | "result";

export default function SubmitForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("idea");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ideaData, setIdeaData] = useState<SubmitIdeaInput | null>(null);
  const [result, setResult] = useState<{
    ideaId: string | null;
    finalScore: number;
    feedback: string[];
    scores: DimensionScore[];
    submitted: boolean;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SubmitIdeaInput>({
    resolver: zodResolver(submitIdeaSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
    },
  });

  const selectedTags = watch("tags");
  const title = watch("title");
  const description = watch("description");
  const previewTags = selectedTags.length > 0 ? selectedTags : (["标签1", "标签2"] as const);

  const toggleTag = (tag: (typeof TAGS)[number]) => {
    const currentTags = [...selectedTags];
    const index = currentTags.indexOf(tag);
    if (index > -1) {
      currentTags.splice(index, 1);
    } else {
      currentTags.push(tag);
    }
    setValue("tags", currentTags, { shouldValidate: true });
  };

  // Step 1: 点子表单提交 → 进入评估
  const onIdeaSubmit = (data: SubmitIdeaInput) => {
    setIdeaData(data);
    setStep("assessment");
  };

  // Step 2: 评估表单提交 → 计算评分 → 决定是否提交
  const handleAssessmentSubmit = useCallback(
    async (data: ValidatorFormData) => {
      if (!ideaData) {
        toast({
          variant: "destructive",
          title: "错误",
          description: "请先填写点子信息",
        });
        setStep("idea");
        return;
      }

      const assessmentInput: AssessmentInput = {
        targetUser: 0,
        channel: 0,
        market: 0,
        tech: 0,
        budget: 0,
        businessModel: 0,
        team: 0,
        risk: 0,
        traffic: 0,
      };
      for (const score of data.scores) {
        if (score.key in assessmentInput) {
          assessmentInput[score.key as keyof AssessmentInput] = score.value;
        }
      }

      // 先计算评分
      const finalScore = calculateScore(assessmentInput);
      const ruleFeedback = getRuleFeedback(assessmentInput, finalScore);
      const feedback = ruleFeedback.map((r) => r.advice);

      // 评分不足 50，不提交，直接展示结果
      if (finalScore < MIN_SCORE_TO_SUBMIT) {
        setResult({
          ideaId: null,
          finalScore,
          feedback,
          scores: data.scores,
          submitted: false,
        });
        setStep("result");
        toast({
          variant: "destructive",
          title: "评分未达标",
          description: `当前评分 ${finalScore} 分，需达到 ${MIN_SCORE_TO_SUBMIT} 分才能提交`,
        });
        return;
      }

      // 评分达标，提交到服务器
      setIsSubmitting(true);
      try {
        const serverResult = await submitIdeaWithAssessment(
          {
            title: ideaData.title,
            description: ideaData.description,
            tags: ideaData.tags,
          },
          assessmentInput
        );

        if (serverResult.success) {
          setResult({
            ideaId: serverResult.ideaId,
            finalScore: serverResult.finalScore,
            feedback: serverResult.feedback,
            scores: data.scores,
            submitted: true,
          });
          setStep("result");
          toast({
            variant: "success",
            title: "提交成功",
            description: "您的点子已成功提交！",
          });
        } else {
          toast({
            variant: "destructive",
            title: "提交失败",
            description: serverResult.error,
          });
          if (serverResult.stage === "idea") {
            setStep("idea");
          }
        }
      } catch {
        toast({
          variant: "destructive",
          title: "出错了",
          description: "发生未知错误，请稍后再试",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [ideaData, toast]
  );

  // 重新开始
  const handleReset = () => {
    setStep("idea");
    setIdeaData(null);
    setResult(null);
    reset();
  };

  // 转换结果为 ResultPanel 格式
  const validationResult: ValidationResult | null = result
    ? {
        overallScore: result.finalScore,
        feedback: result.feedback.map((msg): FeedbackItem => ({
          type: result.finalScore >= 70 ? "success" : result.finalScore >= 40 ? "warning" : "error",
          message: msg,
        })),
        scores: result.scores,
      }
    : null;

  return (
    <div className="w-full max-w-6xl overflow-hidden rounded-2xl border-2 border-brand-dark bg-white p-8 shadow-solid-lg">
      {/* 步骤指示器 */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {(
          [
            { key: "idea", label: "点子" },
            { key: "assessment", label: "评估" },
            { key: "result", label: "结果" },
          ] as const
        ).map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            {i > 0 ? <div className="h-px w-6 bg-brand-dark/20" aria-hidden="true" /> : null}
            <div
              className={cn(
                "flex items-center gap-2 rounded-full border-2 px-3 py-1.5 font-heading text-sm font-bold transition-colors duration-200 motion-reduce:transition-none",
                step === s.key
                  ? "border-brand-dark bg-brand-dark text-white"
                  : "border-gray-200 bg-gray-100 text-gray-600"
              )}
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-xs font-mono",
                  step === s.key ? "bg-white/15 text-white" : "bg-white text-gray-500"
                )}
              >
                {i + 1}
              </span>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Step 1: 点子表单 */}
      {step === "idea" ? (
        <>
          <div className="mb-6 flex items-start justify-between gap-6">
            <div>
              <h1 className="font-heading text-2xl font-bold text-brand-dark">点子信息</h1>
              <p className="mt-1 font-mono text-xs text-gray-400">IDEA LAB · SUBMIT</p>
            </div>
            <Sparkles size={24} className="text-brand-accent" aria-hidden="true" />
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
            <form onSubmit={handleSubmit(onIdeaSubmit)} className="space-y-6">
              <div>
                <label htmlFor="title" className="mb-1.5 block text-xs font-bold text-gray-700 uppercase">
                  标题
                </label>
                <div className="relative">
                  <input
                    {...register("title")}
                    id="title"
                    autoComplete="off"
                    placeholder="给你的点子起个响亮的名字"
                    aria-invalid={!!errors.title}
                    aria-describedby={cn("title-helper", errors.title && "title-error")}
                    className="h-11 w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 text-base text-brand-dark placeholder:text-gray-400 outline-none transition-colors duration-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:bg-white motion-reduce:transition-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-gray-400 tabular-nums">
                    {title.length}/50
                  </span>
                </div>
                <p id="title-helper" className="mt-2 text-sm text-gray-600">
                  简洁明确：一句话让人知道你要解决什么问题。
                </p>
                {errors.title ? (
                  <p id="title-error" className="mt-1 text-sm font-medium text-red-600">
                    {errors.title.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-1.5 block text-xs font-bold text-gray-700 uppercase"
                >
                  描述
                </label>
                <div className="relative">
                  <textarea
                    {...register("description")}
                    id="description"
                    rows={8}
                    autoComplete="off"
                    placeholder="解决了什么痛点？核心功能是什么？目标用户是谁？请尽可能详细描述场景..."
                    aria-invalid={!!errors.description}
                    aria-describedby={cn("description-helper", errors.description && "description-error")}
                    className="min-h-[240px] w-full resize-y rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3 text-base leading-relaxed text-brand-dark placeholder:text-gray-400 outline-none transition-colors duration-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:bg-white motion-reduce:transition-none"
                  />
                  <span className="absolute bottom-3 right-3 font-mono text-xs text-gray-400 tabular-nums">
                    {description.length}/1000
                  </span>
                </div>
                <p id="description-helper" className="mt-2 text-sm text-gray-600">
                  写得越具体，评估越准确，也更容易被采纳。
                </p>
                {errors.description ? (
                  <p id="description-error" className="mt-1 text-sm font-medium text-red-600">
                    {errors.description.message}
                  </p>
                ) : null}
              </div>

              <fieldset aria-describedby="tags-helper">
                <legend className="mb-2 block text-xs font-bold text-gray-700 uppercase">标签</legend>
                <div className="flex flex-wrap gap-2" role="group" aria-label="选择标签">
                  {TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        aria-pressed={isSelected}
                        className={cn(
                          "rounded-full border-2 px-3 py-1 text-xs font-mono transition-[transform,box-shadow,background-color,color,border-color] duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                          isSelected
                            ? "border-brand-dark bg-brand-primary text-white shadow-solid-sm hover:-translate-y-0.5"
                            : "border-gray-200 bg-gray-100 text-gray-600 hover:border-brand-dark/40 hover:bg-gray-200"
                        )}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                <p id="tags-helper" className="mt-2 text-sm text-gray-600">
                  可选：帮助管理员更快定位你的点子类型。
                </p>
                {errors.tags ? (
                  <p className="mt-1 text-sm font-medium text-red-600">{errors.tags.message}</p>
                ) : null}
              </fieldset>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => router.push("/dashboard")}
                >
                  取消
                </Button>
                <Button type="submit" size="lg" className="w-full sm:flex-1">
                  下一步：创意评估
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Button>
              </div>
            </form>

            <aside className="rounded-xl border-2 border-brand-dark bg-brand-bg p-5 shadow-solid-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-heading text-lg font-bold text-brand-dark">实时预览</h2>
                <span className="font-mono text-xs text-gray-500">PREVIEW</span>
              </div>

              <div className="mt-4 rounded-xl border-2 border-brand-dark bg-white p-5 shadow-solid-sm">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-mono text-xs text-gray-400">PREVIEW</p>
                  <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-mono text-sm font-medium text-amber-600">
                    审核中
                  </span>
                </div>

                <h3 className="mt-4 text-balance font-heading text-xl font-bold leading-tight text-brand-dark">
                  {title.trim() ? title : "点子标题"}
                </h3>

                <p className="mt-2 text-pretty text-sm leading-relaxed text-gray-600 line-clamp-5">
                  {description.trim() ? description : "这里将显示你对点子的详细描述..."}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {previewTags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-md bg-gray-100 px-2 py-1 font-mono text-xs text-gray-500">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-full border-2 border-brand-dark bg-brand-bg font-heading text-sm font-bold text-brand-dark shadow-solid-sm">
                    你
                  </div>
                  <p className="font-mono text-xs text-gray-600">当前用户</p>
                </div>
              </div>

              <p className="mt-4 text-pretty text-sm text-gray-600">
                提示：好的点子通常包含具体的应用场景。例如“一个专门给设计师用的番茄钟”，比“做一个好用的倒计时”更具吸引力。
              </p>
            </aside>
          </div>
        </>
      ) : null}

      {/* Step 2: 评估表单 */}
      {step === "assessment" ? (
        <>
          <div className="mb-6 flex items-start justify-between gap-6">
            <div>
              <h1 className="font-heading text-2xl font-bold text-brand-dark">创意评估</h1>
              <p className="mt-1 text-sm text-gray-600">对「{ideaData?.title}」进行 9 维度打分</p>
            </div>
            <BarChart3 size={24} className="text-brand-primary" aria-hidden="true" />
          </div>

          <ValidatorForm onSubmit={handleAssessmentSubmit} isLoading={isSubmitting} />

          <div className="mt-6 text-center">
            <Button variant="ghost" onClick={() => setStep("idea")}>
              返回修改点子
            </Button>
          </div>
        </>
      ) : null}

      {/* Step 3: 结果展示 */}
      {step === "result" && result ? (
        <>
          <div className="mb-6 text-center">
            <h1 className="text-balance font-heading text-3xl font-bold text-brand-dark">{ideaData?.title}</h1>
            <p className="mt-2 text-sm text-gray-600">创业点子评估结果</p>
          </div>

          {!result.submitted ? (
            <div className="mb-6 flex items-start gap-3 rounded-xl border-2 border-red-200 bg-red-50 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" aria-hidden="true" />
              <div>
                <p className="font-heading text-sm font-bold text-red-700">评分未达标，点子未提交</p>
                <p className="mt-1 text-pretty text-sm text-red-700/80">
                  当前评分 {result.finalScore} 分，需达到 {MIN_SCORE_TO_SUBMIT} 分才能提交。请优化后重新评估。
                </p>
              </div>
            </div>
          ) : null}

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border-2 border-brand-dark bg-brand-bg p-5 shadow-solid-sm">
              <h2 className="font-heading text-lg font-bold text-brand-dark">维度分析</h2>
              <div className="mt-4">
                <RadarChart scores={result.scores} className="w-full" />
              </div>
            </div>

            <div className="rounded-xl border-2 border-brand-dark bg-brand-bg p-5 shadow-solid-sm">
              <h2 className="font-heading text-lg font-bold text-brand-dark">评估结果</h2>
              <div className="mt-4">
                <ResultPanel result={validationResult} />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {result.submitted ? (
              <>
                <Button onClick={() => router.push("/dashboard")} size="lg">
                  查看我的点子
                </Button>
                <Button variant="secondary" onClick={handleReset} size="lg">
                  <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                  提交新点子
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setStep("assessment")} size="lg">
                  重新评估
                </Button>
                <Button variant="secondary" onClick={() => setStep("idea")} size="lg">
                  <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                  修改点子
                </Button>
              </>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
