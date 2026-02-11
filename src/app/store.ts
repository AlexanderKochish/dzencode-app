import { configureStore } from '@reduxjs/toolkit'
import orderReducer from '@/entities/order/model/order-slice'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import productSlice from '@/entities/product/model/product-slice'

export const store = configureStore({
  reducer: {
    order: orderReducer,
    products: productSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
