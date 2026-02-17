import { render, screen } from '@testing-library/react'
import { EmptyState } from '@/shared/ui/empty-state/empty-state'

describe('EmptyState', () => {
  it('рендерит дефолтный заголовок', () => {
    render(<EmptyState />)
    expect(screen.getByText('Здесь пока пусто')).toBeInTheDocument()
  })

  it('рендерит кастомный заголовок', () => {
    render(<EmptyState title="Товары не найдены" />)
    expect(screen.getByText('Товары не найдены')).toBeInTheDocument()
  })

  it('рендерит description если передан', () => {
    render(<EmptyState description="Список пуст" />)
    expect(screen.getByText('Список пуст')).toBeInTheDocument()
  })

  it('не рендерит description если не передан', () => {
    render(<EmptyState />)
    expect(screen.queryByRole('paragraph')).toBeNull()
  })

  it('рендерит дефолтный icon 📦', () => {
    render(<EmptyState />)
    expect(screen.getByText('📦')).toBeInTheDocument()
  })

  it('рендерит кастомный icon', () => {
    render(<EmptyState icon="🚀" />)
    expect(screen.getByText('🚀')).toBeInTheDocument()
  })

  it('применяет кастомный className', () => {
    const { container } = render(<EmptyState className="my-class" />)
    expect(container.firstChild).toHaveClass('my-class')
  })
})
