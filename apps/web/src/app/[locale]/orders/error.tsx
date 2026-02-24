'use client'

import { useTranslations } from '@/shared/i18n/i18n-context'
import { PageError } from '@/shared/ui/error-page/error-page'

export default function OrdersError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('orders')
  return <PageError error={error} reset={reset} title={t('error_title')} />
}
