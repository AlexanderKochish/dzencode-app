'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './navigation.module.scss'
import Image from 'next/image'
import { Locale } from '@/shared/i18n/config'
import { useTranslations } from '@/shared/i18n/i18n-context'

interface Props {
  locale: Locale
}

const menuItems = [
  { key: 'orders', path: 'orders' },
  { key: 'groups', path: 'groups' },
  { key: 'products', path: 'products' },
  { key: 'users', path: 'users' },
  { key: 'settings', path: 'settings' },
] as const

export const Navigation = ({ locale }: Props) => {
  const pathname = usePathname()
  const t = useTranslations('navigation')

  return (
    <div className={styles.navigation}>
      <div className={styles.userBlock}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatarPlaceholder}>
            <Image
              src="/placeholder.jpg"
              alt="user avatar"
              width={100}
              height={100}
              className={styles.imgAvatar}
            />
          </div>
          <button className={styles.settingsBtn}>⚙</button>
        </div>
      </div>

      <nav className={styles.navMenu}>
        {menuItems.map((item) => {
          const href = `/${locale}/${item.path}`
          const isActive = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={item.path}
              href={href}
              className={`${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              {t(item.key)}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
