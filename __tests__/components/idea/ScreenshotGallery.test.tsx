import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import ScreenshotGallery from '@/components/idea/ScreenshotGallery'

describe('ScreenshotGallery', () => {
  it('空截图返回 null', () => {
    const { container } = render(
      <ScreenshotGallery screenshots={['   ']} title="测试案例" />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('支持 Esc 关闭预览', async () => {
    render(
      <ScreenshotGallery
        screenshots={['https://example.com/screenshot.png']}
        title="测试案例"
      />
    )

    fireEvent.click(
      screen.getByRole('button', { name: '测试案例 截图 1' })
    )

    expect(screen.getByRole('dialog', { name: '截图预览' })).toBeInTheDocument()

    await waitFor(() => expect(document.body.style.overflow).toBe('hidden'))

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() =>
      expect(
        screen.queryByRole('dialog', { name: '截图预览' })
      ).not.toBeInTheDocument()
    )

    await waitFor(() => expect(document.body.style.overflow).toBe(''))
  })
})

