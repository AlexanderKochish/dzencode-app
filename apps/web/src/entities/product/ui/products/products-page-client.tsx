'use client'
import styles from './products.module.scss'
import { useAppDispatch } from '@/app/store'
import Image from 'next/image'
import { formatDateShort } from '@/shared/lib/date/format-date'
import { selectProduct } from '../../model/product-slice'
import { Product } from '../../model/types'
import { ProductDeleteModal } from '../product-delete-modal/product-delete-modal'
import { Pagination } from '@/shared/ui/pagination/pagination'
import { useUpdateSearchParams } from '@/shared/hooks/use-update-search-params'
import { useProductSocket } from '../../hooks/use-product-socket'

interface Props {
  initialProducts: Product[]
  totalCount: number
  pageSize: number
  allTypes: string[]
}

const ProductsPageClient = ({
  initialProducts,
  pageSize,
  totalCount,
  allTypes,
}: Props) => {
  useProductSocket()
  const dispatch = useAppDispatch()
  const { updateQuery, searchParams } = useUpdateSearchParams()

  const currentType = searchParams.get('type') || ''

  const handleTypeChange = (newType: string) => {
    updateQuery({ type: newType })
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Продукты / {totalCount}</h1>

        <div className={styles.filters}>
          <label>
            Тип:
            <select
              value={currentType}
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              <option value="">Все</option>
              {allTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          {/* <label>
            Спецификация:
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Все</option>
              <option value="Specification 1">Specification 1</option>
              <option value="Specification 2">Specification 2</option>
            </select>
          </label> */}
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <div className={styles.list}>
          {initialProducts.map((product) => (
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

      <Pagination totalCount={totalCount} pageSize={pageSize} />
      <ProductDeleteModal />
    </div>
  )
}

export default ProductsPageClient
