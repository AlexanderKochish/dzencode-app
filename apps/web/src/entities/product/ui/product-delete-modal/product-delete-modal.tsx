'use client'

import { useAppDispatch, useAppSelector } from '@/app/store'
import { ActionModalLayout } from '@/shared/ui/action-modal-layout/action-modal-layout'
import { selectProduct } from '../../model/product-slice'
import { deleteProductAction } from '../../api/actions'

export const ProductDeleteModal = () => {
  const dispatch = useAppDispatch()

  const { selectedProductId, products } = useAppSelector(
    (state) => state.products
  )

  const product = products.find((p) => p.id === selectedProductId)
  const isOpen = selectedProductId !== null

  const handleClose = () => {
    dispatch(selectProduct(null))
  }

  const handleDelete = async () => {
    if (!selectedProductId) return

    try {
      await deleteProductAction(selectedProductId)

      handleClose()
    } catch (error) {
      console.error('Ошибка при удалении продукта:', error)
    }
  }

  if (!isOpen && !product) return null

  return (
    <ActionModalLayout
      isOpen={isOpen}
      onClose={handleClose}
      onAction={handleDelete}
      title="Вы уверены, что хотите удалить этот продукт?"
      variant="delete"
      itemTitle={product?.title || 'Продукт'}
      itemImage={product?.photo || '/monitor.webp'}
    >
      {product && (
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
          S/N: {product.serialNumber} | {product.type}
        </div>
      )}
    </ActionModalLayout>
  )
}
