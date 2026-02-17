'use server'

import { getClientAction } from '@/shared/api/actions'
import { GET_TRANSLATIONS } from './translations.query'
import { Locale, Namespace, TranslationMap, TranslationRecord } from './config'

interface RawTranslation {
  key: string
  value: string
  namespace: string
  locale: string
}

interface GetTranslationsData {
  translations: RawTranslation[]
}

const FALLBACK_TRANSLATIONS: TranslationMap = {
  navigation: {
    orders: 'Orders',
    groups: 'Groups',
    products: 'Products',
    users: 'Users',
    settings: 'Settings',
  },
  orders: {},
  products: {},
  common: {},
}

export async function fetchTranslations(locale: Locale): Promise<TranslationMap> {
  try {
    const { data, error } = await getClientAction<GetTranslationsData>(GET_TRANSLATIONS, {
      variables: { locale },
      cache: 'force-cache',
      revalidate: 3600,
    })

    if (error) {
      console.error('[i18n] Failed to fetch translations:', error.message)
      return FALLBACK_TRANSLATIONS
    }

    if (!data?.translations || data.translations.length === 0) {
      console.warn(`[i18n] No translations found for locale "${locale}"`)
      return FALLBACK_TRANSLATIONS
    }

    const map: Partial<TranslationMap> = {}

    for (const t of data.translations) {
      const ns = t.namespace as Namespace
      if (!map[ns]) map[ns] = {} as TranslationRecord
      map[ns]![t.key] = t.value
    }

    console.log(`[i18n] Loaded ${data.translations.length} translations for "${locale}"`)
    return map as TranslationMap
  } catch (err) {
    console.error('[i18n] Unexpected error fetching translations:', err)
    return FALLBACK_TRANSLATIONS
  }
}
