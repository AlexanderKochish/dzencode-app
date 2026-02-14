import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Order, OrderSchema } from './types'

const initialState: OrderSchema = {
  list: [],
  isLoading: false,
  error: null,
  selectedOrderId: null,
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.list = action.payload
      state.isLoading = false
    },
    deleteOrder: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter((order) => order.id !== action.payload)
      if (state.selectedOrderId === action.payload) state.selectedOrderId = null
    },
    selectOrder: (state, action: PayloadAction<number | null>) => {
      state.selectedOrderId = action.payload
    },
  },
})

export const { setOrders, deleteOrder, selectOrder } = orderSlice.actions
export default orderSlice.reducer
