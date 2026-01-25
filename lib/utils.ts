import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const noop = (): void => {}

// Next.js 的 redirect() 会抛出特殊错误来中断执行流，
// 在 try-catch 中需要识别并重新抛出，避免被当作未知错误处理
export function isNextRedirectError(error: unknown): boolean {
  if (error instanceof Error && error.message === 'NEXT_REDIRECT') return true
  if (typeof error !== 'object' || error === null) return false
  if (!('digest' in error)) return false
  const digest = (error as { digest?: unknown }).digest
  return typeof digest === 'string' && digest.startsWith('NEXT_REDIRECT')
}

