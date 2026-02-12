import 'bootstrap/dist/css/bootstrap.min.css'
import '@/app/styles/globals.scss'
import { MainLayout } from '@/widgets/layout/ui/main-layout'
import { StoreProvider } from './providers/store-provider'

export const metadata = {
  title: 'Inventory App',
  description: 'Dzencode test task',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        <StoreProvider>
          <MainLayout>{children}</MainLayout>
        </StoreProvider>
      </body>
    </html>
  )
}
