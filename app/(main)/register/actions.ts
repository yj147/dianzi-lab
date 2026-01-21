'use server'

import bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'

import { createUser } from '@/lib/users'
import { registerSchema } from './schema'

export type ActionResult =
  | { success: true }
  | { success: false; error: string; field?: string }

function getFormString(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value : ''
}

function isPrismaP2002(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false
  if (!('code' in error)) return false
  return (error as { code?: unknown }).code === 'P2002'
}

export async function registerUser(formData: FormData): Promise<ActionResult> {
  const email = getFormString(formData, 'email')
  const password = getFormString(formData, 'password')
  const confirmPassword = getFormString(formData, 'confirmPassword')

  const parsed = registerSchema.safeParse({ email, password, confirmPassword })
  if (!parsed.success) {
    const issue = parsed.error.issues[0]

    return {
      success: false,
      error: issue.message,
      field: String(issue.path[0]),
    }
  }

  const normalizedEmail = parsed.data.email.trim().toLowerCase()
  const hashedPassword = await bcrypt.hash(parsed.data.password, 10)

  try {
    await createUser(normalizedEmail, hashedPassword)
  } catch (error) {
    if (isPrismaP2002(error)) {
      return { success: false, error: '该邮箱已被注册', field: 'email' }
    }
    throw error
  }

  redirect('/login')
}
