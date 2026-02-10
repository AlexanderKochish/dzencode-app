import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { Order, OrderSchema } from './types'

const initialState: OrderSchema = {
  list: [],
  isLoading: false,
  error: null,
  selectedOrderId: null,
}

export const fetchOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>('order/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<Order[]>('/api/orders')
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка сервера при загрузке заказов'
      )
    } else if (error instanceof Error) {
      return rejectWithValue(error.message)
    }

    return rejectWithValue('Неизвестная ошибка')
  }
})

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    deleteOrder: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter((order) => order.id !== action.payload)
      if (state.selectedOrderId === action.payload) {
        state.selectedOrderId = null
      }
    },

    selectOrder: (state, action: PayloadAction<number | null>) => {
      state.selectedOrderId = action.payload
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false
        state.list = action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Произошла ошибка'
      })
  },
})

export const { deleteOrder, selectOrder } = orderSlice.actions

export default orderSlice.reducer
