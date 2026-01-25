"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ArrowRight, RotateCcw, AlertTriangle } from "lucide-react";
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
    <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[3rem] border border-white/80 bg-white/60 p-8 shadow-[0_20px_60px_-15px_rgba(167,139,250,0.25)] backdrop-blur-2xl md:p-12">
      <div
        className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-lavender-300 via-coral-300 to-mint-300"
        aria-hidden="true"
      />

      {/* 步骤指示器 */}
      <div className="mb-6 flex items-center justify-center gap-2 pt-4">
        {[
          { key: "idea", label: "创建" },
          { key: "assessment", label: "评估" },
          { key: "result", label: "结果" },
        ].map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            {i > 0 && <div className="h-0.5 w-4 bg-lavender-200" />}
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-colors",
                step === s.key
                  ? "bg-lavender-400 text-white"
                  : "bg-white/60 text-slate-500"
              )}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/30 text-xs">
                {i + 1}
              </span>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Step 1: 点子表单 */}
      {step === "idea" && (
        <>
          <div className="mb-6 flex items-center justify-between gap-6">
            <div>
              <h1 className="mb-1 text-3xl font-script text-slate-800">记录你的奇遇</h1>
              <p className="text-sm font-bold text-slate-500 tabular-nums">Idea Lab #2026-SUB</p>
            </div>
            <span className="material-symbols-outlined text-4xl text-coral-400 rotate-12" aria-hidden="true">
              emoji_objects
            </span>
          </div>

          <form onSubmit={handleSubmit(onIdeaSubmit)} className="space-y-8">
            <div>
              <label htmlFor="title" className="ml-2 mb-2 block text-lg font-bold text-slate-500">
                点子名称
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lavender-400" aria-hidden="true">
                  star
                </span>
                <input
                  {...register("title")}
                  id="title"
                  autoComplete="off"
                  placeholder="给你的梦起个名字..."
                  aria-invalid={!!errors.title}
                  aria-describedby={cn("title-helper", errors.title && "title-error")}
                  className="h-14 w-full rounded-2xl bg-white/50 border-2 border-lavender-200 px-6 pl-12 text-lg font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-colors duration-200 focus:bg-white focus:border-coral-300 focus:ring-4 focus:ring-coral-100 hover:bg-white/80 motion-reduce:transition-none"
                />
                <span className="absolute bottom-4 right-4 text-xs font-medium text-slate-400 tabular-nums">
                  {title.length}/50
                </span>
              </div>
              <p id="title-helper" className="ml-2 mt-2 text-sm font-medium text-slate-500">
                简洁明了，让大家一眼就知道你的点子。
              </p>
              {errors.title && (
                <p id="title-error" className="ml-2 mt-1 text-sm font-medium text-danger">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="ml-2 mb-2 block text-lg font-bold text-slate-500">
                梦境描述
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-5 text-mint-400" aria-hidden="true">
                  edit_note
                </span>
                <textarea
                  {...register("description")}
                  id="description"
                  rows={6}
                  autoComplete="off"
                  placeholder="哪怕是最荒诞的细节，也请告诉我们..."
                  aria-invalid={!!errors.description}
                  aria-describedby={cn("description-helper", errors.description && "description-error")}
                  className="min-h-[140px] w-full resize-none rounded-2xl bg-white/50 border-2 border-lavender-200 px-6 py-4 pl-12 text-lg font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-colors duration-200 focus:bg-white focus:border-coral-300 focus:ring-4 focus:ring-coral-100 hover:bg-white/80 motion-reduce:transition-none"
                />
                <span className="absolute bottom-4 right-4 text-xs font-medium text-slate-400 tabular-nums">
                  {description.length}/1000
                </span>
              </div>
              <p id="description-helper" className="ml-2 mt-2 text-sm font-medium text-slate-500">
                详细描述你的想法、解决的问题、实现思路等。
              </p>
              {errors.description && (
                <p id="description-error" className="ml-2 mt-1 text-sm font-medium text-danger">
                  {errors.description.message}
                </p>
              )}
            </div>

            <fieldset aria-describedby="tags-helper">
              <legend className="ml-2 mb-3 block text-lg font-bold text-slate-500">奇思标签</legend>
              <div className="flex flex-wrap gap-2.5" role="group" aria-label="选择标签">
                {TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    aria-pressed={selectedTags.includes(tag)}
                    className={cn(
                      "rounded-full border-2 px-5 py-2 text-sm font-bold transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff] motion-reduce:transform-none motion-reduce:transition-none",
                      selectedTags.includes(tag)
                        ? "bg-lavender-300 border-lavender-300 text-white shadow-lavender"
                        : "bg-white/60 border-lavender-200 text-slate-600 hover:border-lavender-300 hover:bg-white"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <p id="tags-helper" className="ml-2 mt-2 text-sm font-medium text-slate-500">
                选择相关标签，帮助大家发现你的点子（可选）。
              </p>
              {errors.tags && (
                <p className="ml-2 mt-1 text-sm font-medium text-danger">{errors.tags.message}</p>
              )}
            </fieldset>

            <button
              type="submit"
              className="group flex h-14 w-full items-center justify-center rounded-full bg-coral-400 text-lg font-bold text-white shadow-lg shadow-coral-400/30 transition-transform transition-colors duration-200 hover:-translate-y-1 hover:bg-coral-500 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff] motion-reduce:transform-none motion-reduce:transition-none"
            >
              下一步：评估点子
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:transform-none" />
            </button>
          </form>
        </>
      )}

      {/* Step 2: 评估表单 */}
      {step === "assessment" && (
        <>
          <div className="mb-6 flex items-center justify-between gap-6">
            <div>
              <h1 className="mb-1 text-3xl font-script text-slate-800">评估你的创意</h1>
              <p className="text-sm font-medium text-slate-500">
                对「{ideaData?.title}」进行全方位评估
              </p>
            </div>
            <span className="material-symbols-outlined text-4xl text-lavender-400" aria-hidden="true">
              analytics
            </span>
          </div>
          <ValidatorForm onSubmit={handleAssessmentSubmit} isLoading={isSubmitting} />
          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={() => setStep("idea")} className="text-slate-500">
              返回修改点子
            </Button>
          </div>
        </>
      )}

      {/* Step 3: 结果展示 */}
      {step === "result" && result && (
        <>
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-3xl font-script text-slate-800">{ideaData?.title}</h1>
            <p className="text-sm font-medium text-slate-500">创业点子评估结果</p>
          </div>

          {/* 未达标警告 */}
          {!result.submitted && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border-2 border-coral-200 bg-coral-50 p-4">
              <AlertTriangle className="h-6 w-6 flex-shrink-0 text-coral-500" />
              <div>
                <p className="font-bold text-coral-600">评分未达标，点子未提交</p>
                <p className="text-sm text-coral-500">
                  当前评分 {result.finalScore} 分，需达到 {MIN_SCORE_TO_SUBMIT} 分才能提交。请优化你的点子后重新评估。
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col items-center">
              <h2 className="mb-4 text-lg font-bold text-slate-700">维度分析</h2>
              <RadarChart scores={result.scores} className="w-full max-w-[300px]" />
            </div>
            <div>
              <h2 className="mb-4 text-lg font-bold text-slate-700">评估结果</h2>
              <ResultPanel result={validationResult} />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {result.submitted ? (
              <>
                <Button onClick={() => router.push("/dashboard")} size="lg">
                  <span className="material-symbols-outlined mr-2" aria-hidden="true">
                    dashboard
                  </span>
                  查看我的点子
                </Button>
                <Button variant="secondary" onClick={handleReset} size="lg">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  提交新点子
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setStep("assessment")} size="lg">
                  <span className="material-symbols-outlined mr-2" aria-hidden="true">
                    edit
                  </span>
                  重新评估
                </Button>
                <Button variant="secondary" onClick={() => setStep("idea")} size="lg">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  修改点子
                </Button>
              </>
            )}
          </div>
        </>
      )}

      <div className="pointer-events-none absolute bottom-4 right-4 opacity-50" aria-hidden="true">
        <svg className="h-16 w-16 text-lavender-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 100 100">
          <path d="M10 50 Q 25 25 50 50 T 90 50" />
          <path d="M10 60 Q 25 35 50 60 T 90 60" />
        </svg>
      </div>
    </div>
  );
}
