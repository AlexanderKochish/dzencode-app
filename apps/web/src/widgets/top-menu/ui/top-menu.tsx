'use client'

import styles from './top-menu.module.scss'
import { CurrentTime } from './current-time'
import { ActiveTabsCounter } from '@/shared/ui/active-tabs-counter/active-tabs-counter'
import { PushButton } from '@/shared/ui/push-button/push-button'
import { useTranslations } from '@/shared/i18n/i18n-context'

export const TopMenu = () => {
  const t = useTranslations('common')
  return (
    <header className={styles.topMenu}>
      <div className={styles.logoBlock}>
        <div className={styles.logoIcon}>🛡️</div>
        <span className={styles.logoText}>INVENTORY</span>
      </div>

      <div className={styles.searchBlock}>
        <input type="text" placeholder={t('search')} className="form-control" />
      </div>

      <div className={styles.infoBlock}>
        <PushButton />
        <CurrentTime />
        <ActiveTabsCounter />
      </div>
    </header>
  )
}
