export interface ServerToClientEvents {
  updateActiveTabs: (count: number) => void
  productDeleted: (data: { id: number }) => void
  orderDeleted: (data: { id: number }) => void
}

export type ServerEventName = keyof ServerToClientEvents
