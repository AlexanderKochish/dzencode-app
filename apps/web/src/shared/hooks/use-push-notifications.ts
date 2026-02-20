'use client'

import { useState, useEffect, useCallback, startTransition } from 'react'
import {
  isPushSupported,
  subscribeToPush,
  unsubscribeFromPush,
  getCurrentSubscription,
} from '@/shared/lib/push/push-subscription'

type PushState = 'loading' | 'unsupported' | 'default' | 'subscribed' | 'denied'

export function usePushNotifications() {
  const [state, setState] = useState<PushState>('loading')

  useEffect(() => {
    if (!isPushSupported()) {
      startTransition(() => setState('unsupported'))
      return
    }

    if (Notification.permission === 'denied') {
      startTransition(() => setState('denied'))
      return
    }

    getCurrentSubscription().then((sub) => {
      setState(sub ? 'subscribed' : 'default')
    })
  }, [])

  const subscribe = useCallback(async () => {
    try {
      const sub = await subscribeToPush()
      setState(sub ? 'subscribed' : 'denied')
    } catch (err) {
      console.error('[Push] subscribe error:', err)
      setState('default')
    }
  }, [])

  const unsubscribe = useCallback(async () => {
    try {
      await unsubscribeFromPush()
      setState('default')
    } catch (err) {
      console.error('[Push] unsubscribe error:', err)
    }
  }, [])

  return { state, subscribe, unsubscribe }
}
