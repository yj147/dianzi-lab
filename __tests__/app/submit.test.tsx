import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/auth'
import SubmitPage from '@/app/(submit)/submit/page'
import { submitIdea } from '@/app/(submit)/submit/actions'
import { TAGS } from '@/app/(submit)/submit/schema'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
}))

jest.mock('@/app/(submit)/submit/actions', () => ({
  submitIdea: jest.fn(),
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

function createDeferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

async function click(element: HTMLElement) {
  await act(async () => {
    fireEvent.click(element)
  })
}

describe('Submit Page', () => {
  const useRouterMock = useRouter as jest.Mock
  const submitIdeaMock = submitIdea as jest.Mock
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
      screen.queryByRole('heading', { level: 1, name: '提交新点子' }),
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

  it('点击标签可切换选中状态（提交时 tags 体现）', async () => {
    submitIdeaMock.mockResolvedValue({ success: true, ideaId: 'idea_1' })
    const PageContent = await SubmitPage()
    render(PageContent)

    fireEvent.change(screen.getByPlaceholderText('给你的梦起个名字...'), {
      target: { value: 't' },
    })
    fireEvent.change(
      screen.getByPlaceholderText('哪怕是最荒诞的细节，也请告诉我们...'),
      {
        target: { value: 'd' },
      },
    )

    const tagButton = screen.getByRole('button', { name: '工具' })
    const submitButton = screen.getByRole('button', { name: '编织梦想' })

    // 第一次点击：选中
    await click(tagButton)
    await click(submitButton)
    await waitFor(() => expect(submitIdeaMock).toHaveBeenCalledTimes(1))
    const formDataSelected = submitIdeaMock.mock.calls[0][0] as FormData
    expect(formDataSelected.getAll('tags')).toEqual(['工具'])

    // 第二次点击：取消选中
    submitIdeaMock.mockClear()
    await click(tagButton)
    await click(submitButton)
    await waitFor(() => expect(submitIdeaMock).toHaveBeenCalledTimes(1))
    const formDataUnselected = submitIdeaMock.mock.calls[0][0] as FormData
    expect(formDataUnselected.getAll('tags')).toEqual([])
  })

  it('必填字段校验：标题/描述为空时显示错误', async () => {
    const PageContent = await SubmitPage()
    render(PageContent)

    await click(screen.getByRole('button', { name: '编织梦想' }))

    await waitFor(() => {
      expect(screen.getByText('标题不能为空')).toBeInTheDocument()
      expect(screen.getByText('描述不能为空')).toBeInTheDocument()
    })

    expect(submitIdeaMock).not.toHaveBeenCalled()
  })

  it('提交中显示 Loader2，并切换 aria-busy', async () => {
    const deferred = createDeferred<{ success: true; ideaId: string }>()
    submitIdeaMock.mockImplementation(() => deferred.promise)

    const PageContent = await SubmitPage()
    render(PageContent)

    fireEvent.change(screen.getByPlaceholderText('给你的梦起个名字...'), {
      target: { value: 't' },
    })
    fireEvent.change(
      screen.getByPlaceholderText('哪怕是最荒诞的细节，也请告诉我们...'),
      {
        target: { value: 'd' },
      },
    )

    const submitButton = screen.getByRole('button', { name: '编织梦想' })
    expect(submitButton).not.toBeDisabled()
    expect(submitButton).not.toHaveAttribute('aria-busy', 'true')

    await click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
      expect(submitButton).toHaveAttribute('aria-busy', 'true')
      expect(submitButton).toHaveTextContent('提交中…')
      expect(submitButton.querySelector('svg.animate-spin')).toBeInTheDocument()
    })

    deferred.resolve({ success: true, ideaId: 'idea_1' })

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
      expect(submitButton).not.toHaveAttribute('aria-busy', 'true')
      expect(submitButton).toHaveTextContent('编织梦想')
      expect(
        submitButton.querySelector('svg.animate-spin'),
      ).not.toBeInTheDocument()
    })
  })

  it('提交成功：调用 action，显示成功 toast 并跳转', async () => {
    submitIdeaMock.mockResolvedValue({ success: true, ideaId: 'idea_1' })

    const PageContent = await SubmitPage()
    render(PageContent)

    fireEvent.change(screen.getByPlaceholderText('给你的梦起个名字...'), {
      target: { value: 't' },
    })
    fireEvent.change(
      screen.getByPlaceholderText('哪怕是最荒诞的细节，也请告诉我们...'),
      {
        target: { value: 'd' },
      },
    )
    await click(screen.getByRole('button', { name: '工具' }))
    await click(screen.getByRole('button', { name: '编织梦想' }))

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/dashboard')
    })

    expect(getToastMock()).toHaveBeenCalledWith({
      variant: 'success',
      title: '提交成功',
      description: '您的点子已成功提交！',
    })

    expect(submitIdeaMock).toHaveBeenCalledTimes(1)
    const formData = submitIdeaMock.mock.calls[0][0] as FormData
    expect(formData).toBeInstanceOf(FormData)
    expect(formData.get('title')).toBe('t')
    expect(formData.get('description')).toBe('d')
    expect(formData.getAll('tags')).toEqual(['工具'])
  })

  it('提交失败：返回 field 错误时在表单内显示错误', async () => {
    submitIdeaMock.mockResolvedValue({
      success: false,
      error: '标题不能为空',
      field: 'title',
    })

    const PageContent = await SubmitPage()
    render(PageContent)

    fireEvent.change(screen.getByPlaceholderText('给你的梦起个名字...'), {
      target: { value: 't' },
    })
    fireEvent.change(
      screen.getByPlaceholderText('哪怕是最荒诞的细节，也请告诉我们...'),
      {
        target: { value: 'd' },
      },
    )
    await click(screen.getByRole('button', { name: '编织梦想' }))

    await waitFor(() => {
      expect(screen.getByText('标题不能为空')).toBeInTheDocument()
    })

    expect(pushMock).not.toHaveBeenCalled()
  })

  it('提交失败：无 field 时显示 destructive toast', async () => {
    submitIdeaMock.mockResolvedValue({ success: false, error: '服务器错误' })

    const PageContent = await SubmitPage()
    render(PageContent)

    fireEvent.change(screen.getByPlaceholderText('给你的梦起个名字...'), {
      target: { value: 't' },
    })
    fireEvent.change(
      screen.getByPlaceholderText('哪怕是最荒诞的细节，也请告诉我们...'),
      {
        target: { value: 'd' },
      },
    )
    await click(screen.getByRole('button', { name: '编织梦想' }))

    await waitFor(() => {
      expect(getToastMock()).toHaveBeenCalledWith({
        variant: 'destructive',
        title: '提交失败',
        description: '服务器错误',
      })
    })

    expect(pushMock).not.toHaveBeenCalled()
  })

  it('提交异常：显示通用错误 toast', async () => {
    submitIdeaMock.mockRejectedValue(new Error('boom'))

    const PageContent = await SubmitPage()
    render(PageContent)

    fireEvent.change(screen.getByPlaceholderText('给你的梦起个名字...'), {
      target: { value: 't' },
    })
    fireEvent.change(
      screen.getByPlaceholderText('哪怕是最荒诞的细节，也请告诉我们...'),
      {
        target: { value: 'd' },
      },
    )
    await click(screen.getByRole('button', { name: '编织梦想' }))

    await waitFor(() => {
      expect(getToastMock()).toHaveBeenCalledWith({
        variant: 'destructive',
        title: '出错了',
        description: '发生未知错误，请稍后再试',
      })
    })
  })
})
