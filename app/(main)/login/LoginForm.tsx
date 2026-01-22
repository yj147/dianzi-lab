'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { loginUser, ActionResult } from './actions'
import { loginSchema } from './schema'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type LoginInput = z.infer<typeof loginSchema>

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: LoginInput) => {
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('callbackUrl', callbackUrl)

    try {
      const result: ActionResult = await loginUser(formData)
      if (result.success) {
        // Redirect handled by server action, but as a fallback
        router.push(callbackUrl)
      } else {
        if (result.field) {
          setError(result.field as keyof LoginInput, {
            type: 'manual',
            message: result.error,
          })
        } else {
          setError('root', {
            type: 'manual',
            message: result.error,
          })
        }
      }
    } catch (error) {
      // In Next.js, redirect throws an error that should be caught by the framework.
      // However, if we're catching all errors, we need to make sure we're not catching redirects.
      if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
        throw error
      }
      setError('root', {
        type: 'manual',
        message: '发生未知错误，请稍后再试',
      })
    }
  }

  return (
    <div className="w-full bg-surface/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          登录
        </h1>

        <p className="text-muted-foreground mt-2">
          欢迎回来，请登录你的账号
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            邮箱
          </label>
          <Input
            {...register('email')}
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            className="bg-white/50"
          />

          {errors.email && (
            <p id="email-error" role="alert" className="text-sm font-medium text-danger">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            密码
          </label>
          <Input
            {...register('password')}
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            className="bg-white/50"
          />

          {errors.password && (
            <p id="password-error" role="alert" className="text-sm font-medium text-danger">
              {errors.password.message}
            </p>
          )}
        </div>

        {errors.root && (
          <p role="alert" className="text-sm font-medium text-danger text-center">
            {errors.root.message}
          </p>
        )}

        <Button
          type="submit"
          className="w-full text-base font-semibold shadow-lg"
          size="lg"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              登录中…
            </>
          ) : (
            '登录'
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-muted-foreground">没有账号？</span>
        <Link
          href="/register"
          className="ml-1 font-semibold text-primary hover:underline"
        >
          立即注册
        </Link>
      </div>
    </div>
  )
}
