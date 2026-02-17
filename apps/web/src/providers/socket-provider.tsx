'use client'

import React, { useEffect, useState, useMemo, startTransition } from 'react'
import { io } from 'socket.io-client'
import { SocketContext, TypedSocket } from './socket-context'

export { SocketContext } from './socket-context'
export type { SocketContextValue, TypedSocket } from './socket-context'

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<TypedSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3001'

    const socketInstance: TypedSocket = io(url, {
      transports: ['websocket'],
      withCredentials: true,
      reconnectionAttempts: 5,
    })

    socketInstance.on('connect', () => setIsConnected(true))
    socketInstance.on('disconnect', () => setIsConnected(false))
    socketInstance.on('connect_error', (err) => console.error('[Socket]', err.message))

    startTransition(() => setSocket(socketInstance))

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  const value = useMemo(() => ({ socket, isConnected }), [socket, isConnected])

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}
