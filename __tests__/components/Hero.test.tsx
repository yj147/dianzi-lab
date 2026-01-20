import { render, screen } from '@testing-library/react';
import Hero from '@/components/Hero';

describe('Hero Component', () => {
  it('renders the title', () => {
    render(<Hero />);
    const title = screen.getByText(/点子实验室/i);
    expect(title).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<Hero />);
    const subtitle = screen.getByText(/你的创意，我们来实现/i);
    expect(subtitle).toBeInTheDocument();
  });

  it('renders CTA buttons with correct links', () => {
    render(<Hero />);
    const submitBtn = screen.getByRole('link', { name: /提交点子/i });
    const toolsBtn = screen.getByRole('link', { name: /浏览工具/i });

    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toHaveAttribute('href', '/submit');
    
    expect(toolsBtn).toBeInTheDocument();
    expect(toolsBtn).toHaveAttribute('href', '#tools');
  });
});
