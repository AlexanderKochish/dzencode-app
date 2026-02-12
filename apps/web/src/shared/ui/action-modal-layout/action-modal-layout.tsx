'use client'

import React from 'react'
import { Modal } from '@/shared/ui/modal/modal'
import styles from './action-modal-layout.module.scss'
import Image from 'next/image'

type ModalVariant = 'delete' | 'success' | 'warning'

interface ActionModalLayoutProps {
  isOpen: boolean
  onClose: () => void
  onAction: () => void
  title: string
  variant?: ModalVariant

  itemTitle?: string
  itemImage?: string
  children?: React.ReactNode
}

const VARIANTS = {
  delete: {
    colorClass: styles.red,
    footerColor: '#8bc34a',
    icon: '🗑',
    btnText: 'УДАЛИТЬ',
  },
  success: {
    colorClass: styles.green,
    footerColor: '#8bc34a',
    icon: '✅',
    btnText: 'ГОТОВО',
  },
  warning: {
    colorClass: styles.yellow,
    footerColor: '#f1c40f',
    icon: '⚠️',
    btnText: 'ПОНЯТНО',
  },
}

export const ActionModalLayout = ({
  isOpen,
  onClose,
  onAction,
  title,
  variant = 'delete',
  itemTitle,
  itemImage,
  children,
}: ActionModalLayoutProps) => {
  const config = VARIANTS[variant]

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.header}>
        <h3>{title}</h3>
      </div>

      <div className={styles.body}>
        {itemTitle && (
          <>
            <div className={`${styles.statusDot} ${config.colorClass}`}>•</div>
            <div className={styles.imageWrapper}>
              <Image
                src={itemImage || '/placeholder.jpg'}
                alt="icon"
                width={60}
                height={60}
              />
            </div>
            <div className={styles.info}>
              <div className={styles.title}>{itemTitle}</div>
            </div>
          </>
        )}

        {children && <div className={styles.customContent}>{children}</div>}
      </div>

      <div
        className={styles.footer}
        style={{ backgroundColor: config.footerColor }}
      >
        <button className={styles.cancelBtn} onClick={onClose}>
          ОТМЕНИТЬ
        </button>

        <button
          className={`${styles.actionBtn} ${config.colorClass}`}
          onClick={onAction}
        >
          <span className={styles.icon}>{config.icon}</span> {config.btnText}
        </button>
      </div>
    </Modal>
  )
}
