/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'

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
    jest.resetModules()
  })

  describe('matcher 配置', () => {
    it('不应保护 /submit（允许未登录访问）', async () => {
      const { config } = await import('@/middleware')

      expect(config.matcher).toEqual(
        expect.arrayContaining(['/dashboard/:path*', '/admin/:path*'])
      )
      expect(config.matcher).not.toContain('/submit')
    })
  })

  describe('未登录用户', () => {
    it('/dashboard 重定向到 /login?callbackUrl=/dashboard', async () => {
      const { middleware } = await import('@/middleware')
      const request = createRequest('/dashboard')
      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe(
        'http://localhost:3000/login?callbackUrl=%2Fdashboard'
      )
    })

    it('/admin 重定向到 /login?callbackUrl=/admin', async () => {
      const { middleware } = await import('@/middleware')
      const request = createRequest('/admin')
      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe(
        'http://localhost:3000/login?callbackUrl=%2Fadmin'
      )
    })
  })

  describe('已携带 cookie 的请求', () => {
    it('/dashboard 允许访问（不在 middleware 层做 token 验证）', async () => {
      const { middleware } = await import('@/middleware')
      const request = createRequest('/dashboard', 'any-token')
      const response = await middleware(request)

      expect(response.status).toBe(200)
      expect(response.headers.get('x-middleware-next')).toBe('1')
    })

    it('/admin 允许访问（角色校验在服务端布局中完成）', async () => {
      const { middleware } = await import('@/middleware')
      const request = createRequest('/admin', 'any-token')
      const response = await middleware(request)

      expect(response.status).toBe(200)
      expect(response.headers.get('x-middleware-next')).toBe('1')
    })
  })
})
