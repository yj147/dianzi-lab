import { render, screen } from '@testing-library/react'

import TechStackBadges from '@/components/idea/TechStackBadges'

describe('TechStackBadges', () => {
  it('渲染并规范化技术栈标签', () => {
    render(<TechStackBadges items={[' Next.js ', '', 'Prisma']} />)

    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText('Prisma')).toBeInTheDocument()
  })

  it('空输入返回 null', () => {
    const { container } = render(<TechStackBadges items={['   ', '']} />)
    expect(container).toBeEmptyDOMElement()
  })
})

