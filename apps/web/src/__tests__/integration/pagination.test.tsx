import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from '@/shared/ui/pagination/pagination'

const mockPush = jest.fn()
let mockPage = '1'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/products',
  useSearchParams: () => ({
    get: (key: string) => (key === 'page' ? mockPage : null),
    toString: () => `page=${mockPage}`,
  }),
}))

describe('Pagination (integration)', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockPage = '1'
  })

  it('не рендерится при totalPages <= 1', () => {
    const { container } = render(<Pagination totalCount={10} pageSize={20} />)
    expect(container.firstChild).toBeNull()
  })

  it('рендерится при totalPages > 1', () => {
    render(<Pagination totalCount={50} pageSize={20} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('вызывает router.push с page=2 при клике на страницу 2', () => {
    render(<Pagination totalCount={50} pageSize={20} />)
    fireEvent.click(screen.getByText('2'))
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('page=2'))
  })

  it('вызывает router.push с page=1 при клике на First', () => {
    mockPage = '3'
    render(<Pagination totalCount={100} pageSize={20} />)
    const firstBtns = screen.getAllByRole('listitem')
    const firstBtn = firstBtns[0].querySelector('a, button, span')
    if (firstBtn) fireEvent.click(firstBtn)
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('page=1'))
  })

  it('показывает эллипсис при большом количестве страниц', () => {
    render(<Pagination totalCount={500} pageSize={20} />)
    const ellipses = screen.getAllByText('…')
    expect(ellipses.length).toBeGreaterThan(0)
  })

  it('текущая страница является активной', () => {
    mockPage = '2'
    render(<Pagination totalCount={60} pageSize={20} />)
    const activeLi = document.querySelector('.active')
    expect(activeLi).toBeInTheDocument()
    expect(activeLi?.textContent).toContain('2')
  })
})
