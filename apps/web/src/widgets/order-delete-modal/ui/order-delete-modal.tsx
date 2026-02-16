'use client'

import { selectOrder } from '@/entities/order/model/order-slice'
import { ActionModalLayout } from '@/shared/ui/action-modal-layout/action-modal-layout'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { deleteOrderAction } from '@/entities/order/api/actions'

export const OrderDeleteModal = () => {
  const dispatch = useAppDispatch()
  const { selectedOrderId, list } = useAppSelector((state) => state.order)
  const order = list.find((o) => o.id === selectedOrderId)
  const firstProduct = order?.products?.[0]
  const isOpen = selectedOrderId !== null

  const handleClose = () => dispatch(selectOrder(null))

  const handleDelete = () => {
    if (selectedOrderId) {
      deleteOrderAction(selectedOrderId)
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
      // На скрине показывается первый продукт прихода
      itemTitle={firstProduct?.title ?? order?.title ?? 'Приход'}
      itemImage={firstProduct?.photo ?? '/monitor.webp'}
    >
      {firstProduct && (
        <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
          SN-{firstProduct.serialNumber}
        </div>
      )}
    </ActionModalLayout>
  )
}
