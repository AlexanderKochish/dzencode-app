'use client'

import { useActiveTabs } from '@/shared/hooks/use-active-tabs'
import styles from './active-tabs-counter.module.scss'

export const ActiveTabsCounter = () => {
  const count = useActiveTabs()

  return (
    <div className={styles.counter} title="Активных вкладок">
      <span className={styles.dot} />
      <span className={styles.count}>{count}</span>
    </div>
  )
}
