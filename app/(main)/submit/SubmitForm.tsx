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
    <div className="w-full max-w-2xl bg-white/40 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 ring-1 ring-white/60 md:p-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent sm:text-4xl">
          提交新点子
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          分享你的创意，让大家一起完善它
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700 mb-2 ml-1"
          >
            标题
          </label>
          <div className="relative">
            <input
              {...register("title")}
              id="title"
              autoComplete="off"
              placeholder="为你的点子起个吸引人的标题"
              aria-invalid={!!errors.title}
              aria-describedby={cn(
                "title-helper",
                errors.title && "title-error"
              )}
              className="w-full h-14 px-5 rounded-2xl bg-white/50 border border-gray-200 text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 hover:bg-white/80"
            />
            <span className="absolute right-4 bottom-4 text-xs font-medium text-gray-400">
              {title.length}/50
            </span>
          </div>
          <p id="title-helper" className="text-sm text-gray-500 mt-2 ml-1">
            简洁明了，让大家一眼就知道你的点子
          </p>
          {errors.title && (
            <p id="title-error" className="mt-1 text-sm text-red-500 ml-1">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 mb-2 ml-1"
          >
            描述
          </label>
          <div className="relative">
            <textarea
              {...register("description")}
              id="description"
              rows={6}
              autoComplete="off"
              placeholder="详细描述你的点子，包括它解决什么问题、如何实现等"
              aria-invalid={!!errors.description}
              aria-describedby={cn(
                "description-helper",
                errors.description && "description-error"
              )}
              className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-gray-200 text-gray-900 placeholder:text-gray-400 outline-none resize-none transition-all focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 hover:bg-white/80"
            />
            <span className="absolute right-4 bottom-4 text-xs font-medium text-gray-400">
              {description.length}/1000
            </span>
          </div>
          <p id="description-helper" className="text-sm text-gray-500 mt-2 ml-1">
            详细描述你的想法、解决的问题、实现思路等
          </p>
          {errors.description && (
            <p id="description-error" className="mt-1 text-sm text-red-500 ml-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <fieldset aria-describedby="tags-helper">
          <legend className="block text-sm font-semibold text-gray-700 mb-3 ml-1">
            标签
          </legend>
          <div className="flex flex-wrap gap-2.5" role="group" aria-label="选择标签">
            {TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-pressed={selectedTags.includes(tag)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 shadow-sm hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  selectedTags.includes(tag)
                    ? "bg-primary border-primary text-white shadow-primary/25 shadow-lg"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
          <p id="tags-helper" className="text-sm text-gray-500 mt-2 ml-1">
            选择相关标签，帮助大家发现你的点子（可选）
          </p>
          {errors.tags && (
            <p className="mt-1 text-sm text-red-500 ml-1">{errors.tags.message}</p>
          )}
        </fieldset>

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="w-full flex items-center justify-center rounded-full bg-[var(--cta)] h-14 text-lg font-bold text-gray-900 shadow-lg shadow-yellow-500/20 transition-all hover:shadow-xl hover:shadow-yellow-500/30 hover:-translate-y-1 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cta)] focus-visible:ring-offset-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              提交中…
            </>
          ) : (
            "发布点子"
          )}
        </button>
      </form>
    </div>
  );
}
