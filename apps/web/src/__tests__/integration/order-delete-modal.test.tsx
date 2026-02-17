import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithStore } from './test-utils'
import { OrderDeleteModal } from '@/widgets/order-delete-modal/ui/order-delete-modal'
import { mockOrders } from './mocks/handlers'
import { Order } from '@/entities/order/model/types'
import Image from 'next/image'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <Image src={src} alt={alt} />
  ),
}))

jest.mock('@/entities/order/api/actions', () => ({
  deleteOrderAction: jest.fn().mockResolvedValue({ success: true }),
}))

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

const order = mockOrders[0] as unknown as Order

describe('OrderDeleteModal (integration)', () => {
  it('не рендерится если нет selectedOrderId', () => {
    const { container } = renderWithStore(<OrderDeleteModal />, {
      order: { selectedOrderId: null, list: [] },
    })
    expect(container.firstChild).toBeNull()
  })

  it('показывает заголовок заказа при открытии', () => {
    renderWithStore(<OrderDeleteModal />, {
      order: {
        selectedOrderId: order.id,
        list: [order],
      },
    })
    expect(screen.getByText(order.title)).toBeInTheDocument()
    expect(
      screen.getByText('Вы уверены, что хотите удалить этот приход?')
    ).toBeInTheDocument()
  })

  it('показывает количество продуктов в заказе', () => {
    renderWithStore(<OrderDeleteModal />, {
      order: {
        selectedOrderId: order.id,
        list: [order],
      },
    })
    expect(
      screen.getByText(new RegExp(`${order.products.length} продуктов`))
    ).toBeInTheDocument()
  })

  it('закрывает модалку при нажатии ОТМЕНИТЬ', () => {
    const { store } = renderWithStore(<OrderDeleteModal />, {
      order: {
        selectedOrderId: order.id,
        list: [order],
      },
    })

    fireEvent.click(screen.getByText('ОТМЕНИТЬ'))
    expect(store.getState().order.selectedOrderId).toBeNull()
  })

  it('вызывает deleteOrderAction и сбрасывает selectedOrderId', async () => {
    const { deleteOrderAction } = jest.requireMock(
      '@/entities/order/api/actions'
    )

    const { store } = renderWithStore(<OrderDeleteModal />, {
      order: {
        selectedOrderId: order.id,
        list: [order],
      },
    })

    fireEvent.click(screen.getByText('УДАЛИТЬ'))

    await waitFor(() => {
      expect(deleteOrderAction).toHaveBeenCalledWith(order.id)
      expect(store.getState().order.selectedOrderId).toBeNull()
    })
  })
})
