'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="group relative">
        <label htmlFor="email" className="sr-only">
          邮箱
        </label>
        <span
          className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-coral-400"
          aria-hidden="true"
        >
          mail
        </span>
        <Input
          {...register('email')}
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          placeholder="探险家邮箱"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className="h-14 rounded-full bg-white/60 border-2 border-lavender-200 pl-14 font-medium text-slate-700 placeholder:text-slate-400 transition-all outline-none focus-visible:ring-0 focus-visible:border-coral-400 focus-visible:bg-white"
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-2 px-2 text-sm font-medium text-danger">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="group relative">
        <label htmlFor="password" className="sr-only">
          密码
        </label>
        <span
          className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-coral-400"
          aria-hidden="true"
        >
          key
        </span>
        <Input
          {...register('password')}
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="秘钥口令（至少 6 位）"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          className="h-14 rounded-full bg-white/60 border-2 border-lavender-200 pl-14 font-medium text-slate-700 placeholder:text-slate-400 transition-all outline-none focus-visible:ring-0 focus-visible:border-coral-400 focus-visible:bg-white"
        />
        {errors.password && (
          <p id="password-error" role="alert" className="mt-2 px-2 text-sm font-medium text-danger">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="group relative">
        <label htmlFor="confirmPassword" className="sr-only">
          确认密码
        </label>
        <span
          className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-coral-400"
          aria-hidden="true"
        >
          verified_user
        </span>
        <Input
          {...register('confirmPassword')}
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="再次确认秘钥"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
          className="h-14 rounded-full bg-white/60 border-2 border-lavender-200 pl-14 font-medium text-slate-700 placeholder:text-slate-400 transition-all outline-none focus-visible:ring-0 focus-visible:border-coral-400 focus-visible:bg-white"
        />
        {errors.confirmPassword && (
          <p id="confirmPassword-error" role="alert" className="mt-2 px-2 text-sm font-medium text-danger">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {errors.root && (
        <p role="alert" className="px-2 text-sm font-medium text-danger">
          {errors.root.message}
        </p>
      )}

      <Button
        type="submit"
        className="h-14 w-full rounded-full bg-coral-400 text-lg font-bold text-white shadow-lg shadow-coral-400/30 transition-transform hover:bg-coral-500 hover:-translate-y-0.5 active:translate-y-0"
        size="lg"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            注册中…
          </>
        ) : (
          '开启梦境'
        )}
      </Button>
    </form>
  )
}
