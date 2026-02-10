import { Product } from '../model/types'

export const calculateTotal = (
  products: Product[],
  symbol: 'USD' | 'UAH'
): number => {
  return products.reduce((acc, product) => {
    const priceObj = product.price.find((p) => p.symbol === symbol)

    return acc + (priceObj ? Number(priceObj.value) : 0)
  }, 0)
}
