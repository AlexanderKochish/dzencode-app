import { Guarantee, Price } from '@/entities/order/model/types'

export interface Product {
  id: number
  serialNumber: number
  isNew: number
  photo: string
  title: string
  type: string
  specification: string
  guarantee: Guarantee
  price: Price[]
  orderId: number
  date: string
}

export interface ProductState {
  products: Product[]
  isLoading: boolean
  error: string | null
  selectedProductId: number | null
}

export interface GetProductsData {
  products: Product[]
}
