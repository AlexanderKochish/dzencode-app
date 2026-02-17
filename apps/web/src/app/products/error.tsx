'use client'

import { useEffect, useState } from 'react'

function isApiUnavailable(error: Error): boolean {
  const msg = error.message.toLowerCase()
  return (
    msg.includes('econnreset') ||
    msg.includes('econnrefused') ||
    msg.includes('fetch failed') ||
    msg.includes('network') ||
    msg.includes('connect') ||
    msg.includes('socket')
  )
}

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16 }}>
        <div className="spinner-border text-secondary" role="status" />
        <p style={{ color: '#888', margin: 0 }}>Подключение к серверу...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: 32 }}>
      <h2>Ошибка загрузки</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Повторить</button>
    </div>
  )
}
