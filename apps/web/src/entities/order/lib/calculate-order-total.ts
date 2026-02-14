import { Product } from "@/entities/product/model/types"


export const calculateTotal = (
  products: Product[] | undefined,
  symbol: 'USD' | 'UAH'
): number => {
  if (!products) return 0

  return products.reduce((acc, product) => {
    const priceObj = product.price?.find((p) => p.symbol === symbol)

    const value = priceObj ? Number(priceObj.value) : 0
    return acc + value
  }, 0)
}
