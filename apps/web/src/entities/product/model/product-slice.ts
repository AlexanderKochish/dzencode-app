import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Product, ProductState } from './types'

const initialState: ProductState = {
  products: [],
  isLoading: false,
  error: null,
  selectedProductId: null,
}

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload
      state.isLoading = false
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter((p) => p.id !== action.payload)
    },
    selectProduct: (state, action: PayloadAction<number | null>) => {
      state.selectedProductId = action.payload
    },
  },
})

export const { setProducts, deleteProduct, selectProduct } =
  productSlice.actions
export default productSlice.reducer
