import { GET_ORDERS } from '@/entities/order/api/orders.queries'
import { GetOrdersData } from '@/entities/order/model/types'
import OrdersPageClient from '@/entities/order/ui/orders/orders-page-client'
import { getClientAction } from '@/shared/api/actions'
import { EmptyState } from '@/shared/ui/empty-state/empty-state'

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function OrdersPage({ searchParams }: Props) {
  const { page } = await searchParams
  const currentPage = Number(page) || 1
  const limit = 20
  const offset = (currentPage - 1) * limit

  const { data, error } = await getClientAction<GetOrdersData>(GET_ORDERS, {
    variables: {
      limit,
      offset,
    },
    cache: 'no-store',
  })

  if (error) {
    throw error
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
