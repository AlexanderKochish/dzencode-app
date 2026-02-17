'use client'

import { I18nContext, buildT } from './i18n-context'
import { Locale, TranslationMap } from './config'

interface Props {
  locale: Locale
  translations: TranslationMap
  children: React.ReactNode
}

export function I18nProvider({ locale, translations, children }: Props) {
  return (
    <I18nContext.Provider value={{ locale, t: buildT(translations) }}>
      {children}
    </I18nContext.Provider>
  )
}
