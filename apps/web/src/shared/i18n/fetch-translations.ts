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
  orders: {
    title: 'Orders',
    products_count: 'products',
    delete_btn: 'Delete',
    cancel_btn: 'Cancel',
    add_product: 'Add product',
    empty: 'No products',
    free: 'Free',
    in_repair: 'In repair',
    delete_confirm: 'Delete order?',
  },
  products: {
    title: 'Products',
    delete_btn: 'Delete',
    cancel_btn: 'Cancel',
    free: 'Free',
    in_repair: 'In repair',
    new: 'New',
    used: 'Used',
    type_filter: 'Type',
    spec_filter: 'Spec',
    all: 'All',
    guarantee_from: 'From',
    guarantee_to: 'To',
    delete_confirm: 'Delete product?',
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
  },
}

export async function fetchTranslations(
  locale: Locale
): Promise<TranslationMap> {
  try {
    const { data, error } = await getClientAction<GetTranslationsData>(
      GET_TRANSLATIONS,
      { variables: { locale } }
    )

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

    return map as TranslationMap
  } catch (err) {
    console.error('[i18n] Unexpected error fetching translations:', err)
    return FALLBACK_TRANSLATIONS
  }
}
