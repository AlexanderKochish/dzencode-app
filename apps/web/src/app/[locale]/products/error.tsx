'use client'

import { PageError } from '@/shared/ui/error-page/error-page'

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <PageError error={error} reset={reset} title="Ошибка загрузки продуктов" />
  )
}
