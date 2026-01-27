'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRound, Loader2, Mail, ShieldCheck } from 'lucide-react'
import { registerUser } from './actions'
import { registerSchema } from './schema'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { isNextRedirectError } from '@/lib/utils'

type RegisterInput = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
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

    clearErrors('root')
    try {
      // 成功时 server 调用 redirect() 抛出 NEXT_REDIRECT，不会返回
      // 只有错误时才会返回 result
      const result = await registerUser(formData)

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
          className="mb-1.5 block text-xs font-bold text-gray-700 uppercase tracking-wider"
        >
          Email
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
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
          className="mb-1.5 block text-xs font-bold text-gray-700 uppercase tracking-wider"
        >
          Password
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <KeyRound size={16} aria-hidden="true" />
          </div>
          <Input
            {...register('password')}
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="至少 6 位"
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

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1.5 block text-xs font-bold text-gray-700 uppercase tracking-wider"
        >
          Confirm
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <ShieldCheck size={16} aria-hidden="true" />
          </div>
          <Input
            {...register('confirmPassword')}
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="再次确认"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            className="pl-10"
          />
        </div>
        {errors.confirmPassword && (
          <p id="confirmPassword-error" role="alert" className="mt-2 px-2 text-sm font-medium text-red-600">
            {errors.confirmPassword.message}
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
            注册中…
          </>
        ) : (
          '注册账户'
        )}
      </Button>
    </form>
  )
}
