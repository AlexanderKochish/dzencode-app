'use server'

import { TypedDocumentNode, OperationVariables } from '@apollo/client'
import { getClient } from '../lib/apollo-client'

type CacheStrategy = RequestCache

interface QueryOptions<TVars> {
  variables?: TVars
  cache?: CacheStrategy
  revalidate?: number | false
}

export const getClientAction = async <
  TData,
  TVars extends OperationVariables = OperationVariables,
>(
  query: TypedDocumentNode<TData, TVars>,
  options: QueryOptions<TVars> = {}
) => {
  const { variables, cache = 'no-store', revalidate } = options

  return await getClient().query<TData, TVars>({
    query,
    variables: variables as TVars,
    context: {
      fetchOptions: {
        cache,
        ...(revalidate !== undefined && { next: { revalidate } }),
      },
    },
    errorPolicy: 'all',
  })
}
