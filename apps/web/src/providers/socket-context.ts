'use client'

import { createContext } from 'react'
import { Socket } from 'socket.io-client'
import type { ServerToClientEvents, ClientToServerEvents } from '@/shared/types/socket-types'

export type { ServerToClientEvents, ClientToServerEvents } from '@/shared/types/socket-types'

export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>

export interface SocketContextValue {
  socket: TypedSocket | null
  isConnected: boolean
}

export const SocketContext = createContext<SocketContextValue | null>(null)
