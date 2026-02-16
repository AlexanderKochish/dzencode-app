import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { cache } from 'react'
import 'server-only'

function getServerApiUrl(): string {
  const url =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:3001'

  return url.endsWith('/graphql') ? url : `${url}/graphql`
}

export const getClient = cache(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: getServerApiUrl(),
      fetchOptions: { cache: 'no-store' },
    }),
  })
})
