'use client'

import { useState } from 'react'
import styles from './truncated-text.module.scss'
import { createPortal } from 'react-dom'
interface Props {
  text: string
  maxLength?: number
  className?: string
}

export const TruncatedText = ({
  text,
  maxLength = 25,
  className = '',
}: Props) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()

    setCoords({
      x: rect.left + rect.width / 2,
      y: rect.top + window.scrollY,
    })
    setShowTooltip(true)
  }

  const isTruncated = text.length > maxLength
  if (!isTruncated) return <span className={className}>{text}</span>

  return (
    <span
      className={`${styles.container} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {text.slice(0, maxLength)}...
      {showTooltip &&
        createPortal(
          <span
            className={styles.tooltip}
            style={{
              position: 'absolute',
              left: coords.x,
              top: coords.y - 8,
              transform: 'translate(-50%, -100%)',
            }}
          >
            {text}
          </span>,
          document.body
        )}
    </span>
  )
}
