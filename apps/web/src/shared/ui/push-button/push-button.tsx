'use client';

import { usePushNotifications } from '@/shared/hooks/use-push-notifications';
import styles from './push-button.module.scss';

export const PushButton = () => {
  const { state, subscribe, unsubscribe } = usePushNotifications();

  if (state === 'unsupported' || state === 'loading') return null;

  if (state === 'denied') {
    return (
      <button className={styles.pushButton} disabled title="Уведомления заблокированы в настройках браузера">
        <span className={styles.icon}>🔕</span>
        <span>Заблокировано</span>
      </button>
    );
  }

  if (state === 'subscribed') {
    return (
      <button
        className={`${styles.pushButton} ${styles.active}`}
        onClick={unsubscribe}
        title="Отключить push-уведомления"
      >
        <span className={styles.icon}>🔔</span>
        <span>Уведомления вкл.</span>
      </button>
    );
  }

  return (
    <button
      className={styles.pushButton}
      onClick={subscribe}
      title="Включить push-уведомления"
    >
      <span className={styles.icon}>🔕</span>
      <span>Уведомления</span>
    </button>
  );
};
