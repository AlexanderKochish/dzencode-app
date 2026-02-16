import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from '@/shared/ui/modal/modal'

jest.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      children: React.ReactNode
    }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

describe('Modal', () => {
  const onClose = jest.fn()

  beforeEach(() => {
    onClose.mockClear()
  })

  it('рендерит children когда isOpen=true', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Содержимое модалки</p>
      </Modal>
    )
    expect(screen.getByText('Содержимое модалки')).toBeInTheDocument()
  })

  it('не рендерит children когда isOpen=false', () => {
    render(
      <Modal isOpen={false} onClose={onClose}>
        <p>Скрытое содержимое</p>
      </Modal>
    )
    expect(screen.queryByText('Скрытое содержимое')).not.toBeInTheDocument()
  })

  it('вызывает onClose при клике на overlay', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Контент</p>
      </Modal>
    )
    const overlay = screen.getByRole('dialog')
    fireEvent.click(overlay)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('не вызывает onClose при клике внутри модалки', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Контент</p>
      </Modal>
    )
    const content = screen.getByText('Контент')
    fireEvent.click(content)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('вызывает onClose при нажатии Escape', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Контент</p>
      </Modal>
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('рендерит кнопку закрытия с aria-label', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Контент</p>
      </Modal>
    )
    expect(screen.getByLabelText('Закрыть модальное окно')).toBeInTheDocument()
  })

  it('вызывает onClose при клике на кнопку закрытия', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Контент</p>
      </Modal>
    )
    fireEvent.click(screen.getByLabelText('Закрыть модальное окно'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('overlay имеет role="dialog"', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Контент</p>
      </Modal>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
