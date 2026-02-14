import { GET_ORDERS } from '@/entities/order/api/orders.queries'
import { GetOrdersData } from '@/entities/order/model/types'
import OrdersPageClient from '@/entities/order/ui/orders/orders-page-client'
import { getClient } from '@/shared/lib/apollo-client'
import { EmptyState } from '@/shared/ui/empty-state/empty-state'

export default async function OrdersPage() {
  const { data, error } = await getClient().query<GetOrdersData>({
    query: GET_ORDERS,
    context: { fetchOptions: { cache: 'no-store' } },
    errorPolicy: 'all',
  })

  if (error) {
    throw error
  }

  if (!data || !data.orders) {
    return (
      <EmptyState
        title="Приходы не найдены"
        description="Список приходов пуст. Добавьте первый приход, чтобы увидеть его здесь."
      />
    )
  }

  return <OrdersPageClient initialOrders={data.orders} />
}
