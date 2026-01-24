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
    <main className="min-h-screen bg-gradient-to-br from-lavender-50 to-white px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-slate-800">
          创业想法验证器
        </h1>

        {view === "form" ? (
          <ValidatorForm
            onSubmit={handleSubmit}
            initialValues={lastScores.length > 0 ? lastScores : undefined}
            isLoading={isLoading}
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            <RadarChart scores={result?.scores ?? []} className="h-80" />
            <ResultPanel result={result} onReset={handleReset} />
          </div>
        )}
      </div>
    </main>
  );
}
