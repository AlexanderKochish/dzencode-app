'use client'

import styles from './products.module.scss'
import { useAppDispatch } from '@/app/store'
import Image from 'next/image'
import { formatDateShort } from '@/shared/lib/date/format-date'
import { selectProduct, setProducts } from '../../model/product-slice'
import { Product } from '../../model/types'
import { ProductDeleteModal } from '../product-delete-modal/product-delete-modal'
import { Pagination } from '@/shared/ui/pagination/pagination'
import { useUpdateSearchParams } from '@/shared/hooks/use-update-search-params'
import { useProductSocket } from '../../hooks/use-product-socket'
import { useEffect } from 'react'
import { useTranslations } from '@/shared/i18n/i18n-context'
import { TruncatedText } from '@/shared/ui/truncated-text/truncated-text'

interface Props {
  initialProducts: Product[]
  totalCount: number
  pageSize: number
  allTypes: string[]
  allSpecs: string[]
}

const ProductsPageClient = ({ initialProducts, pageSize, totalCount, allTypes, allSpecs }: Props) => {
  useProductSocket()
  const dispatch = useAppDispatch()
  const t = useTranslations('products')
  const { updateQuery, searchParams } = useUpdateSearchParams()

  const currentType = searchParams.get('type') || ''
  const currentSpec = searchParams.get('spec') || ''

  useEffect(() => {
    dispatch(setProducts({ items: initialProducts, totalCount }))
  }, [dispatch, initialProducts, totalCount])

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>{t('title')} / {totalCount}</h1>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>{t('type_filter')}</span>
            <select
              className={styles.filterSelect}
              value={currentType}
              onChange={(e) => updateQuery({ type: e.target.value || null, spec: currentSpec || null })}
            >
              <option value="">{t('all')}</option>
              {allTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>{t('spec_filter')}</span>
            <select
              className={styles.filterSelect}
              value={currentSpec}
              onChange={(e) => updateQuery({ spec: e.target.value || null, type: currentType || null })}
            >
              <option value="">{t('all')}</option>
              {allSpecs.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <div className={styles.list}>
          {initialProducts.map((product) => (
            <div key={product.id} className={styles.row}>
              <div className={styles.statusDot}>
                <span className={`${styles.dot} ${product.isNew ? styles.dotGreen : styles.dotGray}`} />
              </div>

              <div className={styles.photo}>
                <Image
                  src={product.photo || '/monitor.jpg'}
                  alt={product.title}
                  width={44}
                  height={44}
                  style={{ objectFit: 'contain' }}
                />
              </div>

              <div className={styles.nameInfo}>
                <TruncatedText text={product.title} maxLength={30} className={styles.productTitle} />
                <span className={styles.sn}>SN-{product.serialNumber}</span>
              </div>

              <div className={`${styles.statusText} ${product.isNew ? styles.statusFree : styles.statusBusy}`}>
                {product.isNew ? t('free') : t('in_repair')}
              </div>

              <div className={styles.guarantee}>
                <span>{t('guarantee_from')} {formatDateShort(product.guarantee.start)}</span>
                <span>{t('guarantee_to')} {formatDateShort(product.guarantee.end)}</span>
              </div>

              <div className={styles.condition}>
                {product.isNew ? t('new') : t('used')}
              </div>

              <div className={styles.price}>
                {product.price.map((p) => (
                  <div key={p.symbol} className={p.symbol === 'USD' ? styles.priceUsd : styles.priceUah}>
                    {p.value.toLocaleString('ru-RU')} {p.symbol === 'USD' ? '$' : 'UAH'}
                  </div>
                ))}
              </div>

              <div className={styles.groupName}>
                <TruncatedText text="Длинное предлинное название группы" maxLength={20} />
              </div>

              <div className={styles.orderName}>
                <TruncatedText text={product.order?.title ?? '—'} maxLength={25} />
              </div>

              <div className={styles.date}>{formatDateShort(product.date)}</div>

              <button
                className={styles.deleteBtn}
                onClick={() => dispatch(selectProduct(product.id))}
                aria-label={t('delete_btn')}
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      </div>

      <Pagination totalCount={totalCount} pageSize={pageSize} />
      <ProductDeleteModal />
    </div>
  )
}

export default ProductsPageClient
