import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { cache } from 'react'
import 'server-only'

export const getClient = cache(() => {
  const baseUri = 'http://dzencode-app.railway.internal:3001'

  const finalUri = baseUri.endsWith('/graphql') ? baseUri : `${baseUri}/graphql`

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: finalUri,
      fetchOptions: { cache: 'no-store' },
    }),
  })
})
