import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { cache } from 'react'

export const getClient = cache(() => {
  const isServer = typeof window === 'undefined'

  const baseUri = isServer
    ? process.env.INTERNAL_API_URL || 'http://api:3001'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  const finalUri = baseUri.endsWith('/graphql') ? baseUri : `${baseUri}/graphql`

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: finalUri,
      fetchOptions: { cache: 'no-store' },
    }),
  })
})
