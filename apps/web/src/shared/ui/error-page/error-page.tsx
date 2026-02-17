'use client'

import { useEffect, useState } from 'react'
import styles from './error-page.module.scss'
import { isApiUnavailable } from '@/shared/utils/error'

export interface PageErrorProps {
  error: Error & { digest?: string }
  reset: () => void
  title?: string
  loadingText?: string
}

export const PageError = ({
  error,
  reset,
  title = 'Ошибка загрузки',
  loadingText = 'Подключение к серверу...',
}: PageErrorProps) => {
  const [retryCount, setRetryCount] = useState(0)
  const apiError = isApiUnavailable(error)

  useEffect(() => {
    if (!apiError) return

    const timer = setTimeout(() => {
      setRetryCount((c) => c + 1)
      reset()
    }, 3000)

    return () => clearTimeout(timer)
  }, [apiError, reset, retryCount])

  if (apiError) {
    return (
      <div className={styles.loadingContainer}>
        <div className="spinner-border text-secondary" role="status" />
        <p className={styles.loadingText}>{loadingText}</p>
      </div>
    )
  }

  return (
    <div className={styles.errorContainer}>
      <h2>{title}</h2>
      <p className={styles.errorMessage}>{error.message}</p>
      <button onClick={reset} className={styles.retryButton}>
        Повторить
      </button>
    </div>
  )
}
