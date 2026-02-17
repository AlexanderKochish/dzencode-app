import { graphql, HttpResponse } from 'msw'

export const mockProducts = [
  {
    id: 1,
    serialNumber: 11111,
    isNew: 1,
    photo: '/monitor.jpg',
    title: 'Test Laptop',
    type: 'Laptops',
    specification: 'Spec 1',
    date: '2024-01-15',
    guarantee: { start: '2025-01-01', end: '2026-01-01' },
    price: [
      { value: 500, symbol: 'USD', isDefault: 0 },
      { value: 20000, symbol: 'UAH', isDefault: 1 },
    ],
    order: { id: 1, title: 'Order 1' },
  },
  {
    id: 2,
    serialNumber: 22222,
    isNew: 0,
    photo: '/monitor.jpg',
    title: 'Old Monitor',
    type: 'Monitors',
    specification: 'Spec 2',
    date: '2024-02-10',
    guarantee: { start: '2024-01-01', end: '2025-01-01' },
    price: [
      { value: 200, symbol: 'USD', isDefault: 0 },
      { value: 8000, symbol: 'UAH', isDefault: 1 },
    ],
    order: { id: 2, title: 'Order 2' },
  },
]

export const mockOrders = [
  {
    id: 1,
    title: 'Длинное название прихода',
    date: '2024-01-01',
    description: 'Description 1',
    total: [
      { value: 500, symbol: 'USD' },
      { value: 20000, symbol: 'UAH' },
    ],
    products: [mockProducts[0]],
  },
  {
    id: 2,
    title: 'Короткое название',
    date: '2024-02-01',
    description: 'Description 2',
    total: [
      { value: 200, symbol: 'USD' },
      { value: 8000, symbol: 'UAH' },
    ],
    products: [mockProducts[1]],
  },
]

export const handlers = [
  graphql.query('GetProducts', ({ variables }) => {
    const { type, limit = 20, offset = 0 } = variables as {
      type?: string
      limit?: number
      offset?: number
    }

    let items = [...mockProducts]
    if (type) {
      items = mockProducts.filter((p) => p.type === type)
    }

    const paginated = items.slice(offset, offset + limit)

    return HttpResponse.json({
      data: {
        products: {
          items: paginated,
          totalCount: items.length,
        },
        productTypes: ['Laptops', 'Monitors', 'Keyboards', 'Mice', 'Tablets'],
      },
    })
  }),

  graphql.query('GetOrders', ({ variables }) => {
    const { limit = 20, offset = 0 } = variables as {
      limit?: number
      offset?: number
    }

    const paginated = mockOrders.slice(offset, offset + limit)

    return HttpResponse.json({
      data: {
        orders: {
          items: paginated,
          totalCount: mockOrders.length,
        },
      },
    })
  }),

  graphql.mutation('RemoveProduct', ({ variables }) => {
    const { id } = variables as { id: number }
    return HttpResponse.json({
      data: { removeProduct: { id } },
    })
  }),

  graphql.mutation('RemoveOrder', ({ variables }) => {
    const { id } = variables as { id: number }
    return HttpResponse.json({
      data: { removeOrder: { id } },
    })
  }),
]
