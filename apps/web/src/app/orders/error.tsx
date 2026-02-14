'use client'

import { ErrorPlaceholder } from '@/shared/ui/error-placeholder/error-placeholder'
import { useEffect } from 'react'

export default function OrdersError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Captured Order Error:', error)
  }, [error])
  return (
    <ErrorPlaceholder
      title="Ошибка при загрузке приходов"
      message={error.message}
      onReset={reset}
    />
  )
}
