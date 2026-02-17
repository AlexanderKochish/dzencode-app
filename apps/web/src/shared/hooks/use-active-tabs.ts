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

    return () => {
      socket.off('updateActiveTabs', handleUpdate)
    }
  }, [socket])

  return activeTabs
}
