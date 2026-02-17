'use client'

import { createContext } from 'react'
import { Socket } from 'socket.io-client'

export interface ServerToClientEvents {
  updateActiveTabs: (count: number) => void
  productDeleted: ({ id }: { id: number }) => void
}

export interface ClientToServerEvents {
  sendMessage: (msg: string) => void
}

export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>

export interface SocketContextValue {
  socket: TypedSocket | null
  isConnected: boolean
}

export const SocketContext = createContext<SocketContextValue | null>(null)
