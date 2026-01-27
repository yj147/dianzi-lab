/**
 * @jest-environment node
 */

import { SignJWT } from 'jose'

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({ set: jest.fn(), get: jest.fn() })),
}))

jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

function getCookiesMock(): jest.Mock {
  return jest.requireMock('next/headers').cookies as jest.Mock
}

describe('lib/auth', () => {
  const secret = 'test-secret'
  const secretKey = new TextEncoder().encode(secret)

  beforeEach(() => {
    process.env.JWT_SECRET = secret
    process.env.NODE_ENV = 'test'
    jest.clearAllMocks()
  })

  it('signJWT/verifyJWT: 有效 token 返回 payload', async () => {
    const { signJWT, verifyJWT } = await import('@/lib/auth')

    const token = await signJWT({
      sub: 'user_1',
      email: 'a@example.com',
      role: 'USER',
    })

    const payload = await verifyJWT(token)

    expect(payload.sub).toBe('user_1')
    expect(payload.email).toBe('a@example.com')
    expect(payload.role).toBe('USER')
    expect(typeof payload.exp).toBe('number')
  })

  it('verifyJWT: 过期 token 验证失败', async () => {
    const { verifyJWT } = await import('@/lib/auth')

    const expiredToken = await new SignJWT({
      email: 'a@example.com',
      role: 'USER',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject('user_1')
      .setExpirationTime(Math.floor(Date.now() / 1000) - 1)
      .sign(secretKey)

    await expect(verifyJWT(expiredToken)).rejects.toThrow()
  })

  it('verifyJWT: 篡改 token 验证失败', async () => {
    const { signJWT, verifyJWT } = await import('@/lib/auth')

    const token = await signJWT({
      sub: 'user_1',
      email: 'a@example.com',
      role: 'USER',
    })

    const tamperedToken = `${token}a`

    await expect(verifyJWT(tamperedToken)).rejects.toThrow()
  })

  it('signJWT: JWT_SECRET 缺失则抛错', async () => {
    delete process.env.JWT_SECRET

    const { signJWT } = await import('@/lib/auth')

    await expect(
      signJWT({ sub: 'user_1', email: 'a@example.com', role: 'USER' }),
    ).rejects.toThrow('JWT_SECRET')
  })

  it('verifyJWT: payload 缺少必要字段则抛错', async () => {
    const { verifyJWT } = await import('@/lib/auth')

    const token = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject('user_1')
      .setExpirationTime(Math.floor(Date.now() / 1000) + 60)
      .sign(secretKey)

    await expect(verifyJWT(token)).rejects.toThrow('Invalid session payload')
  })

  it('setSessionCookie: 设置 cookie 属性正确（非生产）', async () => {
    const set = jest.fn()
    const get = jest.fn()

    getCookiesMock().mockReturnValue({ set, get })

    const { setSessionCookie } = await import('@/lib/auth')

    setSessionCookie('token')

    expect(set).toHaveBeenCalledWith({
      name: 'session',
      value: 'token',
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
  })

  it('setSessionCookie: production 环境 secure=true', async () => {
    process.env.NODE_ENV = 'production'

    const set = jest.fn()
    const get = jest.fn()
    getCookiesMock().mockReturnValue({ set, get })

    const { setSessionCookie } = await import('@/lib/auth')
    setSessionCookie('token')

    expect(set).toHaveBeenCalledWith(
      expect.objectContaining({ secure: true, maxAge: 60 * 60 * 24 * 7 }),
    )
  })

  it('clearSessionCookie: 清除 cookie（maxAge=0）', async () => {
    const set = jest.fn()
    const get = jest.fn()

    getCookiesMock().mockReturnValue({ set, get })

    const { clearSessionCookie } = await import('@/lib/auth')

    clearSessionCookie()

    expect(set).toHaveBeenCalledWith({
      name: 'session',
      value: '',
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge: 0,
    })
  })

  it('getSession: cookie 缺失返回 null', async () => {
    const set = jest.fn()
    const get = jest.fn(() => undefined)

    getCookiesMock().mockReturnValue({ set, get })

    const { getSession } = await import('@/lib/auth')

    await expect(getSession()).resolves.toBeNull()
  })

  it('getSession: token 无效返回 null', async () => {
    const set = jest.fn()
    const get = jest.fn(() => ({ name: 'session', value: 'not-a-jwt' }))

    getCookiesMock().mockReturnValue({ set, get })

    const { getSession } = await import('@/lib/auth')

    await expect(getSession()).resolves.toBeNull()
  })

  it('getSession: token 有效返回 payload', async () => {
    const { signJWT, getSession } = await import('@/lib/auth')

    const token = await signJWT({
      sub: 'user_1',
      email: 'a@example.com',
      role: 'USER',
    })

    const set = jest.fn()
    const get = jest.fn(() => ({ name: 'session', value: token }))

    getCookiesMock().mockReturnValue({ set, get })

    const payload = await getSession()

    expect(payload?.sub).toBe('user_1')
    expect(payload?.email).toBe('a@example.com')
    expect(payload?.role).toBe('USER')
  })
})

describe('lib/users.getUserByEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('createUser: 调用 prisma.user.create 并归一化 email', async () => {
    const db = jest.requireMock('@/lib/db') as {
      prisma: { user: { create: jest.Mock } }
    }

    db.prisma.user.create.mockResolvedValue({ id: 'u1' })

    const { createUser } = await import('@/lib/users')

    const user = await createUser(' A@Example.com ', 'hashed')

    expect(db.prisma.user.create).toHaveBeenCalledWith({
      data: { email: 'a@example.com', passwordHash: 'hashed' },
    })
    expect(user).toEqual({ id: 'u1' })
  })

  it('存在则返回 user，并归一化 email', async () => {
    const db = jest.requireMock('@/lib/db') as {
      prisma: { user: { findUnique: jest.Mock } }
    }

    db.prisma.user.findUnique.mockResolvedValue({ id: 'u1' })

    const { getUserByEmail } = await import('@/lib/users')

    const user = await getUserByEmail(' A@Example.com ')

    expect(db.prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'a@example.com' },
    })
    expect(user).toEqual({ id: 'u1' })
  })

  it('不存在则返回 null', async () => {
    const db = jest.requireMock('@/lib/db') as {
      prisma: { user: { findUnique: jest.Mock } }
    }

    db.prisma.user.findUnique.mockResolvedValue(null)

    const { getUserByEmail } = await import('@/lib/users')

    await expect(getUserByEmail('missing@example.com')).resolves.toBeNull()
  })
})
