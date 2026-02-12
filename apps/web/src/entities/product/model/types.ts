import { Product } from '@/entities/order/model/types'

export interface ProductState {
  products: Product[]
  isLoading: boolean
  error: string | null
  selectedProductId: number | null
}
