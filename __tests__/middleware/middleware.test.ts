/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { SignJWT } from 'jose'

const JWT_SECRET = 'test-secret'
const secretKey = new TextEncoder().encode(JWT_SECRET)

async function createTestToken(role: string): Promise<string> {
  return new SignJWT({ email: 'test@example.com', role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('user_1')
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secretKey)
}

function createRequest(pathname: string, token?: string): NextRequest {
  const url = new URL(pathname, 'http://localhost:3000')
  const request = new NextRequest(url)
  if (token) {
    request.cookies.set('session', token)
  }
  return request
}

describe('middleware', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = JWT_SECRET
    jest.resetModules()
  })

  describe('公开路由', () => {
    it.each(['/', '/login', '/register'])(
      '%s 无需认证直接通过',
      async (path) => {
        const { middleware } = await import('@/middleware')
        const request = createRequest(path)
        const response = await middleware(request)

        expect(response.status).toBe(200)
        expect(response.headers.get('x-middleware-next')).toBe('1')
      },
    )
  })

  describe('未登录用户', () => {
    it('/dashboard 重定向到 /login', async () => {
      const { middleware } = await import('@/middleware')
      const request = createRequest('/dashboard')
      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe(
        'http://localhost:3000/login',
      )
    })

    it('/admin 重定向到 /login', async () => {
      const { middleware } = await import('@/middleware')
      const request = createRequest('/admin')
      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe(
        'http://localhost:3000/login',
      )
    })

    it('/submit 重定向到 /login', async () => {
      const { middleware } = await import('@/middleware')
      const request = createRequest('/submit')
      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe(
        'http://localhost:3000/login',
      )
    })
  })

  describe('普通用户 (USER)', () => {
    it('/dashboard 允许访问', async () => {
      const { middleware } = await import('@/middleware')
      const token = await createTestToken('USER')
      const request = createRequest('/dashboard', token)
      const response = await middleware(request)

      expect(response.status).toBe(200)
      expect(response.headers.get('x-middleware-next')).toBe('1')
    })

    it('/admin 重定向到 /dashboard', async () => {
      const { middleware } = await import('@/middleware')
      const token = await createTestToken('USER')
      const request = createRequest('/admin', token)
      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe(
        'http://localhost:3000/dashboard',
      )
    })

    it('/admin/users 重定向到 /dashboard', async () => {
      const { middleware } = await import('@/middleware')
      const token = await createTestToken('USER')
      const request = createRequest('/admin/users', token)
      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe(
        'http://localhost:3000/dashboard',
      )
    })

    it('/submit 允许访问', async () => {
      const { middleware } = await import('@/middleware')
      const token = await createTestToken('USER')
      const request = createRequest('/submit', token)
      const response = await middleware(request)

      expect(response.status).toBe(200)
      expect(response.headers.get('x-middleware-next')).toBe('1')
    })
  })

  describe('管理员 (ADMIN)', () => {
    it('/dashboard 允许访问', async () => {
      const { middleware } = await import('@/middleware')
      const token = await createTestToken('ADMIN')
      const request = createRequest('/dashboard', token)
      const response = await middleware(request)

      expect(response.status).toBe(200)
      expect(response.headers.get('x-middleware-next')).toBe('1')
    })

    it('/admin 允许访问', async () => {
      const { middleware } = await import('@/middleware')
      const token = await createTestToken('ADMIN')
      const request = createRequest('/admin', token)
      const response = await middleware(request)

      expect(response.status).toBe(200)
      expect(response.headers.get('x-middleware-next')).toBe('1')
    })

    it('/admin/users 允许访问', async () => {
      const { middleware } = await import('@/middleware')
      const token = await createTestToken('ADMIN')
      const request = createRequest('/admin/users', token)
      const response = await middleware(request)

      expect(response.status).toBe(200)
      expect(response.headers.get('x-middleware-next')).toBe('1')
    })
  })

  describe('无效 token', () => {
    it('篡改的 token 重定向到 /login 并清除 cookie', async () => {
      const { middleware } = await import('@/middleware')
      const request = createRequest('/dashboard', 'invalid-token')
      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe(
        'http://localhost:3000/login',
      )
      expect(response.cookies.get('session')?.value).toBe('')
    })

    it('过期的 token 重定向到 /login', async () => {
      const { middleware } = await import('@/middleware')
      const expiredToken = await new SignJWT({
        email: 'test@example.com',
        role: 'USER',
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject('user_1')
        .setExpirationTime(Math.floor(Date.now() / 1000) - 1)
        .sign(secretKey)

      const request = createRequest('/dashboard', expiredToken)
      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe(
        'http://localhost:3000/login',
      )
    })
  })
})
