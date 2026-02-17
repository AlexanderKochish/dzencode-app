import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE } from '@/shared/i18n/config'

export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}/orders`)
}
