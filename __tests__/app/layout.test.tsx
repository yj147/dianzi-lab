import React from 'react'

jest.mock('next/font/google', () => ({
  DM_Sans: () => ({ className: 'dm-sans', variable: '--font-sans' }),
  Space_Grotesk: () => ({
    className: 'space-grotesk',
    variable: '--font-heading',
  }),
  JetBrains_Mono: () => ({
    className: 'jetbrains-mono',
    variable: '--font-mono',
  }),
}))

describe('RootLayout', () => {
  it('设置 lang 并包含 children', async () => {
    const RootLayout = (await import('@/app/layout')).default
    const tree = RootLayout({ children: <div>child</div> })

    expect(tree.type).toBe('html')
    expect(tree.props.lang).toBe('zh-CN')
  })
})
