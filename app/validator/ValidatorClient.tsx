"use client";

import { useState, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { ValidatorForm, ResultPanel, RadarChart } from "@/components/validator";
import type {
  ValidatorFormData,
  ValidationResult,
  DimensionScore,
} from "@/components/validator";
import { submitAssessment } from "@/lib/validator-actions";
import type { AssessmentInput } from "@/lib/validator";

type View = "form" | "result";

function formDataToInput(data: ValidatorFormData): AssessmentInput {
  const input: Record<string, number> = {};
  for (const { key, value } of data.scores) {
    input[key] = value;
  }
  return input as AssessmentInput;
}

export default function ValidatorClient() {
  const [view, setView] = useState<View>("form");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastScores, setLastScores] = useState<DimensionScore[]>([]);

  const handleSubmit = useCallback(async (data: ValidatorFormData) => {
    setIsLoading(true);
    try {
      const input = formDataToInput(data);
      const res = await submitAssessment(input);

      if (!res.success) {
        toast({ variant: "destructive", description: res.error });
        return;
      }

      setLastScores(data.scores);
      setResult({
        overallScore: res.finalScore,
        feedback: res.feedback.map((msg) => ({
          type: "warning" as const,
          message: msg,
        })),
        scores: data.scores,
      });
      setView("result");
    } catch {
      toast({ variant: "destructive", description: "提交失败，请重试" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setView("form");
    setResult(null);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-balance font-heading text-3xl font-bold text-brand-dark md:text-4xl">
          创业想法验证器
        </h1>
        <p className="text-pretty mt-2 text-sm text-muted-foreground">
          这是一页内部工具，用于快速跑一遍评估器输出。
        </p>
      </header>

      <div key={view} className="animate-fade-in-up motion-reduce:animate-none">
        {view === "form" ? (
          <ValidatorForm
            onSubmit={handleSubmit}
            initialValues={lastScores.length > 0 ? lastScores : undefined}
            isLoading={isLoading}
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border-2 border-brand-dark bg-brand-surface p-6 shadow-solid-sm">
              <h2 className="font-heading text-lg font-bold text-brand-dark">维度分析</h2>
              <RadarChart scores={result?.scores ?? []} className="mt-4" />
            </section>
            <section>
              <h2 className="mb-4 font-heading text-lg font-bold text-brand-dark">评估结果</h2>
              <ResultPanel result={result} onReset={handleReset} />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
