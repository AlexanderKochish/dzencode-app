'use client'

import { useAppDispatch, useAppSelector } from '@/app/store'
import { ActionModalLayout } from '@/shared/ui/action-modal-layout/action-modal-layout'
import { selectProduct } from '../../model/product-slice'
import { deleteProductAction } from '../../api/actions'
import { useTranslations } from '@/shared/i18n/i18n-context'

export const ProductDeleteModal = () => {
  const dispatch = useAppDispatch()
  const t = useTranslations('products')

  const { selectedProductId, products } = useAppSelector((state) => state.products)

  const product = products.find((p) => p.id === selectedProductId)
  const isOpen = selectedProductId !== null

  const handleClose = () => dispatch(selectProduct(null))

  const handleDelete = async () => {
    if (!selectedProductId) return

    try {
      await deleteProductAction(selectedProductId)
      handleClose()
    } catch (error) {
      console.error(error)
    }
  }

  if (!isOpen && !product) return null

  return (
    <ActionModalLayout
      isOpen={isOpen}
      onClose={handleClose}
      onAction={handleDelete}
      title={t('delete_confirm')}
      variant="delete"
      itemTitle={product?.title || t('title')}
      itemImage={product?.photo || '/monitor.webp'}
      cancelText={t('cancel_btn')}
      actionText={t('delete_btn')}
    >
      {product && (
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
          S/N: {product.serialNumber} | {product.type}
        </div>
      )}
    </ActionModalLayout>
  )
}
