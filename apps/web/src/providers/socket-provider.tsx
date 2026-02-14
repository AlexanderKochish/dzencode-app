'use client'

import React, {
  createContext,
  useEffect,
  useState,
  useMemo,
  startTransition,
} from 'react'
import { io, Socket } from 'socket.io-client'

export interface ServerToClientEvents {
  updateActiveTabs: (count: number) => void
  productDeleted: ({ id }: { id: number }) => void
}

export interface ClientToServerEvents {
  sendMessage: (msg: string) => void
}

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>

export const SocketContext = createContext<{
  socket: TypedSocket | null
  isConnected: boolean
} | null>(null)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<TypedSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socketInstance: TypedSocket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL!,
      {
        transports: ['websocket'],
        withCredentials: true,
        reconnectionAttempts: 5,
      }
    )

    socketInstance.on('connect', () => {
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
    })

    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message)
    })

    startTransition(() => setSocket(socketInstance))

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  const value = useMemo(() => ({ socket, isConnected }), [socket, isConnected])

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  )
}
