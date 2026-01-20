import React from 'react'

jest.mock('next/font/google', () => ({
  Inter: () => ({ className: 'inter' }),
}))

describe('RootLayout', () => {
  it('设置 lang 并包含 children', async () => {
    const RootLayout = (await import('@/app/layout')).default
    const tree = RootLayout({ children: <div>child</div> })

    expect(tree.type).toBe('html')
    expect(tree.props.lang).toBe('zh-CN')
  })
})

