import { prisma } from '../index';

async function main() {

  await prisma.product.deleteMany({})
  await prisma.order.deleteMany({})
  console.log('Database cleared')

  const productTypes = ['Monitors', 'Laptops', 'Keyboards', 'Mice', 'Tablets'];
  const specifications = ['Specification 1', 'Specification 2', 'Specification 3'];

  console.log('🚀 Starting seed for 100 orders...');

  const orders = [];
  for (let i = 1; i <= 100; i++) {
    const order = await prisma.order.create({
      data: {
        title: `Order ${i} - ${i % 2 === 0 ? 'Длинное название прихода' : 'Короткое название'}`,
        date: new Date(2024, 0, i), // Разные даты для проверки сортировки
        description: `Description for order ${i}`,
      },
    });
    orders.push(order);
  }
  console.log('✅ 100 Orders created');

  console.log('🚀 Starting seed for products...');

  for (let i = 0; i < orders.length; i++) {
    const productsCount = Math.floor(Math.random() * 3) + 1;

    for (let j = 1; j <= productsCount; j++) {
      await prisma.product.create({
        data: {
          serialNumber: Math.floor(Math.random() * 100000),
          isNew: Math.random() > 0.5 ? 1 : 0,
          photo: '/monitor.webp',
          title: `Product ${i + 1}-${j}`,
          type: productTypes[Math.floor(Math.random() * productTypes.length)],
          specification: specifications[Math.floor(Math.random() * specifications.length)],
          guarantee: {
            start: '2025-01-01 12:00:00',
            end: '2026-01-01 12:00:00',
          },
          price: [
            { value: 100 + j * 10, symbol: 'USD', isDefault: 0 },
            { value: 4000 + j * 400, symbol: 'UAH', isDefault: 1 },
          ],
          orderId: orders[i].id, 
          date: orders[i].date,
        },
      });
    }
  }

  console.log(`✅ Seed finished: 100 Orders and ${orders.length}+ Products created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });