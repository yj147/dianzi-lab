'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { loginUser, ActionResult } from './actions'
import { loginSchema } from './schema'
import { z } from 'zod'

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
    <div className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-xl shadow-2xl p-8 ring-1 ring-white/30">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          登录
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mt-2">
          欢迎回来，请登录你的账号
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
            placeholder="密码"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-500"
          />

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
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
              登录中...
            </>
          ) : (
            '登录'
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-gray-600 dark:text-gray-400">没有账号？</span>
        <Link
          href="/register"
          className="ml-1 font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400"
        >
          立即注册
        </Link>
      </div>
    </div>
  )
}
