'use client'

import { ErrorPlaceholder } from '@/shared/ui/error-placeholder/error-placeholder'
import { useEffect } from 'react'

function getReadableMessage(error: Error): string {
  const msg = error.message.toLowerCase()
  if (msg.includes('econnreset') || msg.includes('econnrefused') || msg.includes('fetch failed')) {
    return 'Сервер API недоступен. Убедитесь что NestJS запущен на порту 3001.'
  }
  return error.message
}

export default function OrdersError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <ErrorPlaceholder
      title="Ошибка при загрузке приходов"
      message={getReadableMessage(error)}
      onReset={reset}
    />
  )
}
