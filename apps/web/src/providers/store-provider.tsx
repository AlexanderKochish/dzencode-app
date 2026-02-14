'use client'

import { useState } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '@/app/store'

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [store] = useState<AppStore>(() => makeStore())

  return <Provider store={store}>{children}</Provider>
}
