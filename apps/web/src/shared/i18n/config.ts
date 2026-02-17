export const LOCALES = ['ru', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'ru'

export type Namespace = 'common' | 'navigation' | 'orders' | 'products'

export type TranslationRecord = Record<string, string>
export type TranslationMap = Record<Namespace, TranslationRecord>
