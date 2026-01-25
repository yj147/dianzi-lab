import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from '@/app/(auth)/login/page'
import { loginUser } from '@/app/(auth)/login/actions'

jest.mock('@/app/(auth)/login/actions', () => ({
  loginUser: jest.fn(),
}))

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

describe('Login Page', () => {
  const loginUserMock = loginUser as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders login form correctly', () => {
    render(<LoginPage />)

    expect(screen.getByRole('heading', { level: 1, name: '欢迎回来' })).toBeInTheDocument()
    expect(screen.getByLabelText('邮箱')).toBeInTheDocument()
    expect(screen.getByLabelText('密码')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '开启梦境' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '注册' })).toHaveAttribute('href', '/register')
  })

  it('shows validation errors for invalid input', async () => {
    render(<LoginPage />)

    const submitButton = screen.getByRole('button', { name: '开启梦境' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/请输入有效的邮箱地址/i)).toBeInTheDocument()
    })
  })

  it('shows error message from server action', async () => {
    loginUserMock.mockResolvedValue({ success: false, error: '邮箱或密码错误' })
    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText('邮箱'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('密码'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: '开启梦境' }))

    await waitFor(() => {
      expect(screen.getByText(/邮箱或密码错误/i)).toBeInTheDocument()
    })
  })

  it('shows generic error for unknown exceptions', async () => {
    loginUserMock.mockRejectedValue(new Error('Unknown error'))
    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText('邮箱'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('密码'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: '开启梦境' }))

    await waitFor(() => {
      expect(screen.getByText(/发生未知错误，请稍后再试/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    loginUserMock.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: false, error: '邮箱或密码错误' }), 100)
        )
    )
    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText('邮箱'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('密码'), {
      target: { value: 'password123' },
    })

    const submitButton = screen.getByRole('button', { name: '开启梦境' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toHaveAttribute('aria-busy', 'true')
      expect(screen.getByText(/登录中…/i)).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
    })

    await waitFor(() => {
      expect(screen.getByText(/邮箱或密码错误/i)).toBeInTheDocument()
    })
  })

  it('passes callbackUrl to server action', async () => {
    loginUserMock.mockResolvedValue({ success: false, error: '邮箱或密码错误' })
    render(<LoginPage searchParams={{ callbackUrl: '/submit' }} />)

    fireEvent.change(screen.getByLabelText('邮箱'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('密码'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: '开启梦境' }))

    await waitFor(() => {
      expect(loginUserMock).toHaveBeenCalled()
    })

    const formData = loginUserMock.mock.calls[0][0] as FormData
    expect(formData.get('callbackUrl')).toBe('/submit')
  })

  it('shows field-specific error from server action', async () => {
    loginUserMock.mockResolvedValue({ success: false, error: '邮箱格式不正确', field: 'email' })
    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText('邮箱'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('密码'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: '开启梦境' }))

    await waitFor(() => {
      expect(screen.getByText(/邮箱格式不正确/i)).toBeInTheDocument()
    })
  })
})
