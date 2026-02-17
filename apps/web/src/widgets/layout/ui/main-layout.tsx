import { ReactNode } from 'react'
import styles from './main-layout.module.scss'
import { TopMenu } from '@/widgets/top-menu/ui/top-menu'
import { Navigation } from '@/widgets/navigation/ui/navigation'
import { Locale } from '@/shared/i18n/config'

interface Props {
  children: ReactNode
  locale: Locale
}

export const MainLayout = ({ children, locale }: Props) => {
  return (
    <div className="main-layout">
      <TopMenu />
      <Navigation locale={locale} />
      <main className={styles.main}>{children}</main>
    </div>
  )
}
