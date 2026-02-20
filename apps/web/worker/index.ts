/// <reference lib="webworker" />

interface NotificationOptionsWithVibrate extends NotificationOptions {
  vibrate: number[]
  renotify: boolean
}

interface PushPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  url?: string
  tag?: string
}

const sw = self as unknown as ServiceWorkerGlobalScope

sw.addEventListener('push', (event: PushEvent) => {
  if (!event.data) return

  let payload: PushPayload

  try {
    payload = event.data.json() as PushPayload
  } catch {
    payload = { title: 'Inventory', body: event.data.text() }
  }

  const options: NotificationOptionsWithVibrate = {
    body: payload.body,
    icon: payload.icon ?? '/icons/icon-192x192.png',
    badge: payload.badge ?? '/icons/icon-96x96.png',
    tag: payload.tag ?? 'inventory-notification',
    data: { url: payload.url ?? '/' },
    vibrate: [100, 50, 100],
    renotify: true,
  }

  event.waitUntil(sw.registration.showNotification(payload.title, options))
})

sw.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close()

  const targetUrl = (event.notification.data as { url?: string })?.url ?? '/'

  event.waitUntil(
    sw.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client) {
            client.focus()
            client.navigate(targetUrl)
            return
          }
        }
        return sw.clients.openWindow(targetUrl)
      })
  )
})
