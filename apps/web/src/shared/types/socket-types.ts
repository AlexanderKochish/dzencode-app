export interface ServerToClientEvents {
  updateActiveTabs: (count: number) => void
  productDeleted: (data: { id: number }) => void
  orderDeleted: (data: { id: number }) => void
}

export interface ClientToServerEvents {
  sendMessage: (msg: string) => void
  getActiveTabs: (data: null) => void
}

export type ServerEventName = keyof ServerToClientEvents
export type ClientEventName = keyof ClientToServerEvents
