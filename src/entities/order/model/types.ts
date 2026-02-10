export interface Price {
  value: number
  symbol: 'USD' | 'UAH'
  isDefault: number
}

export interface Guarantee {
  start: string
  end: string
}

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

export interface Order {
  id: number
  title: string
  date: string
  description: string
  products: Product[]
}

export interface OrderSchema {
  list: Order[]
  isLoading: boolean
  error: string | null
  selectedOrderId: number | null
}
