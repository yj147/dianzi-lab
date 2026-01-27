import { render, screen } from '@testing-library/react'
import IdeaCard from '@/components/IdeaCard'

describe('IdeaCard Component', () => {
  const mockIdea = {
    id: '1',
    title: '测试工具',
    description: '这是一个测试工具的描述',
    tags: ['React', 'TypeScript'],
    status: 'PENDING' as const,
    authorName: 'Tester',
  }

  it('renders title', () => {
    render(<IdeaCard idea={mockIdea} />)
    expect(screen.getByText('测试工具')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<IdeaCard idea={mockIdea} />)
    expect(screen.getByText('这是一个测试工具的描述')).toBeInTheDocument()
  })

  it('renders tags', () => {
    render(<IdeaCard idea={mockIdea} />)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('renders status label and author', () => {
    render(<IdeaCard idea={mockIdea} />)
    expect(screen.getByText('审核中')).toBeInTheDocument()
    expect(screen.getByText('Tester')).toBeInTheDocument()
  })

  it('renders tags as chips with rounded-md class', () => {
    render(<IdeaCard idea={mockIdea} />)
    const reactTag = screen.getByText('React')
    const tsTag = screen.getByText('TypeScript')
    expect(reactTag).toHaveClass('rounded-md')
    expect(tsTag).toHaveClass('rounded-md')
  })

  it('card uses Industrial Blueprint v3 surface styling', () => {
    const { container } = render(<IdeaCard idea={mockIdea} />)
    const card = container.firstChild
    expect(card).toHaveClass('border-2')
    expect(card).toHaveClass('border-brand-dark')
    expect(card).toHaveClass('bg-white')
    expect(card).toHaveClass('shadow-solid-sm')
  })

  it('card has hover effect classes', () => {
    const { container } = render(<IdeaCard idea={mockIdea} />)
    const card = container.firstChild
    expect(card).toHaveClass('hover:-translate-y-1.5')
    expect(card).toHaveClass('hover:shadow-solid')
  })
})
