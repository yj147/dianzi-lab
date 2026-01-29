'use server'

import bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'

import { getUserByEmail } from '@/lib/users'
import { signJWT, setSessionCookie } from '@/lib/auth'
import { loginSchema } from './schema'

// 成功时调用 redirect() 永不返回，此类型只表示错误情况
export type ActionResult = { success: false; error: string; field?: string }

function getFormString(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value : ''
}

export async function loginUser(formData: FormData): Promise<ActionResult> {
  const email = getFormString(formData, 'email')
  const password = getFormString(formData, 'password')
  const callbackUrl = getFormString(formData, 'callbackUrl') || '/dashboard'

  const parsed = loginSchema.safeParse({ email, password })
  if (!parsed.success) {
    const issue = parsed.error.issues[0]

    return {
      success: false,
      error: issue.message,
      field: String(issue.path[0]),
    }
  }

  const user = await getUserByEmail(parsed.data.email)

  if (!user) {
    return { success: false, error: '邮箱或密码错误' }
  }

  const isHardenedDeployment =
    process.env.VERCEL_ENV === 'production' ||
    process.env.VERCEL_ENV === 'preview' ||
    (!process.env.VERCEL_ENV && process.env.NODE_ENV === 'production')

  // Harden hosted deployments: block the known seed default password for admin accounts.
  // This prevents the "default admin password" backdoor from remaining usable.
  if (
    isHardenedDeployment &&
    user.role === 'ADMIN' &&
    parsed.data.password === 'admin123'
  ) {
    return { success: false, error: '邮箱或密码错误' }
  }

  const passwordMatch = await bcrypt.compare(
    parsed.data.password,
    user.passwordHash
  )

  if (!passwordMatch) {
    return { success: false, error: '邮箱或密码错误' }
  }

  const token = await signJWT({
    sub: user.id,
    email: user.email,
    role: user.role,
  })

  setSessionCookie(token)

  // Validate callbackUrl to prevent open redirect
  // Must start with '/' but not '//' (protocol-relative URL) and not contain backslash
  const safeCallbackUrl =
    callbackUrl.startsWith('/') &&
    !callbackUrl.startsWith('//') &&
    !callbackUrl.includes('\\')
      ? callbackUrl
      : '/dashboard'

  // PRD: admins should land in /admin by default after login.
  if (user.role === 'ADMIN' && safeCallbackUrl === '/dashboard') {
    redirect('/admin')
  }

  redirect(safeCallbackUrl)
}
