import { Product } from '@/entities/product/model/types'

export interface Price {
  value: number
  symbol: 'USD' | 'UAH'
  isDefault: number
}

export interface Guarantee {
  start: string
  end: string
}

export interface OrderTotal {
  value: number
  symbol: string
}

export interface Order {
  id: number
  title: string
  date: string
  description?: string
  products: Product[]
  total: OrderTotal[]
}

export interface OrderSchema {
  list: Order[]
  isLoading: boolean
  error: string | null
  selectedOrderId: number | null
}

export interface GetOrdersData {
  orders: Order[]
}
