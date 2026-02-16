'use client'

import { useAppDispatch } from '@/app/store'
import { selectOrder, setOrders } from '@/entities/order/model/order-slice'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import styles from './orders.module.scss'
import { formatDateForOrder, formatDateShort } from '@/shared/lib/date/format-date'
import { Order } from '@/entities/order/model/types'
import { calculateTotal } from '@/entities/order/lib/calculate-order-total'
import { OrderDeleteModal } from '@/widgets/order-delete-modal/ui/order-delete-modal'
import { Pagination } from '@/shared/ui/pagination/pagination'
import { useState, useEffect } from 'react'

interface Props {
  initialOrders: Order[]
  totalCount: number
  pageSize: number
}

export default function OrdersPageClient({ initialOrders, totalCount, pageSize }: Props) {
  const dispatch = useAppDispatch()
  const [openOrderId, setOpenOrderId] = useState<number | null>(null)

  const openOrder = initialOrders.find((o) => o.id === openOrderId) ?? null

  useEffect(() => {
    dispatch(setOrders({ items: initialOrders, totalCount }))
  }, [dispatch, initialOrders, totalCount])

  const handleOrderClick = (id: number) => {
    setOpenOrderId((prev) => (prev === id ? null : id))
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <button className={styles.plusBtn}>+</button>
        <h1>Приходы / {totalCount}</h1>
      </div>

      <div className={styles.workspace}>
        <div className={`${styles.ordersList} ${openOrder ? styles.ordersListNarrow : ''}`}>
          <AnimatePresence>
            {initialOrders.map((order) => {
              const isActive = order.id === openOrderId
              const usd = calculateTotal(order.products, 'USD')
              const uah = calculateTotal(order.products, 'UAH')

              return (
                <motion.div
                  key={order.id}
                  className={`${styles.orderItem} ${isActive ? styles.orderItemActive : ''}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -80 }}
                  transition={{ duration: 0.22 }}
                  onClick={() => handleOrderClick(order.id)}
                >
                  <div className={styles.orderTitle}>{order.title}</div>

                  <div className={styles.productsCount}>
                    <div className={styles.listIcon}>☰</div>
                    <div className={styles.countInfo}>
                      <strong>{order.products.length}</strong>
                      <span>Продукта</span>
                    </div>
                  </div>

                  <div className={styles.dates}>
                    <span className={styles.dateShort}>
                      {String(order.products.length).padStart(2, '0')} / {String(20).padStart(2, '0')}
                    </span>
                    <span className={styles.dateLong}>{formatDateForOrder(order.date)}</span>
                  </div>

                  <div className={styles.prices}>
                    {usd > 0 && <span className={styles.priceUsd}>{usd.toLocaleString('ru-RU')} $</span>}
                    {uah > 0 && <span className={styles.priceUah}>{uah.toLocaleString('ru-RU')} UAH</span>}
                  </div>

                  {isActive && <div className={styles.chevron}>›</div>}

                  <button
                    className={styles.deleteBtn}
                    onClick={(e) => {
                      e.stopPropagation()
                      dispatch(selectOrder(order.id))
                    }}
                    aria-label="Удалить приход"
                  >
                    🗑
                  </button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {openOrder && (
            <motion.div
              key={openOrder.id}
              className={styles.detailPanel}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.22 }}
            >
              <button
                className={styles.closeBtn}
                onClick={() => setOpenOrderId(null)}
                aria-label="Закрыть"
              >
                ✕
              </button>

              <h2 className={styles.detailTitle}>{openOrder.title}</h2>

              <button className={styles.addProductBtn}>
                <span className={styles.addIcon}>+</span>
                Добавить продукт
              </button>

              <div className={styles.productList}>
                {openOrder.products.length === 0 ? (
                  <p className={styles.emptyMsg}>В этом приходе нет продуктов</p>
                ) : (
                  openOrder.products.map((product) => (
                    <div key={product.id} className={styles.productRow}>
                      <span
                        className={`${styles.dot} ${product.isNew ? styles.dotGreen : styles.dotGray}`}
                      />
                      <div className={styles.productImg}>
                        <Image
                          src={product.photo || '/monitor.jpg'}
                          alt={product.title}
                          width={38}
                          height={38}
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                      <div className={styles.productMeta}>
                        <span className={styles.productName}>{product.title}</span>
                        <span className={styles.productSn}>SN-{product.serialNumber}</span>
                      </div>
                      <span className={styles.productStatus}>
                        {product.isNew ? 'Свободен' : 'В ремонте'}
                      </span>
                      <button className={styles.productDelBtn} aria-label="Удалить продукт">
                        🗑
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Pagination totalCount={totalCount} pageSize={pageSize} />
      <OrderDeleteModal />
    </div>
  )
}
