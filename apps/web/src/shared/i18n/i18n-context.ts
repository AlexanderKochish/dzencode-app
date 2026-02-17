'use client'

import { createContext, useContext } from 'react'
import { Locale, Namespace, TranslationMap } from './config'

interface I18nContextValue {
  locale: Locale
  t: (namespace: Namespace, key: string, fallback?: string) => string
}

export const I18nContext = createContext<I18nContextValue | null>(null)

export function buildT(translations: TranslationMap) {
  return function t(namespace: Namespace, key: string, fallback?: string): string {
    return translations?.[namespace]?.[key] ?? fallback ?? key
  }
}

export function useTranslations(namespace: Namespace) {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useTranslations must be used within I18nProvider')
  return (key: string, fallback?: string) => ctx.t(namespace, key, fallback)
}

export function useLocale(): Locale {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useLocale must be used within I18nProvider')
  return ctx.locale
}
