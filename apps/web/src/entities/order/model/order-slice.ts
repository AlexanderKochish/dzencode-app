import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Order, OrderSchema } from './types'

const initialState: OrderSchema = {
  list: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  selectedOrderId: null,
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders: (
      state,
      action: PayloadAction<{ items: Order[]; totalCount: number }>
    ) => {
      state.list = action.payload.items
      state.totalCount = action.payload.totalCount
      state.isLoading = false
    },
    deleteOrder: (state, action: PayloadAction<number>) => {
      const index = state.list.findIndex((order) => order.id === action.payload)
      if (index !== -1) {
        state.list.splice(index, 1)
        state.totalCount -= 1
      }

      if (state.selectedOrderId === action.payload) {
        state.selectedOrderId = null
      }
    },
    selectOrder: (state, action: PayloadAction<number | null>) => {
      state.selectedOrderId = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { setOrders, deleteOrder, selectOrder, setLoading } =
  orderSlice.actions
export default orderSlice.reducer
