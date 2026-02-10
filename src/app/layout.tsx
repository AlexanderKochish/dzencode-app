import '@/app/styles/globals.scss'
import { MainLayout } from '@/widgets/layout/ui/main-layout'

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
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  )
}
