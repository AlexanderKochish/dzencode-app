import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Product, ProductState } from './types'

const initialState: ProductState = {
  products: [],
  totalCount: 0,
  selectedProductId: null,
  error: null,
  isLoading: false,
}
export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (
      state,
      action: PayloadAction<{ items: Product[]; totalCount: number }>
    ) => {
      state.products = action.payload.items
      state.totalCount = action.payload.totalCount
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter(
        (p) => Number(p.id) !== Number(action.payload)
      )
      state.totalCount -= 1
    },
    selectProduct: (state, action: PayloadAction<number | null>) => {
      state.selectedProductId = action.payload
    },
  },
})

export const { setProducts, deleteProduct, selectProduct } =
  productSlice.actions
export default productSlice.reducer
