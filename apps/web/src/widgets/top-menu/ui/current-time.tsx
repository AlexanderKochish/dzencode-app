'use client'

import React, { useState, useEffect } from 'react'
import styles from './top-menu.module.scss'

function formatTopDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  let month = date.toLocaleString('ru-RU', { month: 'short' }).replace('.', '')
  month = month.charAt(0).toUpperCase() + month.slice(1)
  return `${day} ${month}, ${year}`
}

function getDayLabel(date: Date): string {
  const today = new Date()
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()

  if (isToday) return 'Today'

  const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
  return days[date.getDay()]
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

export const CurrentTime = () => {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  if (!now) return null

  return (
    <div className={styles.dateTimeBlock}>
      <span className={styles.dayLabel}>{getDayLabel(now)}</span>
      <div className={styles.dateRow}>
        <span className={styles.dateText}>{formatTopDate(now)}</span>
        <span className={styles.timeSep} />
        <span className={styles.clockIcon}>⏱</span>
        <span className={styles.timeText}>{formatTime(now)}</span>
      </div>
    </div>
  )
}
