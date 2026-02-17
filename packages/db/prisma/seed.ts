import { prisma } from '../index';

const translations: Array<{ locale: string; namespace: string; key: string; value: string }> = [
  // ── navigation ──────────────────────────────────────────────────────────────
  { locale: 'ru', namespace: 'navigation', key: 'orders',   value: 'Приход' },
  { locale: 'ru', namespace: 'navigation', key: 'groups',   value: 'Группы' },
  { locale: 'ru', namespace: 'navigation', key: 'products', value: 'Продукты' },
  { locale: 'ru', namespace: 'navigation', key: 'users',    value: 'Пользователи' },
  { locale: 'ru', namespace: 'navigation', key: 'settings', value: 'Настройки' },

  { locale: 'en', namespace: 'navigation', key: 'orders',   value: 'Orders' },
  { locale: 'en', namespace: 'navigation', key: 'groups',   value: 'Groups' },
  { locale: 'en', namespace: 'navigation', key: 'products', value: 'Products' },
  { locale: 'en', namespace: 'navigation', key: 'users',    value: 'Users' },
  { locale: 'en', namespace: 'navigation', key: 'settings', value: 'Settings' },

  // ── orders ──────────────────────────────────────────────────────────────────
  { locale: 'ru', namespace: 'orders', key: 'title',           value: 'Приходы' },
  { locale: 'ru', namespace: 'orders', key: 'add',             value: 'Добавить' },
  { locale: 'ru', namespace: 'orders', key: 'products_count',  value: 'Продукта' },
  { locale: 'ru', namespace: 'orders', key: 'add_product',     value: 'Добавить продукт' },
  { locale: 'ru', namespace: 'orders', key: 'empty',           value: 'В этом приходе нет продуктов' },
  { locale: 'ru', namespace: 'orders', key: 'free',            value: 'Свободен' },
  { locale: 'ru', namespace: 'orders', key: 'in_repair',       value: 'В ремонте' },
  { locale: 'ru', namespace: 'orders', key: 'delete_confirm',  value: 'Вы уверены, что хотите удалить этот приход?' },
  { locale: 'ru', namespace: 'orders', key: 'delete_btn',      value: 'Удалить' },
  { locale: 'ru', namespace: 'orders', key: 'cancel_btn',      value: 'Отменить' },
  { locale: 'ru', namespace: 'orders', key: 'not_found',       value: 'Приходы не найдены' },
  { locale: 'ru', namespace: 'orders', key: 'not_found_desc',  value: 'Список приходов пуст. Добавьте первый приход.' },
  { locale: 'ru', namespace: 'orders', key: 'error_title',     value: 'Ошибка при загрузке приходов' },

  { locale: 'en', namespace: 'orders', key: 'title',           value: 'Orders' },
  { locale: 'en', namespace: 'orders', key: 'add',             value: 'Add' },
  { locale: 'en', namespace: 'orders', key: 'products_count',  value: 'Products' },
  { locale: 'en', namespace: 'orders', key: 'add_product',     value: 'Add product' },
  { locale: 'en', namespace: 'orders', key: 'empty',           value: 'No products in this order' },
  { locale: 'en', namespace: 'orders', key: 'free',            value: 'Free' },
  { locale: 'en', namespace: 'orders', key: 'in_repair',       value: 'In repair' },
  { locale: 'en', namespace: 'orders', key: 'delete_confirm',  value: 'Are you sure you want to delete this order?' },
  { locale: 'en', namespace: 'orders', key: 'delete_btn',      value: 'Delete' },
  { locale: 'en', namespace: 'orders', key: 'cancel_btn',      value: 'Cancel' },
  { locale: 'en', namespace: 'orders', key: 'not_found',       value: 'No orders found' },
  { locale: 'en', namespace: 'orders', key: 'not_found_desc',  value: 'The orders list is empty. Add your first order.' },
  { locale: 'en', namespace: 'orders', key: 'error_title',     value: 'Error loading orders' },

  // ── products ─────────────────────────────────────────────────────────────────
  { locale: 'ru', namespace: 'products', key: 'title',          value: 'Продукты' },
  { locale: 'ru', namespace: 'products', key: 'type_filter',    value: 'Тип:' },
  { locale: 'ru', namespace: 'products', key: 'spec_filter',    value: 'Спецификация:' },
  { locale: 'ru', namespace: 'products', key: 'all',            value: 'Все' },
  { locale: 'ru', namespace: 'products', key: 'free',           value: 'свободен' },
  { locale: 'ru', namespace: 'products', key: 'in_repair',      value: 'В ремонте' },
  { locale: 'ru', namespace: 'products', key: 'new',            value: 'новый' },
  { locale: 'ru', namespace: 'products', key: 'used',           value: 'Б / У' },
  { locale: 'ru', namespace: 'products', key: 'guarantee_from', value: 'с' },
  { locale: 'ru', namespace: 'products', key: 'guarantee_to',   value: 'по' },
  { locale: 'ru', namespace: 'products', key: 'delete_confirm', value: 'Вы уверены, что хотите удалить этот товар?' },
  { locale: 'ru', namespace: 'products', key: 'delete_btn',     value: 'Удалить' },
  { locale: 'ru', namespace: 'products', key: 'cancel_btn',     value: 'Отменить' },
  { locale: 'ru', namespace: 'products', key: 'not_found',      value: 'Товары не найдены' },
  { locale: 'ru', namespace: 'products', key: 'not_found_desc', value: 'Список товаров пуст или не соответствует фильтрам.' },
  { locale: 'ru', namespace: 'products', key: 'error_title',    value: 'Ошибка при загрузке товаров' },

  { locale: 'en', namespace: 'products', key: 'title',          value: 'Products' },
  { locale: 'en', namespace: 'products', key: 'type_filter',    value: 'Type:' },
  { locale: 'en', namespace: 'products', key: 'spec_filter',    value: 'Specification:' },
  { locale: 'en', namespace: 'products', key: 'all',            value: 'All' },
  { locale: 'en', namespace: 'products', key: 'free',           value: 'free' },
  { locale: 'en', namespace: 'products', key: 'in_repair',      value: 'In repair' },
  { locale: 'en', namespace: 'products', key: 'new',            value: 'new' },
  { locale: 'en', namespace: 'products', key: 'used',           value: 'Used' },
  { locale: 'en', namespace: 'products', key: 'guarantee_from', value: 'from' },
  { locale: 'en', namespace: 'products', key: 'guarantee_to',   value: 'to' },
  { locale: 'en', namespace: 'products', key: 'delete_confirm', value: 'Are you sure you want to delete this product?' },
  { locale: 'en', namespace: 'products', key: 'delete_btn',     value: 'Delete' },
  { locale: 'en', namespace: 'products', key: 'cancel_btn',     value: 'Cancel' },
  { locale: 'en', namespace: 'products', key: 'not_found',      value: 'Products not found' },
  { locale: 'en', namespace: 'products', key: 'not_found_desc', value: 'The products list is empty or does not match the filters.' },
  { locale: 'en', namespace: 'products', key: 'error_title',    value: 'Error loading products' },

  // ── common ───────────────────────────────────────────────────────────────────
  { locale: 'ru', namespace: 'common', key: 'search',        value: 'Поиск' },
  { locale: 'ru', namespace: 'common', key: 'today',         value: 'Сегодня' },
  { locale: 'ru', namespace: 'common', key: 'api_error',     value: 'Сервер API недоступен. Убедитесь что NestJS запущен.' },
  { locale: 'ru', namespace: 'common', key: 'retry',         value: 'Повторить попытку' },
  { locale: 'ru', namespace: 'common', key: 'groups_wip',    value: 'Страница групп в разработке.' },
  { locale: 'ru', namespace: 'common', key: 'users_wip',     value: 'Страница пользователей в разработке.' },
  { locale: 'ru', namespace: 'common', key: 'settings_wip',  value: 'Страница настроек в разработке.' },

  { locale: 'en', namespace: 'common', key: 'search',        value: 'Search' },
  { locale: 'en', namespace: 'common', key: 'today',         value: 'Today' },
  { locale: 'en', namespace: 'common', key: 'api_error',     value: 'API server is unavailable. Make sure NestJS is running.' },
  { locale: 'en', namespace: 'common', key: 'retry',         value: 'Retry' },
  { locale: 'en', namespace: 'common', key: 'groups_wip',    value: 'Groups page is under development.' },
  { locale: 'en', namespace: 'common', key: 'users_wip',     value: 'Users page is under development.' },
  { locale: 'en', namespace: 'common', key: 'settings_wip',  value: 'Settings page is under development.' },
];

async function main() {
  await prisma.product.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.translation.deleteMany({});
  console.log('Database cleared');

  // ── Seed translations ────────────────────────────────────────────────────────
  for (const t of translations) {
    await prisma.translation.upsert({
      where: { locale_namespace_key: { locale: t.locale, namespace: t.namespace, key: t.key } },
      update: { value: t.value },
      create: t,
    });
  }
  console.log(`✅ ${translations.length} translations seeded`);

  // ── Seed orders & products ───────────────────────────────────────────────────
  const productTypes = ['Monitors', 'Laptops', 'Keyboards', 'Mice', 'Tablets'];
  const specifications = ['Specification 1', 'Specification 2', 'Specification 3'];

  const orders = [];
  for (let i = 1; i <= 100; i++) {
    const order = await prisma.order.create({
      data: {
        title: `Order ${i} - ${i % 2 === 0 ? 'Длинное название прихода' : 'Короткое название'}`,
        date: new Date(2024, 0, i),
        description: `Description for order ${i}`,
      },
    });
    orders.push(order);
  }
  console.log('✅ 100 Orders created');

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
          guarantee: { start: '2025-01-01 12:00:00', end: '2026-01-01 12:00:00' },
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

  console.log('✅ Seed finished');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
