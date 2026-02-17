import { GET_ORDERS } from '@/entities/order/api/orders.queries'
import { GetOrdersData } from '@/entities/order/model/types'
import OrdersPageClient from '@/entities/order/ui/orders/orders-page-client'
import { getClientAction } from '@/shared/api/actions'
import { getPaginationParams } from '@/shared/lib/pagination/get-pagination-params'
import { EmptyState } from '@/shared/ui/empty-state/empty-state'
import { Loader } from '@/shared/ui/loader/loader'

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function OrdersPage({ searchParams }: Props) {
  const { page } = await searchParams

  const { limit, offset } = getPaginationParams(page)

  const { data, error } = await getClientAction<GetOrdersData>(GET_ORDERS, {
    variables: {
      limit,
      offset,
    },
    cache: 'no-store',
  })

  if (error) {
    return <Loader text="Подключение к серверу..." autoRefreshInterval={3} />
  }

  if (!data?.orders?.items.length) {
    return (
      <EmptyState
        title="Приходы не найдены"
        description="Список приходов пуст. Добавьте первый приход, чтобы увидеть его здесь."
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
