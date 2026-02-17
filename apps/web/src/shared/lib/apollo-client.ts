import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { cache } from 'react'
import 'server-only'

function getServerApiUrl(): string {
  const isProd = process.env.NODE_ENV === 'production'

  const defaultUrl = isProd
    ? 'http://dzencode-app.railway.internal:3001'
    : 'http://localhost:3001'

  const baseUri = process.env.INTERNAL_API_URL || defaultUrl

  return baseUri.endsWith('/graphql') ? baseUri : `${baseUri}/graphql`
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
