'use client'

import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

export const useActiveTabs = () => {
  const [activeTabs, setActiveTabs] = useState<number>(0)

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    const socket = io(socketUrl, {
      transports: ['websocket'],
      withCredentials: true,
    })

    socket.on('updateActiveTabs', (count: number) => {
      setActiveTabs(count)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return activeTabs
}
