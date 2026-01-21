import { fireEvent, render, screen } from '@testing-library/react'
import LogoutButton from '@/components/LogoutButton'
import * as authActions from '@/lib/auth-actions'

jest.mock('@/lib/auth-actions', () => ({
  logout: jest.fn(),
}))

describe('LogoutButton', () => {
  it('点击触发 logout', () => {
    render(<LogoutButton />)

    fireEvent.click(screen.getByRole('button', { name: '退出登录' }))
    expect(authActions.logout).toHaveBeenCalled()
  })
})

