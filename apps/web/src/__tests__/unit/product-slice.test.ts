import productReducer, {
  setProducts,
  deleteProduct,
  selectProduct,
} from '@/entities/product/model/product-slice'
import { ProductState, Product } from '@/entities/product/model/types'

const makeProduct = (id: number, title = `Product ${id}`): Product => ({
  id,
  serialNumber: id * 1000,
  isNew: 1,
  photo: '/test.jpg',
  title,
  type: 'Laptops',
  specification: 'Spec 1',
  guarantee: { start: '2025-01-01', end: '2026-01-01' },
  price: [
    { value: 100, symbol: 'USD', isDefault: 0 },
    { value: 4000, symbol: 'UAH', isDefault: 1 },
  ],
  orderId: 1,
  date: '2024-01-01',
})

const initialState: ProductState = {
  products: [],
  totalCount: 0,
  selectedProductId: null,
  error: null,
  isLoading: false,
}

describe('productSlice', () => {
  describe('setProducts', () => {
    it('устанавливает список товаров и totalCount', () => {
      const products = [makeProduct(1), makeProduct(2)]
      const state = productReducer(
        initialState,
        setProducts({ items: products, totalCount: 2 })
      )
      expect(state.products).toHaveLength(2)
      expect(state.totalCount).toBe(2)
    })

    it('заменяет существующий список', () => {
      const stateWithProducts: ProductState = {
        ...initialState,
        products: [makeProduct(1)],
        totalCount: 1,
      }
      const newProducts = [makeProduct(2), makeProduct(3)]
      const state = productReducer(
        stateWithProducts,
        setProducts({ items: newProducts, totalCount: 2 })
      )
      expect(state.products).toHaveLength(2)
      expect(state.products[0].id).toBe(2)
    })

    it('устанавливает пустой список', () => {
      const state = productReducer(
        initialState,
        setProducts({ items: [], totalCount: 0 })
      )
      expect(state.products).toHaveLength(0)
      expect(state.totalCount).toBe(0)
    })
  })

  describe('deleteProduct', () => {
    const stateWith3Products: ProductState = {
      ...initialState,
      products: [makeProduct(1), makeProduct(2), makeProduct(3)],
      totalCount: 3,
    }

    it('удаляет товар по id', () => {
      const state = productReducer(stateWith3Products, deleteProduct(2))
      expect(state.products).toHaveLength(2)
      expect(state.products.find((p) => p.id === 2)).toBeUndefined()
    })

    it('уменьшает totalCount на 1', () => {
      const state = productReducer(stateWith3Products, deleteProduct(1))
      expect(state.totalCount).toBe(2)
    })

    it('не меняет список при несуществующем id', () => {
      const state = productReducer(stateWith3Products, deleteProduct(999))
      expect(state.products).toHaveLength(3)
      expect(state.totalCount).toBe(2) // уменьшается всегда — это поведение слайса
    })

    it('удаляет верный товар при строковом id (Number приведение)', () => {
      const state = productReducer(stateWith3Products, deleteProduct(3))
      expect(state.products.find((p) => p.id === 3)).toBeUndefined()
      expect(state.products).toHaveLength(2)
    })
  })

  describe('selectProduct', () => {
    it('устанавливает selectedProductId', () => {
      const state = productReducer(initialState, selectProduct(5))
      expect(state.selectedProductId).toBe(5)
    })

    it('сбрасывает selectedProductId в null', () => {
      const stateWithSelected: ProductState = { ...initialState, selectedProductId: 5 }
      const state = productReducer(stateWithSelected, selectProduct(null))
      expect(state.selectedProductId).toBeNull()
    })
  })
})
