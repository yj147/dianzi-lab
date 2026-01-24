import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/auth'
import SubmitPage from '@/app/(submit)/submit/page'
import { TAGS } from '@/app/(submit)/submit/schema'

// Mock ResizeObserver for RadarChart component
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
}))

jest.mock('@/lib/idea-actions', () => ({
  submitIdeaWithAssessment: jest.fn(),
}))

jest.mock('@/components/ui/use-toast', () => {
  const toast = jest.fn()
  return {
    useToast: () => ({ toast }),
    __toast: toast,
  }
})

function getToastMock(): jest.Mock {
  return jest.requireMock('@/components/ui/use-toast').__toast as jest.Mock
}

async function click(element: HTMLElement) {
  await act(async () => {
    fireEvent.click(element)
  })
}

describe('Submit Page', () => {
  const useRouterMock = useRouter as jest.Mock
  const getSessionMock = getSession as jest.Mock
  const pushMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useRouterMock.mockReturnValue({ push: pushMock })
    getSessionMock.mockResolvedValue({
      sub: 'user-id',
      email: 'test@test.com',
      role: 'USER',
    })
  })

  it('未登录时渲染登录提示卡片', async () => {
    getSessionMock.mockResolvedValue(null)
    const PageContent = await SubmitPage()
    render(PageContent)

    expect(
      screen.getByRole('heading', { level: 2, name: '登录后即可提交点子' }),
    ).toBeInTheDocument()
    expect(screen.getByText('分享你的创意，让大家一起完善它。')).toBeInTheDocument()

    const loginLink = screen.getByRole('link', { name: '立即登录' })
    expect(loginLink).toHaveAttribute('href', '/login?callbackUrl=/submit')

    expect(
      screen.queryByRole('heading', { level: 1, name: '记录你的奇遇' }),
    ).not.toBeInTheDocument()
  })

  it('渲染表单（标题、描述、标签字段）', async () => {
    const PageContent = await SubmitPage()
    render(PageContent)

    expect(screen.getByRole('heading', { level: 1, name: '记录你的奇遇' })).toBeInTheDocument()

    expect(screen.getByText('点子名称')).toBeInTheDocument()
    expect(screen.getByText('梦境描述')).toBeInTheDocument()
    expect(screen.getByText('奇思标签')).toBeInTheDocument()

    const titleInput = screen.getByPlaceholderText('给你的梦起个名字...')
    const descriptionInput = screen.getByPlaceholderText(
      '哪怕是最荒诞的细节，也请告诉我们...',
    )

    expect(titleInput).toHaveAttribute('aria-describedby', 'title-helper')
    expect(descriptionInput).toHaveAttribute(
      'aria-describedby',
      'description-helper',
    )

    const tagsFieldset = screen.getByText('奇思标签').closest('fieldset')
    expect(tagsFieldset).toHaveAttribute('aria-describedby', 'tags-helper')

    expect(screen.getByText(/简洁明了/)).toBeInTheDocument()
    expect(screen.getByText(/详细描述你的想法/)).toBeInTheDocument()
    expect(screen.getByText(/选择相关标签/)).toBeInTheDocument()
  })

  it('显示预设标签', async () => {
    const PageContent = await SubmitPage()
    render(PageContent)
    for (const tag of TAGS) {
      expect(screen.getByRole('button', { name: tag })).toBeInTheDocument()
    }
  })

  it('点击标签可切换选中状态', async () => {
    const PageContent = await SubmitPage()
    render(PageContent)

    const tagButton = screen.getByRole('button', { name: '工具' })

    // 初始未选中
    expect(tagButton).toHaveAttribute('aria-pressed', 'false')

    // 点击选中
    await click(tagButton)
    expect(tagButton).toHaveAttribute('aria-pressed', 'true')

    // 再次点击取消选中
    await click(tagButton)
    expect(tagButton).toHaveAttribute('aria-pressed', 'false')
  })

  it('必填字段校验：标题/描述为空时显示错误', async () => {
    const PageContent = await SubmitPage()
    render(PageContent)

    await click(screen.getByRole('button', { name: /下一步/ }))

    await waitFor(() => {
      expect(screen.getByText('标题不能为空')).toBeInTheDocument()
      expect(screen.getByText('描述不能为空')).toBeInTheDocument()
    })
  })

  it('填写完成后点击下一步进入评估阶段', async () => {
    const PageContent = await SubmitPage()
    render(PageContent)

    fireEvent.change(screen.getByPlaceholderText('给你的梦起个名字...'), {
      target: { value: '测试点子' },
    })
    fireEvent.change(
      screen.getByPlaceholderText('哪怕是最荒诞的细节，也请告诉我们...'),
      {
        target: { value: '这是一个测试描述' },
      },
    )

    await click(screen.getByRole('button', { name: /下一步/ }))

    // 应该进入评估阶段
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: '评估你的创意' })).toBeInTheDocument()
    })
  })

  it('显示三阶段步骤指示器', async () => {
    const PageContent = await SubmitPage()
    render(PageContent)

    expect(screen.getByText('创建')).toBeInTheDocument()
    expect(screen.getByText('评估')).toBeInTheDocument()
    expect(screen.getByText('结果')).toBeInTheDocument()
  })

  it('评估阶段可以返回修改点子', async () => {
    const PageContent = await SubmitPage()
    render(PageContent)

    // 填写表单进入评估阶段
    fireEvent.change(screen.getByPlaceholderText('给你的梦起个名字...'), {
      target: { value: '测试点子' },
    })
    fireEvent.change(
      screen.getByPlaceholderText('哪怕是最荒诞的细节，也请告诉我们...'),
      {
        target: { value: '这是一个测试描述' },
      },
    )
    await click(screen.getByRole('button', { name: /下一步/ }))

    // 等待进入评估阶段
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: '评估你的创意' })).toBeInTheDocument()
    })

    // 点击返回修改
    await click(screen.getByRole('button', { name: '返回修改点子' }))

    // 应该回到创建阶段
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: '记录你的奇遇' })).toBeInTheDocument()
    })
  })
})
