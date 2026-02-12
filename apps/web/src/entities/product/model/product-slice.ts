import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { Product } from '@/entities/order/model/types'
import { ProductState } from './types'

const initialState: ProductState = {
  products: [],
  isLoading: false,
  error: null,
  selectedProductId: null,
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<Product[]>('/api/products')
      return data
    } catch (error) {
      return rejectWithValue('Ошибка загрузки продуктов')
    }
  }
)

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter((p) => p.id !== action.payload)
    },
    selectProduct: (state, action: PayloadAction<number | null>) => {
      state.selectedProductId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.isLoading = false
      })
  },
})

export const { deleteProduct, selectProduct } = productSlice.actions
export default productSlice.reducer
