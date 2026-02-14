'use client'
import { HttpLink } from '@apollo/client'
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client-integration-nextjs'

function makeClient() {
  const baseUri =
    typeof window === 'undefined'
      ? process.env.INTERNAL_API_URL || 'http://api:3001'
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  const httpLink = new HttpLink({
    uri: `${baseUri}/graphql`,
    fetchOptions: { cache: 'no-store' },
  })

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  })
}

export function ApolloProvider({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  )
}
