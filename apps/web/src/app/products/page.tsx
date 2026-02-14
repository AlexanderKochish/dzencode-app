import { getClient } from '@/shared/lib/apollo-client'
import { GET_PRODUCTS } from '@/entities/product/api/product.queries'
import ProductsPageClient from '@/entities/product/ui/products/products-page-client'
import { EmptyState } from '@/shared/ui/empty-state/empty-state'
import { GetProductsData } from '@/entities/product/model/types'

export default async function ProductsPage() {
  const { data, error } = await getClient().query<GetProductsData>({
    query: GET_PRODUCTS,
    context: { fetchOptions: { cache: 'no-store' } },
    errorPolicy: 'all',
  })

  if (error) {
    throw error
  }

  if (!data || !data.products) {
    return (
      <EmptyState
        title="Товары не найдены"
        description="Список товаров пуст. Добавьте первый товар, чтобы увидеть его здесь."
      />
    )
  }

  return <ProductsPageClient initialProducts={data.products} />
}
