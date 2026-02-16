import { renderHook, act } from '@testing-library/react'
import { useActiveTabs } from '@/shared/hooks/use-active-tabs'
import { SocketContext } from '@/providers/socket-context'
import React from 'react'
import { EventEmitter } from 'events'

class FakeSocket extends EventEmitter {
  connected = true
  on(event: string, listener: (...args: any[]) => void) {
    return super.on(event, listener)
  }
  off(event: string, listener: (...args: any[]) => void) {
    return super.off(event, listener)
  }
  emit(event: string, ...args: any[]) {
    return super.emit(event, ...args)
  }
}

describe('useActiveTabs (integration)', () => {
  it('начальное значение 0', () => {
    const fakeSocket = new FakeSocket()
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SocketContext.Provider
        value={{ socket: fakeSocket as any, isConnected: true }}
      >
        {children}
      </SocketContext.Provider>
    )

    const { result } = renderHook(() => useActiveTabs(), { wrapper })
    expect(result.current).toBe(0)
  })

  it('обновляет счётчик при получении события updateActiveTabs', () => {
    const fakeSocket = new FakeSocket()
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SocketContext.Provider
        value={{ socket: fakeSocket as any, isConnected: true }}
      >
        {children}
      </SocketContext.Provider>
    )

    const { result } = renderHook(() => useActiveTabs(), { wrapper })

    act(() => {
      fakeSocket.emit('updateActiveTabs', 5)
    })

    expect(result.current).toBe(5)
  })

  it('обновляет счётчик несколько раз', () => {
    const fakeSocket = new FakeSocket()
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SocketContext.Provider
        value={{ socket: fakeSocket as any, isConnected: true }}
      >
        {children}
      </SocketContext.Provider>
    )

    const { result } = renderHook(() => useActiveTabs(), { wrapper })

    act(() => {
      fakeSocket.emit('updateActiveTabs', 3)
    })
    expect(result.current).toBe(3)

    act(() => {
      fakeSocket.emit('updateActiveTabs', 1)
    })
    expect(result.current).toBe(1)
  })

  it('отписывается от события при размонтировании', () => {
    const fakeSocket = new FakeSocket()
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SocketContext.Provider
        value={{ socket: fakeSocket as any, isConnected: true }}
      >
        {children}
      </SocketContext.Provider>
    )

    const { result, unmount } = renderHook(() => useActiveTabs(), { wrapper })

    act(() => {
      fakeSocket.emit('updateActiveTabs', 4)
    })
    expect(result.current).toBe(4)

    unmount()

    expect(fakeSocket.listenerCount('updateActiveTabs')).toBe(0)
  })

  it('бросает ошибку если используется вне SocketProvider', () => {
    expect(() => {
      renderHook(() => useActiveTabs())
    }).toThrow('useSocket must be used within SocketProvider')
  })
})
