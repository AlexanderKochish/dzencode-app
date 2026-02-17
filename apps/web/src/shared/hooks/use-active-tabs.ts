'use client'

import { useEffect, useState } from 'react'
import { useSocket } from './use-socket'

export const useActiveTabs = () => {
  const [activeTabs, setActiveTabs] = useState<number>(0)
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return

    const handleUpdate = (count: number) => {
      setActiveTabs(count)
    }

    socket.on('updateActiveTabs', handleUpdate)

    // Запрашиваем актуальный счётчик сразу после подписки —
    // на случай если broadcast от сервера пришёл раньше чем смонтировался хук
    socket.emit('getActiveTabs', null)

    return () => {
      socket.off('updateActiveTabs', handleUpdate)
    }
  }, [socket])

  return activeTabs
}
