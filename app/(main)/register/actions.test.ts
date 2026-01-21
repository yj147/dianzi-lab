import bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'

import { prisma } from '@/lib/db'

import { registerUser } from './actions'
import { registerSchema } from './schema'

jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      create: jest.fn(),
    },
  },
}))

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
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

describe('registerSchema', () => {
  it('accepts valid inputs', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: '123456',
      confirmPassword: '123456',
    })

    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({
      email: 'not-an-email',
      password: '123456',
      confirmPassword: '123456',
    })

    expect(result.success).toBe(false)
    if (result.success) return

    expect(result.error.issues[0]?.message).toBe('请输入有效的邮箱地址')
    expect(result.error.issues[0]?.path).toEqual(['email'])
  })

  it('rejects short password', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: '123',
      confirmPassword: '123',
    })

    expect(result.success).toBe(false)
    if (result.success) return

    expect(result.error.issues[0]?.message).toBe('密码至少6位')
    expect(result.error.issues[0]?.path).toEqual(['password'])
  })

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: '123456',
      confirmPassword: '654321',
    })

    expect(result.success).toBe(false)
    if (result.success) return

    expect(result.error.issues[0]?.message).toBe('两次密码输入不一致')
    expect(result.error.issues[0]?.path).toEqual(['confirmPassword'])
  })
})

describe('registerUser', () => {
  const prismaUserCreateMock = prisma.user.create as unknown as jest.Mock
  const bcryptHashMock = bcrypt.hash as unknown as jest.Mock
  const redirectMock = redirect as unknown as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns validation error with field on invalid input', async () => {
    const result = await registerUser(
      makeFormData({
        email: 'bad',
        password: '123456',
        confirmPassword: '123456',
      }),
    )

    expect(result).toEqual({
      success: false,
      error: '请输入有效的邮箱地址',
      field: 'email',
    })
    expect(bcryptHashMock).not.toHaveBeenCalled()
    expect(prismaUserCreateMock).not.toHaveBeenCalled()
    expect(redirectMock).not.toHaveBeenCalled()
  })

  it('treats non-string FormData values as empty strings', async () => {
    const formData = new FormData()
    formData.set('email', new File(['x'], 'email.txt'))
    formData.set('password', '123456')
    formData.set('confirmPassword', '123456')

    const result = await registerUser(formData)

    expect(result).toEqual({
      success: false,
      error: '请输入有效的邮箱地址',
      field: 'email',
    })
    expect(bcryptHashMock).not.toHaveBeenCalled()
    expect(prismaUserCreateMock).not.toHaveBeenCalled()
    expect(redirectMock).not.toHaveBeenCalled()
  })

  it('hashes password and redirects on success', async () => {
    bcryptHashMock.mockResolvedValue('hashed-password')
    prismaUserCreateMock.mockResolvedValue({})

    await expect(
      registerUser(
        makeFormData({
          email: 'TeSt@Example.Com',
          password: '123456',
          confirmPassword: '123456',
        }),
      ),
    ).rejects.toThrow('NEXT_REDIRECT')

    expect(bcryptHashMock).toHaveBeenCalledWith('123456', 10)
    expect(prismaUserCreateMock).toHaveBeenCalledWith({
      data: {
        email: 'test@example.com',
        passwordHash: 'hashed-password',
      },
    })
    expect(redirectMock).toHaveBeenCalledWith('/login')
  })

  it('returns unique email error on Prisma P2002 (and still hashes to mitigate timing attacks)', async () => {
    bcryptHashMock.mockResolvedValue('hashed-password')
    prismaUserCreateMock.mockRejectedValue({ code: 'P2002' })

    const result = await registerUser(
      makeFormData({
        email: 'test@example.com',
        password: '123456',
        confirmPassword: '123456',
      }),
    )

    expect(result).toEqual({
      success: false,
      error: '该邮箱已被注册',
      field: 'email',
    })
    expect(bcryptHashMock).toHaveBeenCalledWith('123456', 10)
    expect(redirectMock).not.toHaveBeenCalled()
  })

  it('rethrows unknown errors', async () => {
    bcryptHashMock.mockResolvedValue('hashed-password')
    prismaUserCreateMock.mockRejectedValue(new Error('db down'))

    await expect(
      registerUser(
        makeFormData({
          email: 'test@example.com',
          password: '123456',
          confirmPassword: '123456',
        }),
      ),
    ).rejects.toThrow('db down')

    expect(bcryptHashMock).toHaveBeenCalledWith('123456', 10)
  })

  it('rethrows null errors', async () => {
    bcryptHashMock.mockResolvedValue('hashed-password')
    prismaUserCreateMock.mockRejectedValue(null)

    await expect(
      registerUser(
        makeFormData({
          email: 'test@example.com',
          password: '123456',
          confirmPassword: '123456',
        }),
      ),
    ).rejects.toBeNull()

    expect(bcryptHashMock).toHaveBeenCalledWith('123456', 10)
  })
})
