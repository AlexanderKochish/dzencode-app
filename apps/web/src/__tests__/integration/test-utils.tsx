import React from 'react'
import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import orderReducer from '@/entities/order/model/order-slice'
import productReducer from '@/entities/product/model/product-slice'
import { OrderSchema } from '@/entities/order/model/types'
import { ProductState } from '@/entities/product/model/types'

interface PreloadedState {
  order?: Partial<OrderSchema>
  products?: Partial<ProductState>
}

interface RenderWithStoreResult extends RenderResult {
  store: EnhancedStore
}

export function renderWithStore(
  ui: React.ReactElement,
  preloadedState: PreloadedState = {},
  renderOptions?: Omit<RenderOptions, 'wrapper'>
): RenderWithStoreResult {
  const store = configureStore({
    reducer: {
      order: orderReducer,
      products: productReducer,
    },
    preloadedState: {
      order: {
        list: [],
        totalCount: 0,
        isLoading: false,
        error: null,
        selectedOrderId: null,
        ...preloadedState.order,
      },
      products: {
        products: [],
        totalCount: 0,
        isLoading: false,
        error: null,
        selectedProductId: null,
        ...preloadedState.products,
      },
    },
  })

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}
