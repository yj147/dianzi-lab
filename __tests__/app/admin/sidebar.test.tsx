import { render, screen, fireEvent } from '@testing-library/react';
import AdminSidebar from '@/app/admin/_components/AdminSidebar';
import { logout } from '@/lib/auth-actions';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock auth-actions
jest.mock('@/lib/auth-actions', () => ({
  logout: jest.fn(),
}));

describe('AdminSidebar', () => {
  const mockUserEmail = 'admin@example.com';
  const mockOnItemClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue('/admin');
  });

  it('renders navigation items', () => {
    render(<AdminSidebar userEmail={mockUserEmail} />);
    
    expect(screen.getByText('仪表板')).toBeInTheDocument();
    expect(screen.getByText('点子管理')).toBeInTheDocument();
    expect(screen.getByText('用户管理')).toBeInTheDocument();
    expect(screen.getByText('垃圾箱')).toBeInTheDocument();
  });

  it('highlights the active navigation item', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/ideas');
    render(<AdminSidebar userEmail={mockUserEmail} />);
    
    const ideasLink = screen.getByText('点子管理').closest('a');
    expect(ideasLink).toHaveClass('bg-blue-50');
  });

  it('renders copyright notice', () => {
    render(<AdminSidebar userEmail={mockUserEmail} />);
    expect(screen.getByText('© 2026 点子 Lab')).toBeInTheDocument();
    expect(screen.getByText('© 2026 点子 Lab')).toHaveClass('text-xs', 'text-gray-400', 'text-center');
  });

  it('renders account section with md:hidden class', () => {
    render(<AdminSidebar userEmail={mockUserEmail} />);
    
    const accountSection = screen.getByText('登录账号').closest('div')?.parentElement;
    expect(accountSection).toHaveClass('md:hidden');
    expect(screen.getByText(mockUserEmail)).toBeInTheDocument();
  });

  it('logout button has correct focus styles', () => {
    render(<AdminSidebar userEmail={mockUserEmail} />);
    
    const logoutButton = screen.getByText('退出登录').closest('button');
    expect(logoutButton).toHaveClass(
      'focus-visible:ring-2',
      'focus-visible:ring-blue-500',
      'focus-visible:outline-none',
    );
  });

  it('calls logout when logout button is clicked', async () => {
    render(<AdminSidebar userEmail={mockUserEmail} />);
    
    const logoutButton = screen.getByText('退出登录').closest('button');
    if (logoutButton) {
      fireEvent.click(logoutButton);
    }
    
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it('calls onItemClick when a navigation link is clicked', () => {
    render(<AdminSidebar userEmail={mockUserEmail} onItemClick={mockOnItemClick} />);
    
    const dashboardLink = screen.getByText('仪表板');
    fireEvent.click(dashboardLink);
    
    expect(mockOnItemClick).toHaveBeenCalledTimes(1);
  });
});
