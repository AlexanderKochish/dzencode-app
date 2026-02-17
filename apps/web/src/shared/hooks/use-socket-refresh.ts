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

    eventNames.forEach((event) => {
      socket.on(event as any, handleRefresh)
    })

    return () => {
      eventNames.forEach((event) => {
        socket.off(event as any, handleRefresh)
      })
    }
  }, [socket, router, eventNames])
}
