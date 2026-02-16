import { renderHook, act } from '@testing-library/react'
import { useUpdateSearchParams } from '@/shared/hooks/use-update-search-params'

const mockPush = jest.fn()
const mockSearchParamsGet = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/products',
  useSearchParams: () => ({
    toString: () => 'page=2&type=Laptops',
    get: mockSearchParamsGet,
  }),
}))

describe('useUpdateSearchParams', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('вызывает router.push с новым параметром', () => {
    const { result } = renderHook(() => useUpdateSearchParams())

    act(() => {
      result.current.updateQuery({ type: 'Monitors' })
    })

    expect(mockPush).toHaveBeenCalledTimes(1)
    const calledUrl = mockPush.mock.calls[0][0] as string
    expect(calledUrl).toContain('type=Monitors')
    expect(calledUrl).toContain('/products')
  })

  it('сбрасывает page=1 при обновлении параметра (resetPage=true по умолчанию)', () => {
    const { result } = renderHook(() => useUpdateSearchParams())

    act(() => {
      result.current.updateQuery({ type: 'Keyboards' })
    })

    const calledUrl = mockPush.mock.calls[0][0] as string
    expect(calledUrl).toContain('page=1')
  })

  it('не сбрасывает page если resetPage=false', () => {
    const { result } = renderHook(() => useUpdateSearchParams())

    act(() => {
      result.current.updateQuery({ type: 'Mice' }, false)
    })

    const calledUrl = mockPush.mock.calls[0][0] as string
    // Содержит исходный page=2 из мока
    expect(calledUrl).toContain('page=2')
  })

  it('удаляет параметр при передаче null', () => {
    const { result } = renderHook(() => useUpdateSearchParams())

    act(() => {
      result.current.updateQuery({ type: null })
    })

    const calledUrl = mockPush.mock.calls[0][0] as string
    expect(calledUrl).not.toContain('type=')
  })

  it('удаляет параметр при передаче undefined', () => {
    const { result } = renderHook(() => useUpdateSearchParams())

    act(() => {
      result.current.updateQuery({ type: undefined })
    })

    const calledUrl = mockPush.mock.calls[0][0] as string
    expect(calledUrl).not.toContain('type=Laptops')
  })
})
