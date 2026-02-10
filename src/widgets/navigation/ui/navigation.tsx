'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './navigation.module.scss'

export const Navigation = () => {
  const pathname = usePathname()

  const menuItems = [
    { name: 'ПРИХОД', path: '/orders' },
    { name: 'ГРУППЫ', path: '/groups' },
    { name: 'ПРОДУКТЫ', path: '/products' },
    { name: 'ПОЛЬЗОВАТЕЛИ', path: '/users' },
    { name: 'НАСТРОЙКИ', path: '/settings' },
  ]

  return (
    <div className={styles.navigation}>
      <div className={styles.userBlock}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatarPlaceholder} />
          <button className={styles.settingsBtn}>⚙</button>
        </div>
      </div>

      <nav className={styles.navMenu}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`${styles.navLink} ${pathname === item.path ? styles.active : ''}`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}
