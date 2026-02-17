#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ]; then
  echo "✅ DATABASE_URL обнаружена. Проверка соединения..."
fi

if [ "$SERVICE_TYPE" = "server" ]; then
  echo "📦 [API] Подготовка базы..."
  
  if [ "$NODE_ENV" = "production" ]; then
    echo "🏗 Применение миграций..."
    npx turbo run migrate:deploy --filter=@dzencode/db
  else
    echo "🛠 Синхронизация схемы (dev)..."
    npx turbo run push --filter=@dzencode/db -- --skip-generate
    npx turbo run seed --filter=@dzencode/db
  fi
  
  echo "🚀 [API] Запуск сервера..."
  if [ "$NODE_ENV" = "production" ]; then
    exec npx turbo run start --filter=@dzencode/server
  else
    exec npx turbo run dev --filter=@dzencode/server
  fi
fi

if [ "$SERVICE_TYPE" = "web" ]; then
  echo "🚀 [WEB] Запуск Next.js..."
  if [ "$NODE_ENV" = "production" ]; then
    exec npx turbo run start --filter=@dzencode/web
  else
    exec npx turbo run dev --filter=@dzencode/web
  fi
fi

echo "❌ Ошибка: SERVICE_TYPE не определен (должен быть 'server' или 'web')"
exit 1