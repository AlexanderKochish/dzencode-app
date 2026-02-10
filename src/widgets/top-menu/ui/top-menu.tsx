import React, { useState, useEffect } from 'react'
import styles from './top-menu.module.scss'

export const TopMenu = () => {
  const [dateTime, setDateTime] = useState<Date | null>(null)

  useEffect(() => {
    const frameId = requestAnimationFrame(() => setDateTime(new Date()))
    const interval = setInterval(() => {
      setDateTime(new Date())
    }, 1000)
    return () => {
      cancelAnimationFrame(frameId)
      clearInterval(interval)
    }
  }, [])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  }

  if (!dateTime) return null

  return (
    <header className={styles.topMenu}>
      <div className={styles.logoBlock}>
        <div className={styles.logoIcon}>🛡️</div>
        <span className={styles.logoText}>INVENTORY</span>
      </div>

      <div className={styles.searchBlock}>
        <input type="text" placeholder="Поиск" className="form-control" />
      </div>

      <div className={styles.infoBlock}>
        <div className={styles.dateBlock}>
          <span className={styles.dayOfWeek}>Today</span>
          <div className={styles.dateDetails}>
            <span>{formatDate(dateTime)}</span>
            <span className={styles.time}>
              ⏱{' '}
              {dateTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
        {/* счетчик сокетов */}
      </div>
    </header>
  )
}
