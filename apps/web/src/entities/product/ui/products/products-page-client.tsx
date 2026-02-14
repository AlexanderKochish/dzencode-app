'use client'
import React, { useEffect, useMemo, useState } from 'react'
import styles from './products.module.scss'
import { useAppDispatch, useAppSelector } from '@/app/store'
import Image from 'next/image'
import { formatDateShort } from '@/shared/lib/date/format-date'
import {
  deleteProduct,
  selectProduct,
  setProducts,
} from '../../model/product-slice'
import { Product } from '../../model/types'
import { ProductDeleteModal } from '../product-delete-modal/product-delete-modal'
import { useSocket } from '@/shared/hooks/use-socket'

const ProductsPageClient = ({
  initialProducts,
}: {
  initialProducts: Product[]
}) => {
  const dispatch = useAppDispatch()
  const { products, isLoading } = useAppSelector((state) => state.products)
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return

    const handleDelete = ({ id }: { id: number }) => {
      dispatch(deleteProduct(id))
    }

    socket.on('productDeleted', handleDelete)

    return () => {
      socket.off('productDeleted')
    }
  }, [socket, dispatch])

  const [filterType, setFilterType] = useState('')
  const [filterSpec, setFilterSpec] = useState('')

  const productTypes = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.type))).filter(Boolean)
  }, [products])

  const filteredProducts = products.filter((product) => {
    if (filterType && product.type !== filterType) return false
    if (filterSpec && product.specification !== filterSpec) return false
    return true
  })

  useEffect(() => {
    dispatch(setProducts(initialProducts))
  }, [dispatch, initialProducts])

  if (isLoading) return <div>Загрузка...</div>

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Продукты / {filteredProducts.length}</h1>

        <div className={styles.filters}>
          <label>
            Тип:
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Все</option>
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label>
            Спецификация:
            <select
              value={filterSpec}
              onChange={(e) => setFilterSpec(e.target.value)}
            >
              <option value="">Все</option>
              <option value="Specification 1">Specification 1</option>
              <option value="Specification 2">Specification 2</option>
            </select>
          </label>
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <div className={styles.list}>
          {filteredProducts.map((product) => (
            <div key={product.id} className={styles.row}>
              <div className={styles.status}>
                <div
                  className={`${styles.dot} ${product.isNew ? styles.green : styles.black}`}
                >
                  •
                </div>
              </div>

              <div className={styles.photo}>
                <Image
                  src={product.photo || '/monitor.jpg'}
                  alt={product.title}
                  width={50}
                  height={50}
                />
              </div>

              <div className={styles.nameInfo}>
                <div className={styles.title}>{product.title}</div>
                <div className={styles.sn}>{product.serialNumber}</div>
              </div>

              <div className={styles.statusText}>
                {product.isNew ? 'Свободен' : 'В ремонте'}
              </div>

              <div className={styles.dates}>
                <div>с {formatDateShort(product.guarantee.start)}</div>
                <div>по {formatDateShort(product.guarantee.end)}</div>
              </div>

              <div className={styles.condition}>
                {product.isNew ? 'Новый' : 'Б / У'}
              </div>

              <div className={styles.price}>
                {product.price.map((p) => (
                  <div key={p.symbol} className={styles.priceRow}>
                    {p.value} {p.symbol}
                  </div>
                ))}
              </div>

              <div className={styles.groupName}>Длинное название группы</div>

              <div className={styles.orderName}>Длинное название прихода</div>

              <div className={styles.date}>{formatDateShort(product.date)}</div>

              <button
                className={styles.deleteBtn}
                onClick={() => dispatch(selectProduct(product.id))}
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      </div>
      <ProductDeleteModal />
    </div>
  )
}

export default ProductsPageClient
