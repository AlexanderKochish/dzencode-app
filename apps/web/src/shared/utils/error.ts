export function isApiUnavailable(error: Error): boolean {
  const msg = error.message.toLowerCase()
  return (
    msg.includes('econnreset') ||
    msg.includes('econnrefused') ||
    msg.includes('fetch failed') ||
    msg.includes('network') ||
    msg.includes('connect') ||
    msg.includes('socket')
  )
}
