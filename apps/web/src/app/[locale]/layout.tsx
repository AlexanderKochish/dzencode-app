import 'bootstrap/dist/css/bootstrap.min.css'
import '@/app/styles/globals.scss'
import { notFound } from 'next/navigation'
import { MainLayout } from '@/widgets/layout/ui/main-layout'
import { ApolloProvider } from '@/providers/apollo-provider'
import { StoreProvider } from '@/providers/store-provider'
import { SocketProvider } from '@/providers/socket-provider'
import { I18nProvider } from '@/shared/i18n/i18n-provider'
import { fetchTranslations } from '@/shared/i18n/fetch-translations'
import { LOCALES, Locale } from '@/shared/i18n/config'

export const dynamic = 'force-dynamic'

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!LOCALES.includes(locale as Locale)) notFound()

  const translations = await fetchTranslations(locale as Locale)

  return (
    <html lang={locale}>
      <head>
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <I18nProvider locale={locale as Locale} translations={translations}>
          <SocketProvider>
            <ApolloProvider>
              <StoreProvider>
                <MainLayout locale={locale as Locale}>{children}</MainLayout>
              </StoreProvider>
            </ApolloProvider>
          </SocketProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
