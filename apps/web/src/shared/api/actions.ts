'use server'
import { type TypedDocumentNode, type OperationVariables } from '@apollo/client'
import { getClient } from '../lib/apollo-client'

type CacheStrategy = RequestCache

interface QueryOptions<TVars> {
  variables?: TVars
  cache?: CacheStrategy
  revalidate?: number | false
}

interface QueryResult<TData> {
  data: TData | null
  error: { message: string; code?: string; stack?: string } | null
}

const RETRY_COUNT = 3
const RETRY_DELAY_MS = 800

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  const msg = error.message.toLowerCase()
  return (
    msg.includes('econnreset') ||
    msg.includes('econnrefused') ||
    msg.includes('fetch failed') ||
    msg.includes('network')
  )
}

export const getClientAction = async <
  TData,
  TVars extends OperationVariables = OperationVariables,
>(
  query: TypedDocumentNode<TData, TVars>,
  options: QueryOptions<TVars> = {}
): Promise<QueryResult<TData>> => {
  const { variables, cache = 'no-store', revalidate } = options

  for (let attempt = 1; attempt <= RETRY_COUNT; attempt++) {
    try {
      const result = await getClient().query<TData, TVars>({
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
      return { data: result.data ?? null, error: result.error ?? null }
    } catch (error) {
      const isLast = attempt === RETRY_COUNT
      if (isRetryableError(error) && !isLast) {
        await sleep(RETRY_DELAY_MS * attempt)
        continue
      }
      return {
        data: null,
        error: error instanceof Error ? error : new Error(String(error)),
      }
    }
  }

  return { data: null, error: new Error('All retry attempts exhausted') }
}

import { cookies } from 'next/headers'
import { Locale } from '@/shared/i18n/config'

export async function setLocaleCookie(locale: Locale) {
  const cookieStore = await cookies()

  cookieStore.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 31536000,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}
