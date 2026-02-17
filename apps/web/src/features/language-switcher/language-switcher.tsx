'use client'

import { usePathname, useRouter } from 'next/navigation'
import { LOCALES, Locale } from '@/shared/i18n/config'
import { useLocale } from '@/shared/i18n/i18n-context'
import styles from './language-switcher.module.scss'

const LOCALE_NAMES: Record<Locale, string> = {
  ru: 'Русский',
  en: 'English',
}

export const LanguageSwitcher = () => {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()

  const handleChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) return

    const segments = pathname.split('/').filter(Boolean)
    segments[0] = newLocale
    const newPath = `/${segments.join('/')}`

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`
    router.push(newPath)
    router.refresh()
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>Язык / Language:</label>
      <div className={styles.buttons}>
        {LOCALES.map((locale) => (
          <button
            key={locale}
            className={`${styles.btn} ${currentLocale === locale ? styles.active : ''}`}
            onClick={() => handleChange(locale)}
          >
            {LOCALE_NAMES[locale]}
          </button>
        ))}
      </div>
    </div>
  )
}
