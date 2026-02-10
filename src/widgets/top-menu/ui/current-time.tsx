'use client'

import { formatDate } from '@/shared/lib/date/format-date'
import React, { useState, useEffect } from 'react'
import styles from './top-menu.module.scss'

export const CurrentTime = () => {
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

  if (!dateTime) return null

  const formattedTime = formatDate(dateTime)

  return (
    <>
      <span>{formattedTime}</span>
      <span className={styles.time}>
        ⏱{' '}
        {dateTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
    </>
  )
}
