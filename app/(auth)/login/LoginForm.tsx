'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRound, Loader2, Mail } from 'lucide-react'
import { loginUser } from './actions'
import { loginSchema } from './schema'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { isNextRedirectError } from '@/lib/utils'

type LoginInput = z.infer<typeof loginSchema>

type LoginFormProps = {
  callbackUrl?: string
}

function getSafeCallbackUrl(callbackUrl: string | undefined): string {
  if (!callbackUrl) return '/dashboard'
  return callbackUrl.startsWith('/') && !callbackUrl.startsWith('//') && !callbackUrl.includes('\\') ? callbackUrl : '/dashboard'
}

export default function LoginForm({ callbackUrl }: LoginFormProps) {
  const safeCallbackUrl = getSafeCallbackUrl(callbackUrl)
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: LoginInput) => {
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('callbackUrl', safeCallbackUrl)

    clearErrors('root')
    try {
      // 成功时 server 调用 redirect() 抛出 NEXT_REDIRECT，不会返回
      // 只有错误时才会返回 result
      const result = await loginUser(formData)

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
    } catch (error) {
      if (isNextRedirectError(error)) {
        throw error
      }

      setError('root', {
        type: 'manual',
        message: '发生未知错误，请稍后再试',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-xs font-bold text-foreground uppercase tracking-wider"
        >
          Email
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            <Mail size={16} aria-hidden="true" />
          </div>
          <Input
            {...register('email')}
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            placeholder="name@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className="pl-10"
          />
        </div>
        {errors.email && (
          <p id="email-error" role="alert" className="mt-2 px-2 text-sm font-medium text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-xs font-bold text-foreground uppercase tracking-wider"
        >
          Password
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            <KeyRound size={16} aria-hidden="true" />
          </div>
          <Input
            {...register('password')}
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className="pl-10"
          />
        </div>
        {errors.password && (
          <p id="password-error" role="alert" className="mt-2 px-2 text-sm font-medium text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      {errors.root && (
        <p role="alert" className="px-2 text-sm font-medium text-red-600">
          {errors.root.message}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full shadow-solid-sm hover:shadow-solid hover:bg-brand-dark"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin motion-reduce:animate-none" />
            登录中…
          </>
        ) : (
          '登录'
        )}
      </Button>
    </form>
  )
}
