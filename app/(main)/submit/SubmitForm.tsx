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
    <div className="w-full max-w-2xl bg-white/20 backdrop-blur-xl rounded-xl shadow-2xl p-8 ring-1 ring-white/30">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          提交新点子
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          分享你的创意，让大家一起完善它
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
          >
            标题
          </label>
          <div className="relative">
            <input
              {...register("title")}
              id="title"
              placeholder="为你的点子起个吸引人的标题"
              aria-invalid={!!errors.title}
              aria-describedby={cn(
                "title-helper",
                errors.title && "title-error"
              )}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-500"
            />
            <span className="absolute right-3 bottom-3 text-xs text-gray-500">
              {title.length}/50
            </span>
          </div>
          <p id="title-helper" className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
            简洁明了，让大家一眼就知道你的点子
          </p>
          {errors.title && (
            <p id="title-error" className="mt-1 text-sm text-red-500">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
          >
            描述
          </label>
          <div className="relative">
            <textarea
              {...register("description")}
              id="description"
              rows={6}
              placeholder="详细描述你的点子，包括它解决什么问题、如何实现等"
              aria-invalid={!!errors.description}
              aria-describedby={cn(
                "description-helper",
                errors.description && "description-error"
              )}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-500 resize-none"
            />
            <span className="absolute right-3 bottom-3 text-xs text-gray-500">
              {description.length}/1000
            </span>
          </div>
          <p id="description-helper" className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
            详细描述你的想法、解决的问题、实现思路等
          </p>
          {errors.description && (
            <p id="description-error" className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        <fieldset aria-describedby="tags-helper">
          <legend className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            标签
          </legend>
          <div className="flex flex-wrap gap-2" role="group" aria-label="选择标签">
            {TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-pressed={selectedTags.includes(tag)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all border",
                  selectedTags.includes(tag)
                    ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/20"
                    : "bg-white/5 border-white/20 text-gray-600 dark:text-gray-300 hover:border-purple-500/50"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
          <p id="tags-helper" className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
            选择相关标签，帮助大家发现你的点子（可选）
          </p>
          {errors.tags && (
            <p className="mt-1 text-sm text-red-500">{errors.tags.message}</p>
          )}
        </fieldset>

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="w-full py-4 flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin motion-reduce:animate-none" />
              提交中...
            </>
          ) : (
            "发布点子"
          )}
        </button>
      </form>
    </div>
  );
}
