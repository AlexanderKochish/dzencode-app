import { GET_PRODUCTS } from '@/entities/product/api/product.queries'
import ProductsPageClient from '@/entities/product/ui/products/products-page-client'
import { EmptyState } from '@/shared/ui/empty-state/empty-state'
import { GetProductsData } from '@/entities/product/model/types'
import { getClientAction } from '@/shared/api/actions'

interface Props {
  searchParams: Promise<{ page?: string; type?: string }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const { page, type } = await searchParams
  const currentPage = Number(page) || 1
  const limit = 20
  const offset = (currentPage - 1) * limit

  const { data, error } = await getClientAction<GetProductsData>(GET_PRODUCTS, {
    variables: {
      limit,
      offset,
      type,
    },
    cache: 'no-store',
  })

  if (error) {
    throw error
  }

  if (!data?.products?.items.length) {
    return (
      <EmptyState
        title="Товары не найдены"
        description="Список товаров пуст. Добавьте первый товар, чтобы увидеть его здесь."
      />
    )
  }

  return (
    <ProductsPageClient
      initialProducts={data.products.items}
      totalCount={data.products.totalCount}
      allTypes={data.productTypes}
      pageSize={limit}
    />
  )
}
