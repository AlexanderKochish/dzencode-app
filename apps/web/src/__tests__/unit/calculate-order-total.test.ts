import { calculateTotal } from '@/entities/order/lib/calculate-order-total'
import { Product } from '@/entities/product/model/types'

const makeProduct = (usd: number, uah: number): Product => ({
  id: 1,
  serialNumber: 12345,
  isNew: 1,
  photo: '/test.jpg',
  title: 'Test Product',
  type: 'Laptops',
  specification: 'Spec 1',
  guarantee: { start: '2025-01-01', end: '2026-01-01' },
  price: [
    { value: usd, symbol: 'USD', isDefault: 0 },
    { value: uah, symbol: 'UAH', isDefault: 1 },
  ],
  orderId: 1,
  date: '2024-01-01',
})

describe('calculateTotal', () => {
  describe('базовые случаи', () => {
    it('возвращает 0 для undefined', () => {
      expect(calculateTotal(undefined, 'USD')).toBe(0)
    })

    it('возвращает 0 для пустого массива', () => {
      expect(calculateTotal([], 'USD')).toBe(0)
    })

    it('считает сумму USD одного товара', () => {
      const products = [makeProduct(100, 4000)]
      expect(calculateTotal(products, 'USD')).toBe(100)
    })

    it('считает сумму UAH одного товара', () => {
      const products = [makeProduct(100, 4000)]
      expect(calculateTotal(products, 'UAH')).toBe(4000)
    })
  })

  describe('несколько товаров', () => {
    it('суммирует USD нескольких товаров', () => {
      const products = [makeProduct(100, 4000), makeProduct(200, 8000), makeProduct(50, 2000)]
      expect(calculateTotal(products, 'USD')).toBe(350)
    })

    it('суммирует UAH нескольких товаров', () => {
      const products = [makeProduct(100, 4000), makeProduct(200, 8000)]
      expect(calculateTotal(products, 'UAH')).toBe(12000)
    })
  })

  describe('edge cases', () => {
    it('возвращает 0 если у товара нет нужной валюты', () => {
      const product: Product = {
        ...makeProduct(100, 4000),
        price: [{ value: 100, symbol: 'USD', isDefault: 1 }],
      }
      expect(calculateTotal([product], 'UAH')).toBe(0)
    })

    it('обрабатывает товар без поля price', () => {
      const product: Product = {
        ...makeProduct(100, 4000),
        price: [],
      }
      expect(calculateTotal([product], 'USD')).toBe(0)
    })

    it('корректно конвертирует строковое значение цены через Number()', () => {
      const product: Product = {
        ...makeProduct(100, 4000),
        price: [{ value: '99.5' as unknown as number, symbol: 'USD', isDefault: 1 }],
      }
      expect(calculateTotal([product], 'USD')).toBe(99.5)
    })
  })
})
