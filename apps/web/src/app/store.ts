import { configureStore } from '@reduxjs/toolkit'
import orderReducer from '@/entities/order/model/order-slice'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import productSlice from '@/entities/product/model/product-slice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      order: orderReducer,
      products: productSlice,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
