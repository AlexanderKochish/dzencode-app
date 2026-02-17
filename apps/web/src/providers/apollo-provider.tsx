'use client'

import { HttpLink } from '@apollo/client'
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client-integration-nextjs'

function makeClient() {
  if (typeof window === 'undefined') {
    const isProd = process.env.NODE_ENV === 'production'
    const defaultServerUrl = isProd
      ? 'http://dzencode-app.railway.internal:3001'
      : 'http://localhost:3001'

    const serverUri = process.env.INTERNAL_API_URL || defaultServerUrl

    return new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        uri: serverUri.endsWith('/graphql')
          ? serverUri
          : `${serverUri}/graphql`,
        fetchOptions: { cache: 'no-store' },
      }),
    })
  }

  const browserUri = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: browserUri.endsWith('/graphql')
        ? browserUri
        : `${browserUri}/graphql`,
      fetchOptions: { cache: 'no-store' },
    }),
  })
}

export function ApolloProvider({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  )
}
