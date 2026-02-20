const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

export async function getPermissionState(): Promise<NotificationPermission> {
  if (!isPushSupported()) return 'denied'
  return Notification.permission
}

export async function fetchVapidPublicKey(): Promise<string> {
  const res = await fetch(`${API_URL}/push/vapid-public-key`)
  const data = (await res.json()) as { key: string }
  return data.key
}

export async function subscribeToPush(): Promise<PushSubscription | null> {
  const permission = await Notification.requestPermission()

  if (permission !== 'granted') return null

  const registration = await navigator.serviceWorker.ready
  const vapidPublicKey = await fetchVapidPublicKey()

  if (!vapidPublicKey) {
    console.error('[Push] VAPID public key is empty — server not configured')
    return null
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: vapidPublicKey,
  })

  await fetch(`${API_URL}/push/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
      keys: {
        p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
        auth: arrayBufferToBase64(subscription.getKey('auth')!),
      },
    }),
  })

  return subscription
}

export async function unsubscribeFromPush(): Promise<void> {
  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.getSubscription()

  if (!subscription) return

  await fetch(`${API_URL}/push/unsubscribe`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint: subscription.endpoint }),
  })

  await subscription.unsubscribe()
}

export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null

  const registration = await navigator.serviceWorker.ready
  return registration.pushManager.getSubscription()
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  bytes.forEach((b) => (binary += String.fromCharCode(b)))
  return window.btoa(binary)
}
