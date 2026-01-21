import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter, useSearchParams } from 'next/navigation'
import LoginPage from '@/app/(main)/login/page'
import { loginUser } from '@/app/(main)/login/actions'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))

jest.mock('@/app/(main)/login/actions', () => ({
  loginUser: jest.fn(),
}))

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

describe('Login Page', () => {
  const useRouterMock = useRouter as jest.Mock
  const useSearchParamsMock = useSearchParams as jest.Mock
  const loginUserMock = loginUser as jest.Mock
  const pushMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useRouterMock.mockReturnValue({ push: pushMock })
    useSearchParamsMock.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    })
  })

  it('renders login form correctly', () => {
    render(<LoginPage />)

    expect(screen.getAllByRole('heading', { name: /登录/i }).length).toBeGreaterThan(0)
    expect(screen.getByPlaceholderText(/邮箱地址/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/密码/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /登录/i })).toBeInTheDocument()
    const registerLinks = screen.getAllByRole('link', { name: /立即注册/i })
    expect(registerLinks.length).toBeGreaterThan(0)
    for (const link of registerLinks) {
      expect(link).toHaveAttribute('href', '/register')
    }
  })

  it('shows validation errors for invalid input', async () => {
    render(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: /登录/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/请输入有效的邮箱地址/i)).toBeInTheDocument()
    })
  })

  it('shows error message from server action', async () => {
    loginUserMock.mockResolvedValue({ success: false, error: '邮箱或密码错误' })
    render(<LoginPage />)

    fireEvent.change(screen.getByPlaceholderText(/邮箱地址/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText(/密码/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /登录/i }))

    await waitFor(() => {
      expect(screen.getByText(/邮箱或密码错误/i)).toBeInTheDocument()
    })
  })

  it('redirects to dashboard on successful login', async () => {
    loginUserMock.mockResolvedValue({ success: true })
    render(<LoginPage />)

    fireEvent.change(screen.getByPlaceholderText(/邮箱地址/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText(/密码/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /登录/i }))

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('shows generic error for unknown exceptions', async () => {
    loginUserMock.mockRejectedValue(new Error('Unknown error'))
    render(<LoginPage />)

    fireEvent.change(screen.getByPlaceholderText(/邮箱地址/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText(/密码/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /登录/i }))

    await waitFor(() => {
      expect(screen.getByText(/发生未知错误，请稍后再试/i)).toBeInTheDocument()
    })
  })

  it('redirects to callbackUrl on successful login', async () => {
    useSearchParamsMock.mockReturnValue({
      get: jest.fn().mockReturnValue('/submit'),
    })
    loginUserMock.mockResolvedValue({ success: true })
    render(<LoginPage />)

    fireEvent.change(screen.getByPlaceholderText(/邮箱地址/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText(/密码/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /登录/i }))

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/submit')
    })

    const formData = loginUserMock.mock.calls[0][0] as FormData
    expect(formData.get('callbackUrl')).toBe('/submit')
  })
})
