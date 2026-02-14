import 'bootstrap/dist/css/bootstrap.min.css'
import '@/app/styles/globals.scss'
import { MainLayout } from '@/widgets/layout/ui/main-layout'
import { ApolloProvider } from '@/providers/apollo-provider'
import { StoreProvider } from '@/providers/store-provider'
import { SocketProvider } from '@/providers/socket-provider'

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
        <SocketProvider>
          <ApolloProvider>
            <StoreProvider>
              <MainLayout>{children}</MainLayout>
            </StoreProvider>
          </ApolloProvider>
        </SocketProvider>
      </body>
    </html>
  )
}
