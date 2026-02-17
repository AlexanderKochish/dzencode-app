'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSocket } from '@/shared/hooks/use-socket'
import { ServerToClientEvents } from '../types/socket-types'

export const useSocketRefresh = <T extends keyof ServerToClientEvents>(
  eventNames: T[]
) => {
  const router = useRouter()
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return

    const handleRefresh = () => {
      router.refresh()
    }

    const flexibleSocket = socket as unknown as {
      on: (event: string, listener: (...args: unknown[]) => void) => void
      off: (event: string, listener: (...args: unknown[]) => void) => void
    }

    eventNames.forEach((event) => {
      flexibleSocket.on(event as string, handleRefresh)
    })

    return () => {
      eventNames.forEach((event) => {
        flexibleSocket.off(event as string, handleRefresh)
      })
    }
  }, [socket, router, eventNames])
}
