#!/bin/sh
set -e

echo "⏳ Ожидание базы данных..."
until nc -z db 5432; do
  sleep 1
done

if [ "$SERVICE_TYPE" = "server" ]; then
  echo "📦 [API] Подготовка базы..."
  if [ "$NODE_ENV" = "production" ]; then
    npx turbo run migrate:deploy --filter=@dzencode/db
  else
    npx turbo run push --filter=@dzencode/db -- --accept-data-loss
    npx turbo run seed --filter=@dzencode/db
  fi
  
  echo "🚀 [API] Запуск NestJS..."
  exec npx turbo run dev --filter=@dzencode/server
fi

if [ "$SERVICE_TYPE" = "web" ]; then
  echo "🚀 [WEB] Запуск Next.js..."
  exec npx turbo run dev --filter=@dzencode/web
fi