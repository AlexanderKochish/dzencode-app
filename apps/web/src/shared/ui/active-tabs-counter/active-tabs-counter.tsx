'use client'

import { useActiveTabs } from '@/shared/hooks/use-active-tabs'
import styles from './active-tabs-counter.module.scss'

export const ActiveTabsCounter = () => {
  const count = useActiveTabs()

  return (
    <div className={styles.counter}>
      <span>
        Активных вкладок сейчас: <strong>{count}</strong>
      </span>
    </div>
  )
}
