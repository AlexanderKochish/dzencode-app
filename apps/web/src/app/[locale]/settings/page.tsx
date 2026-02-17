import { LanguageSwitcher } from '@/features/language-switcher/language-switcher'
import styles from './settings.module.scss'

export default function SettingsPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Настройки / Settings</h1>
      <LanguageSwitcher />
    </div>
  )
}
