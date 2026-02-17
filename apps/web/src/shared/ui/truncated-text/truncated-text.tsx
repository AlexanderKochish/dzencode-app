'use client'

import { useState } from 'react'
import styles from './truncated-text.module.scss'

interface Props {
  text: string
  maxLength?: number
  className?: string
}

export const TruncatedText = ({ text, maxLength = 25, className = '' }: Props) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const isTruncated = text.length > maxLength
  const displayText = isTruncated ? `${text.slice(0, maxLength)}...` : text

  if (!isTruncated) {
    return <span className={className}>{text}</span>
  }

  return (
    <span 
      className={`${styles.container} ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {displayText}
      {showTooltip && (
        <span className={styles.tooltip}>
          {text}
        </span>
      )}
    </span>
  )
}
