import React from 'react'

jest.mock('next/font/google', () => ({
  Ma_Shan_Zheng: () => ({ className: 'ma-shan-zheng', variable: '--font-ma-shan-zheng' }),
  Quicksand: () => ({ className: 'quicksand', variable: '--font-quicksand' }),
  ZCOOL_KuaiLe: () => ({ className: 'zcool-kuai-le', variable: '--font-zcool' }),
}))

describe('RootLayout', () => {
  it('设置 lang 并包含 children', async () => {
    const RootLayout = (await import('@/app/layout')).default
    const tree = RootLayout({ children: <div>child</div> })

    expect(tree.type).toBe('html')
    expect(tree.props.lang).toBe('zh-CN')
  })
})
