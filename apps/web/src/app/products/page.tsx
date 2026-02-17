import { GET_PRODUCTS } from '@/entities/product/api/product.queries'
import ProductsPageClient from '@/entities/product/ui/products/products-page-client'
import { EmptyState } from '@/shared/ui/empty-state/empty-state'
import { GetProductsData } from '@/entities/product/model/types'
import { getClientAction } from '@/shared/api/actions'

interface Props {
  searchParams: Promise<{ page?: string; type?: string; spec?: string }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const { page, type, spec } = await searchParams
  const currentPage = Number(page) || 1
  const limit = 20
  const offset = (currentPage - 1) * limit

  const { data, error } = await getClientAction<GetProductsData>(GET_PRODUCTS, {
    variables: { limit, offset, type, spec },
    cache: 'no-store',
  })

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16 }}>
        <meta httpEquiv="refresh" content="3" />
        <div className="spinner-border text-secondary" role="status" />
        <p style={{ color: '#888', margin: 0 }}>Подключение к серверу...</p>
      </div>
    )
  }

  if (!data?.products?.items.length) {
    return (
      <EmptyState
        title="Товары не найдены"
        description="Список товаров пуст или не соответствует фильтрам."
      />
    )
  }

  return (
    <ProductsPageClient
      initialProducts={data.products.items}
      totalCount={data.products.totalCount}
      allTypes={data.productTypes}
      allSpecs={data.productSpecs ?? []}
      pageSize={limit}
    />
  )
}
