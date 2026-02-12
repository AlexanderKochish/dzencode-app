import styles from './top-menu.module.scss'
import { CurrentTime } from './current-time'
import { ActiveTabsCounter } from '@/shared/ui/active-tabs-counter/active-tabs-counter'

export const TopMenu = () => {
  return (
    <header className={styles.topMenu}>
      <div className={styles.logoBlock}>
        <div className={styles.logoIcon}>🛡️</div>
        <span className={styles.logoText}>INVENTORY</span>
      </div>

      <div className={styles.searchBlock}>
        <input type="text" placeholder="Поиск" className="form-control" />
      </div>

      <div className={styles.infoBlock}>
        <div className={styles.dateBlock}>
          <span className={styles.dayOfWeek}>Today</span>
          <div className={styles.dateDetails}>
            <CurrentTime />
          </div>
        </div>
        <ActiveTabsCounter />
      </div>
    </header>
  )
}
