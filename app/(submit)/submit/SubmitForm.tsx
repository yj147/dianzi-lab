"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { submitIdea, ActionResult } from "./actions";
import { submitIdeaSchema, SubmitIdeaInput, TAGS } from "./schema";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export default function SubmitForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
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

  const onSubmit = async (data: SubmitIdeaInput) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    data.tags.forEach((tag) => formData.append("tags", tag));

    try {
      const result: ActionResult = await submitIdea(formData);
      if (result.success) {
        toast({
          variant: "success",
          title: "提交成功",
          description: "您的点子已成功提交！",
        });
        router.push("/dashboard");
      } else {
        if (result.field) {
          setError(result.field as keyof SubmitIdeaInput, {
            type: "manual",
            message: result.error,
          });
        } else {
          toast({
            variant: "destructive",
            title: "提交失败",
            description: result.error,
          });
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
  };

  return (
    <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[3rem] border border-white/80 bg-white/60 p-8 shadow-[0_20px_60px_-15px_rgba(167,139,250,0.25)] backdrop-blur-2xl md:p-12">
      <div
        className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-lavender-300 via-coral-300 to-mint-300"
        aria-hidden="true"
      />

      <div className="mb-8 flex items-center justify-between gap-6 pt-4">
        <div>
          <h1 className="mb-1 text-4xl font-script text-slate-800">记录你的奇遇</h1>
          <p className="text-sm font-bold text-slate-500 tabular-nums">Idea Lab #2026-SUB</p>
        </div>
        <span className="material-symbols-outlined text-5xl text-yellow-400 rotate-12" aria-hidden="true">
          emoji_objects
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <label
            htmlFor="title"
            className="ml-2 mb-2 block text-lg font-bold text-slate-500"
          >
            点子名称
          </label>
          <div className="relative">
            <span
              className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lavender-400"
              aria-hidden="true"
            >
              star
            </span>
            <input
              {...register("title")}
              id="title"
              autoComplete="off"
              placeholder="给你的梦起个名字..."
              aria-invalid={!!errors.title}
              aria-describedby={cn(
                "title-helper",
                errors.title && "title-error"
              )}
              className="h-14 w-full rounded-2xl bg-white/50 border-2 border-lavender-200 px-6 pl-12 text-lg font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-coral-300 focus:ring-4 focus:ring-coral-100 hover:bg-white/80"
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
          <label
            htmlFor="description"
            className="ml-2 mb-2 block text-lg font-bold text-slate-500"
          >
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
              aria-describedby={cn(
                "description-helper",
                errors.description && "description-error"
              )}
              className="min-h-[140px] w-full resize-none rounded-2xl bg-white/50 border-2 border-lavender-200 px-6 py-4 pl-12 text-lg font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-coral-300 focus:ring-4 focus:ring-coral-100 hover:bg-white/80"
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
          <legend className="ml-2 mb-3 block text-lg font-bold text-slate-500">
            奇思标签
          </legend>
          <div className="flex flex-wrap gap-2.5" role="group" aria-label="选择标签">
            {TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-pressed={selectedTags.includes(tag)}
                className={cn(
                  "rounded-full border-2 px-5 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff]",
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
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="group flex h-14 w-full items-center justify-center rounded-full bg-coral-400 text-lg font-bold text-white shadow-lg shadow-coral-400/30 transition-transform hover:-translate-y-1 hover:bg-coral-500 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              提交中…
            </>
          ) : (
            <>
              编织梦想
              <span className="material-symbols-outlined ml-2 transition-transform group-hover:rotate-12" aria-hidden="true">
                auto_awesome
              </span>
            </>
          )}
        </button>
      </form>

      <div className="pointer-events-none absolute bottom-4 right-4 opacity-50" aria-hidden="true">
        <svg className="h-16 w-16 text-lavender-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 100 100">
          <path d="M10 50 Q 25 25 50 50 T 90 50" />
          <path d="M10 60 Q 25 35 50 60 T 90 60" />
        </svg>
      </div>
    </div>
  );
}
