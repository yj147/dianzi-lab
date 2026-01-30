'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ExternalLink, Plus, X } from 'lucide-react'

import ScreenshotGallery from '@/components/idea/ScreenshotGallery'
import TechStackBadges from '@/components/idea/TechStackBadges'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

import { updateIdeaShowcase } from '../actions'
import { showcaseEditSchema, type ShowcaseEditInput } from './schema'

type Props = {
  ideaId: string
  ideaTitle: string
  ideaDescription: string
  initialScreenshots: string[]
  initialTechStack: string[]
  initialDuration: string | null
  initialExternalUrl: string | null
  canEdit: boolean
}

function normalizeLines(value: string): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const raw of value.split('\n')) {
    const trimmed = raw.trim()
    if (!trimmed) continue
    if (seen.has(trimmed)) continue
    seen.add(trimmed)
    result.push(trimmed)
  }

  return result
}

function toSafeExternalUrl(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  try {
    const url = new URL(trimmed)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return trimmed
  } catch {
    return null
  }
}

function getFirstFieldErrorMessage(value: unknown): string | undefined {
  if (!value) return undefined
  if (typeof value === 'object' && value !== null && 'message' in value) {
    const message = (value as { message?: unknown }).message
    return typeof message === 'string' ? message : undefined
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const message = getFirstFieldErrorMessage(item)
      if (message) return message
    }
  }
  return undefined
}

export default function ShowcaseEditForm({
  ideaId,
  ideaTitle,
  ideaDescription,
  initialScreenshots,
  initialTechStack,
  initialDuration,
  initialExternalUrl,
  canEdit,
}: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const [screenshotsText, setScreenshotsText] = useState(
    initialScreenshots.join('\n')
  )
  const [techStackDraft, setTechStackDraft] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<ShowcaseEditInput>({
    resolver: zodResolver(showcaseEditSchema),
    defaultValues: {
      screenshots: initialScreenshots,
      techStack: initialTechStack,
      duration: initialDuration ?? '',
      externalUrl: initialExternalUrl ?? '',
    },
    mode: 'onSubmit',
  })

  const screenshots = watch('screenshots')
  const techStack = watch('techStack')
  const duration = watch('duration')
  const externalUrl = watch('externalUrl')

  const canSubmit = canEdit && !isPending && isDirty
  const durationPreview = duration.trim() ? duration.trim() : '—'
  const externalUrlPreview = toSafeExternalUrl(externalUrl)
  const screenshotsPreview = screenshots.map((url) => url.trim()).filter(Boolean)

  const screenshotsError = getFirstFieldErrorMessage(errors.screenshots)
  const techStackError = getFirstFieldErrorMessage(errors.techStack)

  function handleScreenshotsChange(value: string) {
    setScreenshotsText(value)
    setValue('screenshots', normalizeLines(value), {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  function addTechStack(value: string) {
    const rawTokens = value
      .split(',')
      .map((token) => token.trim())
      .filter(Boolean)

    if (rawTokens.length === 0) return

    const current = getValues('techStack')
    const seen = new Set(current)
    const next = [...current]

    for (const token of rawTokens) {
      if (seen.has(token)) continue
      seen.add(token)
      next.push(token)
    }

    setValue('techStack', next, { shouldValidate: true, shouldDirty: true })
    setTechStackDraft('')
  }

  function removeTechStack(value: string) {
    const next = getValues('techStack').filter((tag) => tag !== value)
    setValue('techStack', next, { shouldValidate: true, shouldDirty: true })
  }

  function onSubmit(data: ShowcaseEditInput) {
    if (!canEdit) {
      toast({
        title: '无法保存',
        description: '仅已完成项目可编辑案例信息',
        variant: 'destructive',
      })
      return
    }

    startTransition(async () => {
      try {
        const result = await updateIdeaShowcase(ideaId, data)
        if (!result.success) {
          toast({
            title: '保存失败',
            description: result.error,
            variant: 'destructive',
          })
          return
        }

        reset(data)
        setScreenshotsText(data.screenshots.join('\n'))
        setTechStackDraft('')

        toast({ title: '保存成功', variant: 'success' })
        router.refresh()
      } catch {
        toast({
          title: '保存失败',
          description: '网络异常，请稍后再试',
          variant: 'destructive',
        })
      }
    })
  }

  return (
    <section className="rounded-xl border-2 border-brand-dark bg-brand-surface p-8 shadow-solid-sm">
      <div className="flex flex-col gap-4 border-b-2 border-brand-dark/10 pb-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h2 className="font-heading text-xl font-bold text-brand-dark">
            案例展示信息 // SHOWCASE
          </h2>
          <p className="text-sm text-muted-foreground">
            仅用于首页「客户案例库」等展示区域；支持并排实时预览。
          </p>
        </div>
        {!canEdit ? (
          <div className="rounded-lg border-2 border-dashed border-brand-dark/30 bg-muted px-3 py-2 text-xs font-mono text-muted-foreground">
            ONLY COMPLETED CAN EDIT
          </div>
        ) : null}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="screenshots"
              className="block font-heading text-base font-bold text-brand-dark"
            >
              截图（URL 列表）
            </label>
            <Textarea
              id="screenshots"
              value={screenshotsText}
              onChange={(event) => handleScreenshotsChange(event.target.value)}
              placeholder={`https://example.com/screenshot-1.png\nhttps://example.com/screenshot-2.png\n（每行一个）`}
              disabled={!canEdit || isPending}
              className="min-h-[160px] bg-white"
            />
            {screenshotsError ? (
              <p className="text-sm text-destructive">{screenshotsError}</p>
            ) : (
              <p className="text-xs font-mono text-muted-foreground">
                当前 {screenshots.length} 条
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block font-heading text-base font-bold text-brand-dark">
              技术栈（标签）
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                value={techStackDraft}
                onChange={(event) => setTechStackDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ',') {
                    event.preventDefault()
                    addTechStack(techStackDraft)
                  }
                }}
                placeholder="React, Next.js, Prisma"
                disabled={!canEdit || isPending}
                aria-label="添加技术栈标签"
              />
              <Button
                type="button"
                onClick={() => addTechStack(techStackDraft)}
                disabled={!canEdit || isPending}
                className="shrink-0"
              >
                <Plus className="mr-2 size-4" aria-hidden="true" />
                添加
              </Button>
            </div>

            {techStack.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {techStack.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-md border border-brand-dark/20 bg-muted px-2 py-1 font-mono text-xs text-brand-dark"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTechStack(tag)}
                      disabled={!canEdit || isPending}
                      className="rounded p-0.5 text-muted-foreground hover:text-brand-dark disabled:opacity-50"
                      aria-label={`移除 ${tag}`}
                    >
                      <X className="size-3" aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-muted-foreground">
                暂无标签
              </p>
            )}
            {techStackError ? (
              <p className="text-sm text-destructive">{techStackError}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="duration"
                className="block font-heading text-base font-bold text-brand-dark"
              >
                工期
              </label>
              <Input
                id="duration"
                {...register('duration')}
                placeholder="2 周"
                disabled={!canEdit || isPending}
              />
              {errors.duration?.message ? (
                <p className="text-sm text-destructive">
                  {errors.duration.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="externalUrl"
                className="block font-heading text-base font-bold text-brand-dark"
              >
                外部链接
              </label>
              <Input
                id="externalUrl"
                type="url"
                {...register('externalUrl')}
                placeholder="https://example.com"
                disabled={!canEdit || isPending}
              />
              {errors.externalUrl?.message ? (
                <p className="text-sm text-destructive">
                  {String(errors.externalUrl.message)}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button type="submit" disabled={!canSubmit}>
              {isPending ? '正在保存...' : '保存案例信息'}
            </Button>
          </div>
        </form>

        <div className="rounded-xl border-2 border-brand-dark bg-surface p-6 shadow-solid-sm">
          <div className="flex items-start justify-between gap-4 border-b-2 border-brand-dark/10 pb-4">
            <div className="min-w-0">
              <h3 className="font-heading text-lg font-bold text-brand-dark">
                实时预览
              </h3>
              <p className="mt-1 text-xs font-mono text-muted-foreground">
                PREVIEW // NOT PUBLISHED
              </p>
            </div>
            {externalUrlPreview ? (
              <a
                href={externalUrlPreview}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-brand-dark bg-brand-accent/20 px-3 py-2 text-xs font-bold text-brand-dark shadow-solid-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-solid motion-reduce:transition-none"
              >
                <ExternalLink className="size-4" aria-hidden="true" />
                打开链接
              </a>
            ) : null}
          </div>

          <div className="mt-6 space-y-6">
            {screenshotsPreview.length > 0 ? (
              <ScreenshotGallery screenshots={screenshotsPreview} title={ideaTitle} />
            ) : (
              <div className="flex h-48 items-center justify-center rounded-xl border-2 border-brand-dark bg-muted shadow-solid-sm">
                <span className="font-mono text-xs font-bold text-muted-foreground">
                  NO SCREENSHOT
                </span>
              </div>
            )}

            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <h4 className="font-heading text-base font-bold text-brand-dark">
                  {ideaTitle}
                </h4>
                <span className="font-mono text-xs text-muted-foreground">
                  工期 {durationPreview}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {ideaDescription}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tech Stack
              </h4>
              {techStack.length > 0 ? (
                <TechStackBadges items={techStack} />
              ) : (
                <p className="text-xs font-mono text-muted-foreground">
                  未设置技术栈标签
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
