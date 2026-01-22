'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { registerUser, ActionResult } from './actions'
import { registerSchema } from './schema'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type RegisterInput = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: RegisterInput) => {
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('confirmPassword', data.confirmPassword)

    try {
      const result: ActionResult = await registerUser(formData)
      if (result.success) {
        router.push('/login')
      } else {
        if (result.field) {
          setError(result.field as keyof RegisterInput, {
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
    } catch {
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
          创建新账号
        </h1>
        <p className="text-muted-foreground mt-2">
          加入点子 Lab，开启你的创意之旅
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
            autoComplete="new-password"
            placeholder="至少 6 位"
            aria-invalid={!!errors.password}
            className="bg-white/50"
          />
          {errors.password && (
            <p id="password-error" role="alert" className="text-sm font-medium text-danger">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            确认密码
          </label>
          <Input
            {...register('confirmPassword')}
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="再次输入密码"
            aria-invalid={!!errors.confirmPassword}
            className="bg-white/50"
          />
          {errors.confirmPassword && (
            <p
              id="confirmPassword-error"
              role="alert"
              className="text-sm font-medium text-danger"
            >
              {errors.confirmPassword.message}
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
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              注册中…
            </>
          ) : (
            '创建账号'
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-muted-foreground">已有账号？</span>
        <Link
          href="/login"
          className="ml-1 font-semibold text-primary hover:underline"
        >
          立即登录
        </Link>
      </div>
    </div>
  )
}
