'use client'
import { useTranslations } from '@/shared/i18n/i18n-context'
import { Loader } from '@/shared/ui/loader/loader'

export default function ProductsLoading() {
  const t = useTranslations('common')
  return <Loader text={t('loading')} />
}
