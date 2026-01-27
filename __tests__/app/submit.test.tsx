import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'

import SubmitPage from '@/app/(submit)/submit/page'
import { getSession } from '@/lib/auth'
import { submitIdeaWithAssessment } from '@/lib/idea-actions'

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

jest.mock('@/components/validator/ValidatorForm', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react')

  const makeScores = (value: number) => [
    { key: 'targetUser', value },
    { key: 'channel', value },
    { key: 'market', value },
    { key: 'tech', value },
    { key: 'budget', value },
    { key: 'businessModel', value },
    { key: 'team', value },
    { key: 'risk', value },
    { key: 'traffic', value },
  ]

  return {
    __esModule: true,
    default: ({
      onSubmit,
      isLoading,
    }: {
      onSubmit: (data: { scores: { key: string; value: number }[] }) => void
      isLoading?: boolean
    }) =>
      React.createElement(
        'div',
        null,
        React.createElement(
          'button',
          {
            type: 'button',
            disabled: Boolean(isLoading),
            onClick: () => onSubmit({ scores: makeScores(0) }),
          },
          '提交低分评估',
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            disabled: Boolean(isLoading),
            onClick: () => onSubmit({ scores: makeScores(10) }),
          },
          '提交高分评估',
        ),
      ),
  }
})

jest.mock('@/components/validator/RadarChart', () => ({
  __esModule: true,
  default: () => <div data-testid="radar-chart" />,
}))

jest.mock('@/components/validator/ResultPanel', () => ({
  __esModule: true,
  default: ({ result }: { result: any }) => <div data-testid="result-panel">{result?.overallScore ?? ''}</div>,
}))

async function click(el: HTMLElement) {
  await act(async () => {
    fireEvent.click(el)
  })
}

async function fillIdeaBasics() {
  fireEvent.change(screen.getByLabelText(/标题/), {
    target: { value: '测试点子' },
  })
  fireEvent.change(screen.getByLabelText(/核心描述/), { target: { value: '这是一个测试描述' } })
}

describe('Submit Page (3-step)', () => {
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

    expect(screen.getByRole('heading', { level: 2, name: '登录后即可提交点子' })).toBeInTheDocument()

    const loginLink = screen.getByRole('link', { name: '立即登录' })
    expect(loginLink).toHaveAttribute('href', '/login?callbackUrl=/submit')

    // SubmitForm 不应渲染
    expect(screen.queryByRole('heading', { level: 1, name: '绘制蓝图' })).not.toBeInTheDocument()
  })

  it('已登录时渲染点子表单（含预览与标签输入）', async () => {
    const PageContent = await SubmitPage()
    render(PageContent)

    expect(screen.getByRole('heading', { level: 1, name: '绘制蓝图' })).toBeInTheDocument()

    expect(screen.getByRole('link', { name: /返回首页/ })).toBeInTheDocument()

    expect(screen.getByPlaceholderText('给你的项目起个响亮的名字')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('解决了什么痛点？核心功能是什么？目标用户是谁？请尽可能详细描述场景...'),
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText('工具, AI, 效率 (用逗号分隔)')).toBeInTheDocument()

    expect(screen.getByText('实时预览')).toBeInTheDocument()
  })

  it('必填校验：标题/描述为空时显示错误', async () => {
    const PageContent = await SubmitPage()
    render(PageContent)

    await click(screen.getByRole('button', { name: /下一步：创意评估/ }))

    await waitFor(() => {
      expect(screen.getByText('标题不能为空')).toBeInTheDocument()
      expect(screen.getByText('描述不能为空')).toBeInTheDocument()
    })
  })

  it('填写完成后进入评估阶段，并可返回修改项目', async () => {
    const PageContent = await SubmitPage()
    render(PageContent)

    await fillIdeaBasics()
    await click(screen.getByRole('button', { name: /下一步：创意评估/ }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: '创意评估' })).toBeInTheDocument()
    })

    await click(screen.getByRole('button', { name: '返回修改项目' }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: '绘制蓝图' })).toBeInTheDocument()
    })
  })

  it('低分评估：不提交入库，允许返回修改', async () => {
    ;(submitIdeaWithAssessment as jest.Mock).mockResolvedValue({
      success: true,
      ideaId: 'idea-1',
      finalScore: 88,
      feedback: ['ok'],
    })

    const PageContent = await SubmitPage()
    render(PageContent)

    await fillIdeaBasics()
    await click(screen.getByRole('button', { name: /下一步：创意评估/ }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: '创意评估' })).toBeInTheDocument()
    })

    await click(screen.getByRole('button', { name: '提交低分评估' }))

    await waitFor(() => {
      expect(screen.getByText('评分未达标，项目未提交')).toBeInTheDocument()
      expect(screen.getByText(/当前评分 0 分/)).toBeInTheDocument()
    })

    expect(submitIdeaWithAssessment).not.toHaveBeenCalled()

    await click(screen.getByRole('button', { name: '修改项目' }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: '绘制蓝图' })).toBeInTheDocument()
    })
  })

  it('高分评估：提交成功后可跳转到 /dashboard', async () => {
    ;(submitIdeaWithAssessment as jest.Mock).mockResolvedValue({
      success: true,
      ideaId: 'idea-1',
      finalScore: 88,
      feedback: ['ok'],
    })

    const PageContent = await SubmitPage()
    render(PageContent)

    await fillIdeaBasics()
    await click(screen.getByRole('button', { name: /下一步：创意评估/ }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: '创意评估' })).toBeInTheDocument()
    })

    await click(screen.getByRole('button', { name: '提交高分评估' }))

    await waitFor(() => {
      expect(screen.getByRole('link', { name: '查看我的点子' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '提交新项目' })).toBeInTheDocument()
    })

    expect(screen.getByRole('link', { name: '查看我的点子' })).toHaveAttribute('href', '/dashboard')
    expect(submitIdeaWithAssessment).toHaveBeenCalledTimes(1)
  })
})
