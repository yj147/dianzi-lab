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

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export const showcaseEditSchema = z.object({
  screenshots: z
    .array(
      z.string().trim().refine((v) => isHttpUrl(v), {
        message: '截图 URL 格式不正确（仅支持 http/https）',
      })
    )
    .transform(uniquePreservingOrder),
  techStack: z
    .array(z.string().trim().min(1, '技术栈标签不能为空'))
    .transform(uniquePreservingOrder),
  duration: z.string().trim().max(50, '工期不能超过50个字符'),
  externalUrl: z
    .string()
    .trim()
    .refine((value) => value === '' || isHttpUrl(value), {
      message: '链接格式不正确（仅支持 http/https）',
    })
})

export type ShowcaseEditInput = z.infer<typeof showcaseEditSchema>
