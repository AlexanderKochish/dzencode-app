'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/app/store'
import { useSocket } from '@/shared/hooks/use-socket'
import { useRouter } from 'next/navigation'

export const useProductSocket = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return

    const handleDelete = () => {
      router.refresh()
    }

    socket.on('productDeleted', handleDelete)

    return () => {
      socket.off('productDeleted', handleDelete)
    }
  }, [socket, dispatch, router])
}
