import { z } from 'zod'

function uniquePreservingOrder(values: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const value of values) {
    if (seen.has(value)) continue
    seen.add(value)
    result.push(value)
  }

  return result
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export const showcaseEditSchema = z.object({
  screenshots: z
    .array(z.string().trim().url('截图 URL 格式不正确'))
    .transform(uniquePreservingOrder),
  techStack: z
    .array(z.string().trim().min(1, '技术栈标签不能为空'))
    .transform(uniquePreservingOrder),
  duration: z.string().trim().max(50, '工期不能超过50个字符'),
  externalUrl: z
    .string()
    .trim()
    .refine((value) => value === '' || isValidUrl(value), {
      message: '链接格式不正确',
    })
})

export type ShowcaseEditInput = z.infer<typeof showcaseEditSchema>
