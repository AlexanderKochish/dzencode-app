# 📦 DzenCode Inventory App

Fullstack-приложение для управления товарами и заказами. Монорепозиторий на базе **Turborepo**, с бэкендом на **NestJS + GraphQL** и фронтендом на **Next.js 16 (App Router)**.

---

## 🗂 Структура монорепозитория

```
dzencode-app/
├── apps/
│   ├── server/          # NestJS API (GraphQL + WebSockets + Redis)
│   └── web/             # Next.js Frontend (FSD-архитектура)
├── packages/
│   ├── db/              # Shared Prisma-пакет (схема, миграции, seed)
│   └── tsconfig/        # Shared TypeScript конфиги
├── docker-compose.yml
├── Dockerfile
└── turbo.json
```

---

## ⚙️ Стек технологий

| Слой | Технологии |
|------|-----------|
| **Frontend** | Next.js 16, React 19, Redux Toolkit, Apollo Client, Socket.io-client, Bootstrap 5, Framer Motion, SCSS |
| **Backend** | NestJS 11, GraphQL (code-first), Apollo Server, Socket.io, Redis Adapter |
| **Database** | PostgreSQL 15, Prisma ORM |
| **Cache / WS** | Redis 7, `@socket.io/redis-adapter` |
| **Monorepo** | Turborepo 2, npm workspaces |
| **DevOps** | Docker, Docker Compose |

---

## 🚀 Быстрый старт

### Способ 1 — Docker Compose (рекомендуется)

Поднимает всё окружение одной командой: PostgreSQL, Redis, Next.js и NestJS.

**1. Клонируй репозиторий и создай `.env`:**

```bash
git clone https://github.com/AlexanderKochish/dzencode-app.git
cd dzencode-app
cp .env.example .env
```

**2. Заполни `.env`:**

```env
DB_USER=user
DB_PASSWORD=password
DB_NAME=inventory_db

NEXT_PORT=3000
NEST_PORT=3001
NODE_ENV=development
```

**3. Запусти:**

```bash
docker compose up --build --watch
```

При первом запуске API-контейнер автоматически:

- Применит Prisma-миграции
- Засеет базу 100 заказами и ~200 товарами
- Запустит NestJS в режиме `--watch`

**4. Открой приложение:**

| Сервис | URL |
|--------|-----|
| 🌐 Фронтенд | <http://localhost:3000> |
| 🔌 GraphQL Playground | <http://localhost:3001/graphql> |
| 🔍 Prisma Studio | <http://localhost:5555> |

---

### Способ 2 — Локальный запуск (без Docker)

**Требования:** Node.js 20+, PostgreSQL 15, Redis 7

**1. Установи зависимости:**

```bash
npm install
```

**2. Создай `.env` в корне и в `packages/db/prisma/`:**

```bash
cp .env.example .env
```

В файле `packages/db/prisma/.env` укажи:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/inventory_db?schema=public"
```

В файле `apps/web/.env` укажи:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/graphql
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
INTERNAL_API_URL=http://localhost:3001/graphql
```

В файле `apps/server/.env` укажи:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/inventory_db?schema=public"
REDIS_URL=redis://localhost:6379
PORT=3001
BASE_URL=http://localhost:3000
```

**3. Примени миграции и засей базу:**

```bash
npm run db:seed
```

**4. Запусти все сервисы параллельно:**

```bash
npm run dev
```

Это запустит через Turborepo одновременно Next.js (`port 3000`) и NestJS (`port 3001`).

---

## 🛠 Команды

### Корневые (запускаются через Turborepo)

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск всех сервисов в dev-режиме |
| `npm run build` | Сборка всех приложений |
| `npm run lint` | Линтинг всех пакетов |
| `npm run db:seed` | Засеять базу тестовыми данными |

### База данных (Prisma)

Выполняются из папки `packages/db/`:

```bash
# Создать и применить новую миграцию
npx prisma migrate dev --name <название>

# Применить существующие миграции (production)
npx prisma migrate deploy

# Быстро применить схему без миграций (dev)
npx prisma db push

# Открыть Prisma Studio (GUI для базы)
npx prisma studio

# Засеять базу тестовыми данными
npx prisma db seed
```

---

## ✨ Функциональность и фичи

### 📋 Страница заказов (`/orders`)

**Что умеет:**

- Список всех заказов с пагинацией (серверная, через URL `?page=N`)
- Для каждого заказа отображается: название, количество товаров, дата, общая стоимость в **USD** и **UAH**
- Удаление заказа через модальное окно с подтверждением
- Анимации появления/исчезновения элементов через **Framer Motion**

**Как работает:**

- Данные загружаются на сервере (Next.js Server Component) через GraphQL-запрос `GetOrders`
- Сумма заказа считается на бэкенде в `OrdersResolver.total()` — агрегируется из цен всех товаров заказа
- Удаление — GraphQL мутация `RemoveOrder`, после которой Redux обновляет состояние

---

### 🛒 Страница товаров (`/products`)

**Что умеет:**

- Список товаров с пагинацией
- Фильтрация по **типу** товара (Monitors, Laptops, Keyboards, Mice, Tablets) через URL-параметр `?type=`
- Для каждого товара: фото, название, серийный номер, статус (`Свободен` / `В ремонте`), гарантия, состояние (`Новый` / `Б/У`), цена в USD и UAH
- Удаление товара через модальное окно

**Как работает:**

- Данные + список всех типов загружаются одним запросом `GetProducts` (возвращает `items`, `totalCount`, `productTypes`)
- Фильтрация по типу передаётся в GraphQL-аргумент `type` и обрабатывается на бэкенде через Prisma `where: { type }`
- Пагинация — через `limit` / `offset` аргументы GraphQL

---

### ⚡ Реалтайм через WebSockets

**Что умеет:**

- После удаления товара — **все открытые вкладки** автоматически обновляют список без перезагрузки страницы
- Счётчик активных вкладок в шапке (`ActiveTabsCounter`) — показывает сколько браузерных вкладок сейчас открыто с приложением

**Как работает:**

```
Клиент удаляет товар
    ↓
GraphQL мутация → ProductsService.remove()
    ↓
EventsGateway.sendToAll('productDeleted', { id })
    ↓
Socket.io broadcast → все подключённые клиенты
    ↓
useProductSocket() ловит событие → router.refresh()
```

Подсчёт активных вкладок:

```
Клиент подключается к WebSocket
    ↓
EventsGateway.handleConnection() → server.fetchSockets()
    ↓
Redis.set('stats:active_tabs', count)
    ↓
broadcast 'updateActiveTabs' → все клиенты
    ↓
useActiveTabs() обновляет счётчик в шапке
```

Redis Adapter (`@socket.io/redis-adapter`) гарантирует, что события работают корректно даже при нескольких инстансах сервера.

---

### 📄 Пагинация

Реализована на клиенте через URL-параметры (`?page=N`).

- Компонент `Pagination` (Bootstrap) управляет переходами
- При смене страницы Next.js Server Component делает новый запрос с нужным `offset = (page - 1) * pageSize`
- Поддерживает эллипсис (`...`) при большом количестве страниц

---

### 🧩 GraphQL API

Playground доступен по адресу `http://localhost:3001/graphql`.

**Примеры запросов:**

```graphql
# Получить заказы (страница 2, по 10 штук)
query {
  orders(limit: 10, offset: 10) {
    items {
      id
      title
      date
      total { value symbol }
      products { id title }
    }
    totalCount
  }
}

# Получить товары с фильтром по типу
query {
  products(limit: 20, offset: 0, type: "Laptops") {
    items {
      id
      title
      type
      isNew
      price { value symbol }
      guarantee { start end }
    }
    totalCount
  }
  productTypes
}

# Удалить товар
mutation {
  removeProduct(id: 5) {
    id
  }
}

# Удалить заказ
mutation {
  removeOrder(id: 3) {
    id
  }
}
```

---

## 🏗 Архитектура фронтенда (FSD)

Фронтенд следует методологии **Feature-Sliced Design**:

```
src/
├── app/          # Точка входа, store, роуты, глобальные стили
├── widgets/      # Крупные блоки UI: TopMenu, Navigation, Layout, модальные окна удаления
├── entities/     # Бизнес-сущности:
│   ├── order/    #   api (запросы), model (slice, types), ui (компоненты), lib
│   └── product/  #   api (запросы), model (slice, types), ui (компоненты), hooks
├── features/     # (зарезервировано для будущих фич)
├── shared/       # Переиспользуемые утилиты:
│   ├── ui/       #   Pagination, Modal, EmptyState, ActiveTabsCounter и др.
│   ├── hooks/    #   useSocket, useActiveTabs, useProductSocket, useUpdateSearchParams
│   ├── lib/      #   apollo-client, formatDate
│   └── types/    #   глобальные типы, socket-types
└── providers/    # ApolloProvider, SocketProvider, StoreProvider
```

---

## 🗄 Схема базы данных

```
Order
├── id           Int        (PK, autoincrement)
├── title        String
├── date         DateTime
├── description  String?
├── createdAt    DateTime   (default: now())
└── products     Product[]  (1:M)

Product
├── id           Int        (PK, autoincrement)
├── serialNumber Int
├── isNew        Int        (0 = Б/У, 1 = Новый)
├── photo        String?
├── title        String
├── type         String     (Monitors | Laptops | Keyboards | Mice | Tablets)
├── specification String
├── guarantee    Json       { start: string, end: string }
├── price        Json       [{ value: number, symbol: "USD"|"UAH", isDefault: 0|1 }]
├── orderId      Int        (FK → Order, CASCADE DELETE)
├── date         DateTime
└── createdAt    DateTime   (default: now())
```

---

## 🐛 Отладка

**Логи контейнеров:**

```bash
docker compose logs -f api   # NestJS логи
docker compose logs -f web   # Next.js логи
docker compose logs -f db    # PostgreSQL логи
```

**Перезапуск отдельного сервиса:**

```bash
docker compose restart api
```

**Сброс базы и повторный seed:**

```bash
docker compose down -v       # удалить контейнеры и volume с данными
docker compose up --build    # поднять заново (seed запустится автоматически)
```

**Подключение к PostgreSQL напрямую:**

```bash
docker exec -it dzencode_db psql -U user -d inventory_db
```

---

## 📁 Переменные окружения

| Переменная | Описание | Пример |
|-----------|----------|--------|
| `DB_USER` | Пользователь PostgreSQL | `user` |
| `DB_PASSWORD` | Пароль PostgreSQL | `password` |
| `DB_NAME` | Имя базы данных | `inventory_db` |
| `NEXT_PORT` | Порт фронтенда | `3000` |
| `NEST_PORT` | Порт бэкенда | `3001` |
| `NODE_ENV` | Окружение | `development` |
| `DATABASE_URL` | Строка подключения к БД | `postgresql://user:password@localhost:5432/inventory_db` |
| `REDIS_URL` | Строка подключения к Redis | `redis://localhost:6379` |
| `NEXT_PUBLIC_API_URL` | GraphQL URL для браузера | `http://localhost:3001/graphql` |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.io URL для браузера | `http://localhost:3001` |
| `INTERNAL_API_URL` | GraphQL URL для SSR (внутри Docker) | `http://api:3001/graphql` |
| `BASE_URL` | CORS origin для NestJS | `http://localhost:3000` |
