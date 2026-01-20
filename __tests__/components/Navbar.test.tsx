import { render, screen } from '@testing-library/react';
import Navbar from '@/components/Navbar';

describe('Navbar Component', () => {
  it('renders the logo', () => {
    render(<Navbar />);
    const logo = screen.getByText(/点子实验室/i);
    expect(logo).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Navbar />);
    expect(screen.getAllByRole('link', { name: /首页/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /提交点子/i })[0]).toBeInTheDocument();
  });

  it('renders login button', () => {
    render(<Navbar />);
    expect(screen.getAllByRole('link', { name: /登录/i })[0]).toBeInTheDocument();
  });
});
