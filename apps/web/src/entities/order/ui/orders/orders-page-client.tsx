'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { setOrders, selectOrder } from '@/entities/order/model/order-slice'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './orders.module.scss'
import {
  formatDateForOrder,
  formatDateShort,
} from '@/shared/lib/date/format-date'
import { Order } from '@/entities/order/model/types'
import { calculateTotal } from '@/entities/order/lib/calculate-order-total'
import { OrderDeleteModal } from '@/widgets/order-delete-modal/ui/order-delete-modal'

export default function OrdersPageClient({
  initialOrders,
}: {
  initialOrders: Order[]
}) {
  const dispatch = useAppDispatch()
  const { list: orders } = useAppSelector((state) => state.order)

  useEffect(() => {
    dispatch(setOrders(initialOrders))
  }, [initialOrders, dispatch])

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <button className={styles.plusBtn}>+</button>
        <h1>Приходы / {orders.length}</h1>
      </div>

      <div className={styles.ordersList}>
        <AnimatePresence>
          {orders.map((order) => (
            <motion.div
              key={order.id}
              className={styles.orderItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.title}>{order.title}</div>

              <div className={styles.productsCount}>
                <div className={styles.icon}>☰</div>
                <div className={styles.count}>
                  <strong>{order.products.length}</strong>
                  <span>Продукта</span>
                </div>
              </div>

              <div className={styles.dates}>
                <span className={styles.short}>
                  {formatDateShort(order.date)}
                </span>
                <span className={styles.long}>
                  {formatDateForOrder(order.date)}
                </span>
              </div>

              <div className={styles.prices}>
                <span className={styles.usd}>
                  {calculateTotal(order.products, 'USD').toLocaleString(
                    'ru-RU'
                  )}{' '}
                  $
                </span>
                <span className={styles.uah}>
                  {calculateTotal(order.products, 'UAH').toLocaleString(
                    'ru-RU'
                  )}{' '}
                  UAH
                </span>
              </div>

              <button
                className={styles.deleteBtn}
                onClick={() => dispatch(selectOrder(order.id))}
              >
                🗑
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <OrderDeleteModal />
    </div>
  )
}
