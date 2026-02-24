'use client'

import { usePushNotifications } from '@/shared/hooks/use-push-notifications'
import styles from './push-button.module.scss'
import { useTranslations } from '@/shared/i18n/i18n-context'
import { BellIcon } from '@/shared/ui/icons/bell-icon'
import { BellOffIcon } from '@/shared/ui/icons/bell-off-icon'
import { HourglassIcon } from '../icons/hourglass-icon'

export const PushButton = () => {
  const t = useTranslations('common')
  const { state, subscribe, unsubscribe } = usePushNotifications()

  if (state === 'unsupported' || state === 'loading') return null

  if (state === 'processing') {
    return (
      <button className={styles.pushButton} disabled>
        <span className={styles.icon}>
          <HourglassIcon />
        </span>
        <span>{t('loading')}</span>
      </button>
    )
  }

  if (state === 'denied') {
    return (
      <button
        className={styles.pushButton}
        disabled
        title={t('push_blocked_tooltip')}
      >
        <span className={styles.icon}>
          <BellOffIcon />
        </span>
        <span>{t('push_blocked_label')}</span>
      </button>
    )
  }

  if (state === 'subscribed') {
    return (
      <button
        className={`${styles.pushButton} ${styles.active}`}
        onClick={unsubscribe}
        title={t('push_disable_tooltip')}
      >
        <span className={styles.icon}>
          <BellIcon />
        </span>
        <span>{t('push_enabled_label')}</span>
      </button>
    )
  }

  return (
    <button
      className={styles.pushButton}
      onClick={subscribe}
      title={t('push_enable_tooltip')}
    >
      <span className={styles.icon}>
        <BellOffIcon />
      </span>
      <span>{t('push_disabled_label')}</span>
    </button>
  )
}
