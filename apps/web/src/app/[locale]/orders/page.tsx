import { GET_ORDERS } from '@/entities/order/api/orders.queries'
import { GetOrdersData } from '@/entities/order/model/types'
import OrdersPageClient from '@/entities/order/ui/orders/orders-page-client'
import { getClientAction } from '@/shared/api/actions'
import { DEFAULT_ITEMS_LIMIT } from '@/shared/consts/consts'
import { getPaginationParams } from '@/shared/lib/pagination/get-pagination-params'
import { EmptyState } from '@/shared/ui/empty-state/empty-state'

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function OrdersPage({ searchParams }: Props) {
  const { page } = await searchParams
  const { limit, offset } = getPaginationParams(page, DEFAULT_ITEMS_LIMIT)

  const { data, error } = await getClientAction<GetOrdersData>(GET_ORDERS, {
    variables: { limit, offset },
    cache: 'no-store',
  })

  if (error) throw error

  if (!data?.orders?.items.length) {
    return (
      <EmptyState
        title="Приходы не найдены"
        description="Список приходов пуст."
      />
    )
  }

  return (
    <OrdersPageClient
      initialOrders={data.orders.items}
      totalCount={data.orders.totalCount}
      pageSize={limit}
    />
  )
}
