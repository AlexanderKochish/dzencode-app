'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export const useUpdateSearchParams = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateQuery = (
    updates: Record<string, string | undefined | null>,
    resetPage = true
  ) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    if (resetPage) {
      params.set('page', '1')
    }

    const query = params.toString()
    router.push(`${pathname}${query ? `?${query}` : ''}`)
  }

  return { updateQuery, searchParams }
}
