export interface ServerToClientEvents {
  productDeleted: (data: { id: number }) => void
  orderDeleted: (data: { id: number }) => void
}

export type ServerEventName = keyof ServerToClientEvents
