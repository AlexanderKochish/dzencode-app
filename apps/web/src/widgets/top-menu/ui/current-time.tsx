'use client'

import React, { useState, useEffect, startTransition } from 'react'
import styles from './top-menu.module.scss'
import { useLocale, useTranslations } from '@/shared/i18n/i18n-context'
import {
  formatTime,
  formatTopDate,
  getDayLabel,
} from '@/shared/lib/date/format-date'
import { ClockIcon } from '@/shared/ui/icons/clock-icon'

export const CurrentTime = () => {
  const t = useTranslations('common')
  const locale = useLocale()
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    startTransition(() => setNow(new Date()))
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  if (!now) return null

  return (
    <div className={styles.dateTimeBlock}>
      <span className={styles.dayLabel}>{getDayLabel(now, t('today'))}</span>
      <div className={styles.dateRow}>
        <span className={styles.dateText}>{formatTopDate(now, locale)}</span>
        <span className={styles.timeSep} />
        <span className={styles.clockIcon}>
          <ClockIcon />
        </span>
        <span className={styles.timeText}>{formatTime(now)}</span>
      </div>
    </div>
  )
}
