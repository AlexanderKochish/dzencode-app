'use client'

import { deleteOrder, selectOrder } from '@/entities/order/model/order-slice'

import { ActionModalLayout } from '@/shared/ui/action-modal-layout/action-modal-layout'
import { useAppDispatch, useAppSelector } from '@/app/store'

export const OrderDeleteModal = () => {
  const dispatch = useAppDispatch()

  const { selectedOrderId, list } = useAppSelector((state) => state.order)

  const order = list.find((o) => o.id === selectedOrderId)

  const isOpen = selectedOrderId !== null

  const handleClose = () => {
    dispatch(selectOrder(null))
  }

  const handleDelete = () => {
    if (selectedOrderId) {
      dispatch(deleteOrder(selectedOrderId))
      handleClose()
    }
  }

  if (!isOpen && !order) return null

  return (
    <ActionModalLayout
      isOpen={isOpen}
      onClose={handleClose}
      onAction={handleDelete}
      title="Вы уверены, что хотите удалить этот приход?"
      variant="delete"
      itemTitle={order?.title || 'Приход'}
      itemImage={order?.products?.[0]?.photo ?? '/monitor.webp'}
    >
      {order && (
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
          В заказе {order.products.length} продуктов
        </div>
      )}
    </ActionModalLayout>
  )
}
