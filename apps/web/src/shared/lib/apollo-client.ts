import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { cache } from 'react'
import 'server-only'

function getServerApiUrl(): string {
  const url = 'http://dzencode-app.railway.internal:3001'

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
