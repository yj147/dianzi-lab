'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { registerUser, ActionResult } from './actions'
import { registerSchema } from './schema'
import { z } from 'zod'

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
    <div className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-xl shadow-2xl p-8 ring-1 ring-white/30">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          创建新账号
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          加入点子 Lab，开启你的创意之旅
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <input
            {...register('email')}
            type="email"
            placeholder="邮箱地址"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            {...register('password')}
            type="password"
            placeholder="密码 (至少6位)"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-500"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <input
            {...register('confirmPassword')}
            type="password"
            placeholder="确认密码"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-500"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {errors.root && (
          <p className="text-sm text-red-500 text-center">
            {errors.root.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="w-full py-3 flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin motion-reduce:animate-none" />
              注册中...
            </>
          ) : (
            '创建账号'
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-gray-600 dark:text-gray-400">已有账号？</span>
        <Link
          href="/login"
          className="ml-1 font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400"
        >
          立即登录
        </Link>
      </div>
    </div>
  )
}
