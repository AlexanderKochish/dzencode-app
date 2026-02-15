'use client'

import { useAppDispatch } from '@/app/store'
import { selectOrder } from '@/entities/order/model/order-slice'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './orders.module.scss'
import {
  formatDateForOrder,
  formatDateShort,
} from '@/shared/lib/date/format-date'
import { Order } from '@/entities/order/model/types'
import { calculateTotal } from '@/entities/order/lib/calculate-order-total'
import { OrderDeleteModal } from '@/widgets/order-delete-modal/ui/order-delete-modal'
import { Pagination } from '@/shared/ui/pagination/pagination'

interface Props {
  initialOrders: Order[]
  totalCount: number
  pageSize: number
}

export default function OrdersPageClient({
  initialOrders,
  totalCount,
  pageSize,
}: Props) {
  const dispatch = useAppDispatch()

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <button className={styles.plusBtn}>+</button>
        <h1>Приходы / {initialOrders.length}</h1>
      </div>

      <div className={styles.ordersList}>
        <AnimatePresence>
          {initialOrders.map((order) => (
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
      <Pagination totalCount={totalCount} pageSize={pageSize} />
      <OrderDeleteModal />
    </div>
  )
}
