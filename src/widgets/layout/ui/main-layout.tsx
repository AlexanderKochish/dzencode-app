import React, { ReactNode } from 'react'

import styles from './main-layout.module.scss'
import { TopMenu } from '@/widgets/top-menu/ui/top-menu'
import { Navigation } from '@/widgets/navigation/ui/navigation'

export const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="main-layout">
      <TopMenu />
      <Navigation />
      <main style={{ marginLeft: '250px', marginTop: '80px', padding: '30px' }}>
        {children}
      </main>
    </div>
  )
}
