import orderReducer, {
  setOrders,
  deleteOrder,
  selectOrder,
  setLoading,
} from '@/entities/order/model/order-slice'
import { OrderSchema, Order } from '@/entities/order/model/types'

const makeOrder = (id: number): Order => ({
  id,
  title: `Order ${id}`,
  date: '2024-01-01',
  description: `Description ${id}`,
  products: [],
  total: [
    { value: 500, symbol: 'USD' },
    { value: 20000, symbol: 'UAH' },
  ],
})

const initialState: OrderSchema = {
  list: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  selectedOrderId: null,
}

describe('orderSlice', () => {
  describe('setOrders', () => {
    it('устанавливает список заказов', () => {
      const orders = [makeOrder(1), makeOrder(2)]
      const state = orderReducer(
        initialState,
        setOrders({ items: orders, totalCount: 2 })
      )
      expect(state.list).toHaveLength(2)
      expect(state.totalCount).toBe(2)
    })

    it('выключает isLoading после получения данных', () => {
      const state = orderReducer(
        { ...initialState, isLoading: true },
        setOrders({ items: [], totalCount: 0 })
      )
      expect(state.isLoading).toBe(false)
    })
  })

  describe('deleteOrder', () => {
    const stateWith3Orders: OrderSchema = {
      ...initialState,
      list: [makeOrder(1), makeOrder(2), makeOrder(3)],
      totalCount: 3,
    }

    it('удаляет заказ по id', () => {
      const state = orderReducer(stateWith3Orders, deleteOrder(2))
      expect(state.list).toHaveLength(2)
      expect(state.list.find((o) => o.id === 2)).toBeUndefined()
    })

    it('уменьшает totalCount на 1', () => {
      const state = orderReducer(stateWith3Orders, deleteOrder(1))
      expect(state.totalCount).toBe(2)
    })

    it('не меняет список при несуществующем id', () => {
      const state = orderReducer(stateWith3Orders, deleteOrder(999))
      expect(state.list).toHaveLength(3)
    })

    it('сбрасывает selectedOrderId если удалён выбранный заказ', () => {
      const stateWithSelected: OrderSchema = {
        ...stateWith3Orders,
        selectedOrderId: 2,
      }
      const state = orderReducer(stateWithSelected, deleteOrder(2))
      expect(state.selectedOrderId).toBeNull()
    })

    it('не сбрасывает selectedOrderId если удалён другой заказ', () => {
      const stateWithSelected: OrderSchema = {
        ...stateWith3Orders,
        selectedOrderId: 1,
      }
      const state = orderReducer(stateWithSelected, deleteOrder(3))
      expect(state.selectedOrderId).toBe(1)
    })
  })

  describe('selectOrder', () => {
    it('устанавливает selectedOrderId', () => {
      const state = orderReducer(initialState, selectOrder(7))
      expect(state.selectedOrderId).toBe(7)
    })

    it('сбрасывает selectedOrderId в null', () => {
      const stateWithSelected: OrderSchema = { ...initialState, selectedOrderId: 7 }
      const state = orderReducer(stateWithSelected, selectOrder(null))
      expect(state.selectedOrderId).toBeNull()
    })
  })

  describe('setLoading', () => {
    it('устанавливает isLoading в true', () => {
      const state = orderReducer(initialState, setLoading(true))
      expect(state.isLoading).toBe(true)
    })

    it('устанавливает isLoading в false', () => {
      const stateLoading: OrderSchema = { ...initialState, isLoading: true }
      const state = orderReducer(stateLoading, setLoading(false))
      expect(state.isLoading).toBe(false)
    })
  })
})
