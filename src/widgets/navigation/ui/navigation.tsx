'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './navigation.module.scss'
import Image from 'next/image'

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
          <div className={styles.avatarPlaceholder}>
            <Image
              src={'/placeholder.jpg'}
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
