'use client'

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/store'
import { fetchOrders, deleteOrder } from '@/entities/order/model/order-slice'
import { Product } from '@/entities/order/model/types'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './orders.module.scss'
import {
  formatDateForOrder,
  formatDateShort,
} from '@/shared/lib/date/format-date'

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { list: orders, isLoading } = useSelector(
    (state: RootState) => state.order
  )

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  const calculateTotal = (
    products: Product[],
    symbol: 'USD' | 'UAH'
  ): number => {
    return products.reduce((acc, product) => {
      const priceObj = product.price.find((p) => p.symbol === symbol)

      return acc + (priceObj ? Number(priceObj.value) : 0)
    }, 0)
  }

  if (isLoading)
    return <div className="p-5 text-center">Загрузка приходов...</div>

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
                onClick={() => dispatch(deleteOrder(order.id))}
              >
                🗑
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
