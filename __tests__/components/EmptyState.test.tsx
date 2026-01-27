import { render, screen } from '@testing-library/react';
import EmptyState from '@/components/EmptyState';
import React from 'react';

// Mock Sparkles to test for its presence easily
jest.mock('lucide-react', () => ({
  Sparkles: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="sparkles-icon" {...props} />
  ),
}));

describe('EmptyState Component', () => {
  const defaultMessage = '暂无已交付案例';

  it('renders the message correctly with default style', () => {
    render(<EmptyState message={defaultMessage} />);
    const messageElement = screen.getByText(defaultMessage);
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveClass('text-gray-500');
  });

  it('renders the default SparklesIcon when no icon is provided', () => {
    render(<EmptyState message={defaultMessage} />);
    const icon = screen.getByTestId('sparkles-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('w-12 h-12');
    
    // Check icon container classes
    const iconContainer = icon.parentElement;
    expect(iconContainer).toHaveClass('text-gray-400 mb-4 w-12 h-12 mx-auto');
  });

  it('renders a custom icon when provided', () => {
    render(
      <EmptyState 
        message={defaultMessage} 
        icon={<span data-testid="custom-icon" />} 
      />
    );
    
    expect(screen.queryByTestId('sparkles-icon')).not.toBeInTheDocument();
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('has correct container layout classes', () => {
    const { container } = render(<EmptyState message={defaultMessage} />);
    const rootDiv = container.firstChild;
    expect(rootDiv).toHaveClass('text-center py-16');
  });

  it('renders an action when provided', () => {
    render(
      <EmptyState
        message={defaultMessage}
        action={<button data-testid="action-btn">Action Button</button>}
      />
    );

    const actionBtn = screen.getByTestId('action-btn');
    expect(actionBtn).toBeInTheDocument();
  });

  it('does not render action when action is not provided', () => {
    render(<EmptyState message={defaultMessage} />);
    expect(screen.queryByTestId('action-btn')).not.toBeInTheDocument();
  });
});
