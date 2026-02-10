import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.product.deleteMany({})
  await prisma.order.deleteMany({})

  console.log('Database cleared')

  const order1 = await prisma.order.create({
    data: {
      title: 'Order 1 - Длинное название прихода',
      date: new Date('2017-06-29 12:09:33'),
      description: 'desc',
    },
  })

  const order2 = await prisma.order.create({
    data: {
      title: 'Order 2 - Короткое название',
      date: new Date('2017-06-29 12:09:33'),
      description: 'desc',
    },
  })

  const order3 = await prisma.order.create({
    data: {
      title: 'Order 3',
      date: new Date('2017-06-29 12:09:33'),
      description: 'desc',
    },
  })

  console.log('Orders created')

  await prisma.product.create({
    data: {
      serialNumber: 1234,
      isNew: 1,
      photo: '/monitor.webp',
      title: 'Product 1',
      type: 'Monitors',
      specification: 'Specification 1',
      guarantee: {
        start: '2017-06-29 12:09:33',
        end: '2017-06-29 12:09:33',
      },
      price: [
        { value: 100, symbol: 'USD', isDefault: 0 },
        { value: 2600, symbol: 'UAH', isDefault: 1 },
      ],
      orderId: order1.id,
      date: new Date('2017-06-29 12:09:33'),
    },
  })

  await prisma.product.create({
    data: {
      serialNumber: 12345,
      isNew: 1,
      photo: '/monitor.webp',
      title: 'Product 2',
      type: 'Monitors',
      specification: 'Specification 1',
      guarantee: {
        start: '2017-06-29 12:09:33',
        end: '2017-06-29 12:09:33',
      },
      price: [
        { value: 120, symbol: 'USD', isDefault: 0 },
        { value: 3000, symbol: 'UAH', isDefault: 1 },
      ],
      orderId: order1.id,
      date: new Date('2017-06-29 12:09:33'),
    },
  })

  console.log('Products created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
