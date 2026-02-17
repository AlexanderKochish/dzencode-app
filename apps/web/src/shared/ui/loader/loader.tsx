'use client'
import React from 'react'
import styles from './loader.module.scss'

export interface LoaderProps {
  text?: string
  autoRefreshInterval?: number
  className?: string
}

export const Loader = ({
  text = 'Загрузка...',
  autoRefreshInterval,
  className = '',
}: LoaderProps) => {
  return (
    <div className={`${styles.loaderContainer} ${className}`.trim()}>
      {autoRefreshInterval && (
        <meta httpEquiv="refresh" content={String(autoRefreshInterval)} />
      )}

      <div className="spinner-border text-secondary" role="status" />

      {text && <p className={styles.loaderText}>{text}</p>}
    </div>
  )
}
