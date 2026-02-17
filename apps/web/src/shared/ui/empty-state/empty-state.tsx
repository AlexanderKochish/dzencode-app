import React from 'react'
import styles from './empty-state.module.scss'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  className?: string
}

export const EmptyState = ({
  title = 'Здесь пока пусто',
  description,
  icon = '📦',
  className = '',
}: EmptyStateProps) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.icon}>{icon}</div>
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  )
}
