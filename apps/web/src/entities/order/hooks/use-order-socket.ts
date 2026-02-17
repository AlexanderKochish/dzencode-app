'use client'

import { useEffect } from 'react'
import { useSocket } from '@/shared/hooks/use-socket'
import { useRouter } from 'next/navigation'

export const useOrderSocket = () => {
  const router = useRouter()
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return

    const handleDelete = () => router.refresh()

    socket.on('orderDeleted', handleDelete)

    return () => {
      socket.off('orderDeleted', handleDelete)
    }
  }, [socket, router])
}
