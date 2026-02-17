import styles from './error-placeholder.module.scss'

interface ErrorPlaceholderProps {
  title?: string
  message?: string
  onReset?: () => void
}

export const ErrorPlaceholder = ({
  title = 'Упс! Что-то пошло не так',
  message,
  onReset,
}: ErrorPlaceholderProps) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>

      {message && <p className={styles.message}>{message}</p>}

      {onReset && (
        <button className={styles.resetButton} onClick={onReset} type="button">
          Повторить попытку
        </button>
      )}
    </div>
  )
}
