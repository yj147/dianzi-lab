"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AlertTriangle, BarChart3, Eye, Lightbulb, Palette, RotateCcw } from "lucide-react";
import { submitIdeaSchema, SubmitIdeaInput, TAGS } from "./schema";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import IdeaCard from "@/components/IdeaCard";
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

  const title = watch("title");
  const description = watch("description");
  const [tagsText, setTagsText] = useState("");

  const parseTagsText = (value: string): (typeof TAGS)[number][] => {
    const unique = new Set<(typeof TAGS)[number]>();
    for (const raw of value.split(",")) {
      const trimmed = raw.trim();
      if (!trimmed) continue;
      if (TAGS.includes(trimmed as (typeof TAGS)[number])) {
        unique.add(trimmed as (typeof TAGS)[number]);
      }
    }
    return Array.from(unique);
  };

  const handleTagsTextChange = (value: string) => {
    setTagsText(value);
    setValue("tags", parseTagsText(value), { shouldValidate: true });
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
          description: "请先填写项目信息",
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
            description: "您的项目已成功提交！",
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
    setTagsText("");
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

  const stepIndicator = (
    <div className="mb-8 flex items-center justify-center gap-2">
      {(
        [
          { key: "idea", label: "创建" },
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
  );

  if (step === "idea") {
    const rawPreviewTags = tagsText
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const previewTags = rawPreviewTags.length > 0 ? rawPreviewTags : ["标签1", "标签2"];

    const previewIdea = {
      id: "PREVIEW",
      title: title.trim() ? title : "项目标题",
      description: description.trim() ? description : "这里将显示你对创意的详细描述...",
      tags: previewTags,
      status: "PENDING" as const,
      authorName: "当前用户",
    };

    return (
      <div>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-6 inline-flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-brand-dark"
        >
          &larr; 返回首页
        </button>

        <div className="grid items-start gap-8 md:gap-12 lg:grid-cols-2">
          <div className="animate-fade-in-left motion-reduce:animate-none">
            <h1 className="mb-2 font-heading text-3xl font-bold text-brand-dark md:text-4xl">绘制蓝图</h1>
            <p className="mb-8 text-lg text-gray-600">清晰的描述是落地的第一步。</p>

            <form
              onSubmit={handleSubmit(onIdeaSubmit)}
              className="space-y-6 rounded-xl border-2 border-brand-dark bg-white p-6 shadow-solid md:p-8"
            >
              <div>
                <label htmlFor="title" className="mb-2 block font-heading text-lg font-bold text-brand-dark">
                  标题 <span className="text-brand-accent">*</span>
                </label>
                <input
                  {...register("title")}
                  id="title"
                  maxLength={50}
                  autoComplete="off"
                  placeholder="给你的项目起个响亮的名字"
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? "title-error" : undefined}
                  className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3 text-lg font-medium text-brand-dark outline-none transition-colors focus:border-brand-primary focus:bg-white focus:outline-none motion-reduce:transition-none"
                />
                <div className="mt-1 text-right font-mono text-xs text-gray-400 tabular-nums">
                  {title.length}/50
                </div>
                {errors.title ? (
                  <p id="title-error" className="mt-1 text-sm font-medium text-red-600">
                    {errors.title.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block font-heading text-lg font-bold text-brand-dark"
                >
                  核心描述 <span className="text-brand-accent">*</span>
                </label>
                <textarea
                  {...register("description")}
                  id="description"
                  maxLength={1000}
                  autoComplete="off"
                  placeholder="解决了什么痛点？核心功能是什么？目标用户是谁？请尽可能详细描述场景..."
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? "description-error" : undefined}
                  className="min-h-[240px] w-full resize-y rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3 text-base leading-relaxed text-brand-dark outline-none transition-colors focus:border-brand-primary focus:bg-white focus:outline-none motion-reduce:transition-none"
                />
                <div className="mt-1 text-right font-mono text-xs text-gray-400 tabular-nums">
                  {description.length}/1000
                </div>
                {errors.description ? (
                  <p id="description-error" className="mt-1 text-sm font-medium text-red-600">
                    {errors.description.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block font-heading text-lg font-bold text-brand-dark">标签</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Palette size={18} aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    placeholder="工具, AI, 效率 (用逗号分隔)"
                    className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3 pl-10 font-mono text-sm text-brand-dark outline-none transition-colors focus:border-brand-primary focus:bg-white focus:outline-none motion-reduce:transition-none"
                    value={tagsText}
                    onChange={(e) => handleTagsTextChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
                <Button type="button" variant="ghost" onClick={() => router.push("/")}>
                  取消
                </Button>
                <Button type="submit" size="lg">
                  下一步：创意评估
                </Button>
              </div>
            </form>
          </div>

          <div className="sticky top-28 hidden lg:block animate-fade-in-right motion-reduce:animate-none">
            <div className="mb-4 flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider text-gray-500">
              <Eye size={16} aria-hidden="true" /> 实时预览
            </div>

            <div className="rounded-2xl border-2 border-brand-dark/10 bg-[#E5E5E5] p-8">
              <IdeaCard idea={previewIdea} className="pointer-events-none transform scale-105" />

              <div className="mt-8 space-y-4">
                <div className="h-2 w-3/4 rounded-full bg-gray-300 opacity-50" />
                <div className="h-2 w-1/2 rounded-full bg-gray-300 opacity-50" />
                <div className="h-2 w-5/6 rounded-full bg-gray-300 opacity-50" />
              </div>
            </div>

            <div className="mt-6 flex gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
              <Lightbulb className="flex-shrink-0" size={20} aria-hidden="true" />
              <p>
                提示：好的创意通常包含具体的应用场景。例如“一个专门给设计师用的番茄钟”，比“做一个好用的倒计时”更具吸引力。
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl overflow-hidden rounded-2xl border-2 border-brand-dark bg-white p-8 shadow-solid-lg">
      {stepIndicator}

      <div key={step} className="animate-fade-in-up motion-reduce:animate-none">
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
                返回修改项目
              </Button>
            </div>
          </>
        ) : null}

        {/* Step 3: 结果展示 */}
        {step === "result" && result ? (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-balance font-heading text-3xl font-bold text-brand-dark">{ideaData?.title}</h1>
              <p className="mt-2 text-sm text-gray-600">创业项目评估结果</p>
            </div>

            {!result.submitted ? (
              <div className="mb-6 flex items-start gap-3 rounded-xl border-2 border-red-200 bg-red-50 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" aria-hidden="true" />
                <div>
                  <p className="font-heading text-sm font-bold text-red-700">评分未达标，项目未提交</p>
                  <p className="mt-1 text-pretty text-sm text-red-700/80">
                    当前评分 {result.finalScore} 分，需达到 {MIN_SCORE_TO_SUBMIT} 分才能提交。请优化后重新评估。
                  </p>
                </div>
              </div>
            ) : null}

            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-xl border-2 border-brand-dark bg-brand-surface p-6 shadow-solid-sm">
                <h2 className="font-heading text-lg font-bold text-brand-dark">维度分析</h2>
                <RadarChart scores={result.scores} className="mx-auto mt-4 w-full max-w-[380px]" />
              </div>

              <div className="rounded-xl border-2 border-brand-dark bg-brand-surface p-6 shadow-solid-sm">
                <h2 className="font-heading text-lg font-bold text-brand-dark">评估结果</h2>
                <ResultPanel
                  result={validationResult}
                  className="mt-4 rounded-none border-0 bg-transparent p-0 shadow-none"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {result.submitted ? (
                <>
                  <Button onClick={() => router.push("/dashboard")} size="lg">
                    查看我的工坊
                  </Button>
                  <Button variant="secondary" onClick={handleReset} size="lg">
                    <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                    提交新项目
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setStep("assessment")} size="lg">
                    重新评估
                  </Button>
                  <Button variant="secondary" onClick={() => setStep("idea")} size="lg">
                    <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                    修改项目
                  </Button>
                </>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
