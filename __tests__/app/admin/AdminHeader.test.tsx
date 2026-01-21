import { render, screen, fireEvent } from '@testing-library/react';
import AdminHeader from '@/app/admin/_components/AdminHeader';
import { usePathname } from 'next/navigation';
import { logout } from '@/lib/auth-actions';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('@/lib/auth-actions', () => ({
  logout: jest.fn(),
}));

// Mock AdminSidebar to avoid deep rendering issues and focus on AdminHeader logic
jest.mock('@/app/admin/_components/AdminSidebar', () => {
  return function MockAdminSidebar({ onItemClick }: { onItemClick: () => void }) {
    return (
      <div data-testid="admin-sidebar">
        <button onClick={onItemClick}>Sidebar Item</button>
      </div>
    );
  };
});

describe('AdminHeader', () => {
  const userEmail = 'admin@example.com';

  beforeEach(() => {
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue('/admin');
  });

  it('renders breadcrumb and email on desktop', () => {
    render(<AdminHeader userEmail={userEmail} />);
    
    expect(screen.getByText('后台管理')).toBeInTheDocument();
    expect(screen.getByText('仪表板')).toBeInTheDocument();
    expect(screen.getByText(userEmail)).toBeInTheDocument();
  });

  it('shows correct breadcrumb for different routes', () => {
    const { rerender } = render(<AdminHeader userEmail={userEmail} />);
    expect(screen.getByText('仪表板')).toBeInTheDocument();

    (usePathname as jest.Mock).mockReturnValue('/admin/ideas');
    rerender(<AdminHeader userEmail={userEmail} />);
    expect(screen.getByText('点子管理')).toBeInTheDocument();

    (usePathname as jest.Mock).mockReturnValue('/admin/users');
    rerender(<AdminHeader userEmail={userEmail} />);
    expect(screen.getByText('用户管理')).toBeInTheDocument();

    (usePathname as jest.Mock).mockReturnValue('/admin/trash');
    rerender(<AdminHeader userEmail={userEmail} />);
    expect(screen.getByText('垃圾箱')).toBeInTheDocument();

    (usePathname as jest.Mock).mockReturnValue('/admin/unknown');
    rerender(<AdminHeader userEmail={userEmail} />);
    expect(screen.getByText('仪表板')).toBeInTheDocument();
  });

  it('calls logout when clicking logout button', () => {
    render(<AdminHeader userEmail={userEmail} />);
    const logoutButton = screen.getByRole('button', { name: '退出登录' });
    
    fireEvent.click(logoutButton);
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it('toggles mobile menu', () => {
    render(<AdminHeader userEmail={userEmail} />);
    
    // Initially overlay is not present
    expect(screen.queryByTestId('sidebar-overlay')).not.toBeInTheDocument();

    const openButton = screen.getByLabelText('Open menu');
    fireEvent.click(openButton);
    
    expect(screen.getByText('管理菜单')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-overlay')).toBeInTheDocument();
    
    // Close using close button
    const closeButton = screen.getByLabelText('Close menu');
    fireEvent.click(closeButton);
    expect(screen.queryByTestId('sidebar-overlay')).not.toBeInTheDocument();
    
    // Close using overlay (need to re-open first)
    fireEvent.click(openButton);
    const overlay = screen.getByTestId('sidebar-overlay');
    fireEvent.click(overlay);
    expect(screen.queryByTestId('sidebar-overlay')).not.toBeInTheDocument();

    // Close using sidebar item click (need to re-open first)
    fireEvent.click(openButton);
    const sidebarItem = screen.getByText('Sidebar Item');
    fireEvent.click(sidebarItem);
    expect(screen.queryByTestId('sidebar-overlay')).not.toBeInTheDocument();
  });
});
