import bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'

import { getUserByEmail } from '@/lib/users'
import { signJWT, setSessionCookie } from '@/lib/auth'
import { loginUser } from '@/app/(auth)/login/actions'
import { loginSchema } from '@/app/(auth)/login/schema'

jest.mock('@/lib/users', () => ({
  getUserByEmail: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  signJWT: jest.fn(),
  setSessionCookie: jest.fn(),
}))

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(() => {
    throw new Error('NEXT_REDIRECT')
  }),
}))

function makeFormData(values: Record<string, string>): FormData {
  const formData = new FormData()
  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value)
  }
  return formData
}

describe('loginSchema', () => {
  it('accepts valid inputs', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'password123',
    })
    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.error.issues[0].message).toBe('请输入有效的邮箱地址')
  })

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '',
    })
    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.error.issues[0].message).toBe('请输入密码')
  })
})

describe('loginUser action', () => {
  const getUserByEmailMock = getUserByEmail as jest.Mock
  const bcryptCompareMock = bcrypt.compare as jest.Mock
  const signJWTMock = signJWT as jest.Mock
  const setSessionCookieMock = setSessionCookie as jest.Mock
  const redirectMock = redirect as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns validation error on invalid input', async () => {
    const result = await loginUser(makeFormData({ email: 'bad', password: '' }))
    expect(result.success).toBe(false)
    expect(result.field).toBe('email')
  })

  it('treats non-string FormData values as empty strings', async () => {
    const formData = new FormData()
    // In some environments, setting a non-string might not work as expected in mock FormData,
    // but typically File objects are allowed.
    formData.set('email', new Blob([''], { type: 'text/plain' }) as any)
    formData.set('password', 'password123')

    const result = await loginUser(formData)

    expect(result.success).toBe(false)
    expect(result.field).toBe('email')
  })

  it('returns generic error if user not found', async () => {
    getUserByEmailMock.mockResolvedValue(null)
    const result = await loginUser(makeFormData({ email: 'test@example.com', password: 'password123' }))
    expect(result).toEqual({ success: false, error: '邮箱或密码错误' })
  })

  it('returns generic error if password does not match', async () => {
    getUserByEmailMock.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      role: 'USER',
    })
    bcryptCompareMock.mockResolvedValue(false)
    
    const result = await loginUser(makeFormData({ email: 'test@example.com', password: 'wrong-password' }))
    expect(result).toEqual({ success: false, error: '邮箱或密码错误' })
    expect(bcryptCompareMock).toHaveBeenCalledWith('wrong-password', 'hashed-password')
  })

  it('sets cookie and redirects on success', async () => {
    getUserByEmailMock.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      role: 'USER',
    })
    bcryptCompareMock.mockResolvedValue(true)
    signJWTMock.mockResolvedValue('fake-jwt-token')

    await expect(
      loginUser(makeFormData({ email: 'test@example.com', password: 'password123' }))
    ).rejects.toThrow('NEXT_REDIRECT')

    expect(signJWTMock).toHaveBeenCalledWith({
      sub: 'user-1',
      email: 'test@example.com',
      role: 'USER',
    })
    expect(setSessionCookieMock).toHaveBeenCalledWith('fake-jwt-token')
    expect(redirectMock).toHaveBeenCalledWith('/dashboard')
  })
})
