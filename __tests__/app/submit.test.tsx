import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import SubmitPage from '@/app/submit/page'
import { submitIdea } from '@/app/submit/actions'
import { TAGS } from '@/app/submit/schema'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/app/submit/actions', () => ({
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

async function click(element: HTMLElement) {
  await act(async () => {
    fireEvent.click(element)
  })
}

describe('Submit Page', () => {
  const useRouterMock = useRouter as jest.Mock
  const submitIdeaMock = submitIdea as jest.Mock
  const pushMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useRouterMock.mockReturnValue({ push: pushMock })
  })

  it('渲染表单（标题、描述、标签字段）', () => {
    render(<SubmitPage />)

    expect(screen.getByRole('heading', { level: 1, name: '提交新点子' })).toBeInTheDocument()
    expect(screen.getByText('分享你的创意，让大家一起完善它')).toBeInTheDocument()

    expect(screen.getByText('标题')).toBeInTheDocument()
    expect(screen.getByText('描述')).toBeInTheDocument()
    expect(screen.getByText('标签')).toBeInTheDocument()

    expect(screen.getByPlaceholderText('为你的点子起个吸引人的标题')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('详细描述你的点子，包括它解决什么问题、如何实现等')).toBeInTheDocument()
  })

  it('显示预设标签', () => {
    render(<SubmitPage />)
    for (const tag of TAGS) {
      expect(screen.getByRole('button', { name: tag })).toBeInTheDocument()
    }
  })

  it('点击标签可切换选中状态（提交时 tags 体现）', async () => {
    submitIdeaMock.mockResolvedValue({ success: true, ideaId: 'idea_1' })
    render(<SubmitPage />)

    fireEvent.change(screen.getByPlaceholderText('为你的点子起个吸引人的标题'), {
      target: { value: 't' },
    })
    fireEvent.change(
      screen.getByPlaceholderText('详细描述你的点子，包括它解决什么问题、如何实现等'),
      {
        target: { value: 'd' },
      },
    )

    const tagButton = screen.getByRole('button', { name: '工具' })
    const submitButton = screen.getByRole('button', { name: '发布点子' })

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
    render(<SubmitPage />)

    await click(screen.getByRole('button', { name: '发布点子' }))

    await waitFor(() => {
      expect(screen.getByText('标题不能为空')).toBeInTheDocument()
      expect(screen.getByText('描述不能为空')).toBeInTheDocument()
    })

    expect(submitIdeaMock).not.toHaveBeenCalled()
  })

  it('提交成功：调用 action，显示成功 toast 并跳转', async () => {
    submitIdeaMock.mockResolvedValue({ success: true, ideaId: 'idea_1' })

    render(<SubmitPage />)

    fireEvent.change(screen.getByPlaceholderText('为你的点子起个吸引人的标题'), {
      target: { value: 't' },
    })
    fireEvent.change(
      screen.getByPlaceholderText('详细描述你的点子，包括它解决什么问题、如何实现等'),
      {
        target: { value: 'd' },
      },
    )
    await click(screen.getByRole('button', { name: '工具' }))
    await click(screen.getByRole('button', { name: '发布点子' }))

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/dashboard')
    })

    expect(getToastMock()).toHaveBeenCalledWith({
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

    render(<SubmitPage />)

    fireEvent.change(screen.getByPlaceholderText('为你的点子起个吸引人的标题'), {
      target: { value: 't' },
    })
    fireEvent.change(
      screen.getByPlaceholderText('详细描述你的点子，包括它解决什么问题、如何实现等'),
      {
        target: { value: 'd' },
      },
    )
    await click(screen.getByRole('button', { name: '发布点子' }))

    await waitFor(() => {
      expect(screen.getByText('标题不能为空')).toBeInTheDocument()
    })

    expect(pushMock).not.toHaveBeenCalled()
  })

  it('提交失败：无 field 时显示 destructive toast', async () => {
    submitIdeaMock.mockResolvedValue({ success: false, error: '服务器错误' })

    render(<SubmitPage />)

    fireEvent.change(screen.getByPlaceholderText('为你的点子起个吸引人的标题'), {
      target: { value: 't' },
    })
    fireEvent.change(
      screen.getByPlaceholderText('详细描述你的点子，包括它解决什么问题、如何实现等'),
      {
        target: { value: 'd' },
      },
    )
    await click(screen.getByRole('button', { name: '发布点子' }))

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

    render(<SubmitPage />)

    fireEvent.change(screen.getByPlaceholderText('为你的点子起个吸引人的标题'), {
      target: { value: 't' },
    })
    fireEvent.change(
      screen.getByPlaceholderText('详细描述你的点子，包括它解决什么问题、如何实现等'),
      {
        target: { value: 'd' },
      },
    )
    await click(screen.getByRole('button', { name: '发布点子' }))

    await waitFor(() => {
      expect(getToastMock()).toHaveBeenCalledWith({
        variant: 'destructive',
        title: '出错了',
        description: '发生未知错误，请稍后再试',
      })
    })
  })
})
