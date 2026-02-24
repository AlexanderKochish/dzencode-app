import { GET_PRODUCTS } from '@/entities/product/api/product.queries'
import ProductsPageClient from '@/entities/product/ui/products/products-page-client'
import { GetProductsData } from '@/entities/product/model/types'
import { getClientAction } from '@/shared/api/actions'
import { DEFAULT_ITEMS_LIMIT } from '@/shared/consts/consts'
import { getPaginationParams } from '@/shared/lib/pagination/get-pagination-params'

interface Props {
  searchParams: Promise<{ page?: string; type?: string; spec?: string }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const { page, type, spec } = await searchParams
  const { limit, offset } = getPaginationParams(page, DEFAULT_ITEMS_LIMIT)

  const { data, error } = await getClientAction<GetProductsData>(GET_PRODUCTS, {
    variables: { limit, offset, type, spec },
    cache: 'no-store',
  })

  if (error) {
    throw new Error('Failed to fetch products')
  }

  return (
    <ProductsPageClient
      initialProducts={data?.products.items ?? []}
      totalCount={data?.products.totalCount ?? 0}
      allTypes={data?.productTypes ?? []}
      allSpecs={data?.productSpecs ?? []}
      pageSize={limit}
    />
  )
}
