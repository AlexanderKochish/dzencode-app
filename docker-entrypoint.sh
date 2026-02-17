#!/bin/sh
set -e

echo "🚀 SERVICE_TYPE=$SERVICE_TYPE | NODE_ENV=$NODE_ENV"

# ─── Dev: ensure node_modules exist (named volume may be empty on first run) ───
if [ "$NODE_ENV" != "production" ]; then
  if [ ! -d "/app/node_modules/@nestjs" ] && [ ! -d "/app/node_modules/next" ]; then
    echo "📦 Installing dependencies (first run or node_modules empty)..."
    npm install
  fi

  # Clear turbo cache and stale .next to avoid disk/cache issues
  echo "🧹 Clearing caches..."
  rm -rf /app/.turbo /app/node_modules/.cache/turbo /app/packages/db/.turbo
  rm -rf /app/apps/web/.next/cache /app/apps/web/.next/dev 2>/dev/null || true
fi

# ─── API service ───
if [ "$SERVICE_TYPE" = "server" ]; then
  echo "📦 Generating Prisma client & building db package..."

  # Force prisma to use container DATABASE_URL (not the one from packages/db/prisma/.env)
  cd /app/packages/db
  DATABASE_URL="$DATABASE_URL" npx prisma generate
  cd /app

  npx turbo run build --filter=@dzencode/db --force

  if [ "$NODE_ENV" = "production" ]; then
    echo "🗄️  Running migrations..."
    npx turbo run migrate:deploy --filter=@dzencode/db
    echo "✅ Starting server in production mode..."
    exec npx turbo run start --filter=@dzencode/server
  else
    echo "🗄️  Pushing schema to DB..."
    DATABASE_URL="$DATABASE_URL" npx turbo run push --filter=@dzencode/db -- --skip-generate
    echo "🌱 Seeding database..."
    DATABASE_URL="$DATABASE_URL" npx turbo run seed --filter=@dzencode/db
    echo "✅ Starting server in development mode..."
    exec npx turbo run dev --filter=@dzencode/server
  fi
fi

# ─── Web service ───
if [ "$SERVICE_TYPE" = "web" ]; then
  # In dev, also build db package for type imports
  if [ "$NODE_ENV" != "production" ]; then
    echo "📦 Building db package for types..."
    npx turbo run build --filter=@dzencode/db --force

    # Override .env files that conflict with Docker networking
    # Next.js .env.local takes highest priority over .env
    echo "🔧 Writing Docker-aware .env.local for Next.js..."
    cat > /app/apps/web/.env.local <<EOF
INTERNAL_API_URL=${INTERNAL_API_URL}
NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
NEXT_PUBLIC_SOCKET_URL=${NEXT_PUBLIC_SOCKET_URL}
EOF
    echo "   INTERNAL_API_URL=${INTERNAL_API_URL}"
  fi

  if [ "$NODE_ENV" = "production" ]; then
    echo "✅ Starting web in production mode..."
    exec npx turbo run start --filter=@dzencode/web
  else
    echo "⏳ Waiting for API to be ready..."
    MAX_RETRIES=30
    RETRY=0
    until node -e "fetch('http://api:3001/health').then(r=>{if(!r.ok)throw r;process.exit(0)}).catch(()=>process.exit(1))" 2>/dev/null; do
      RETRY=$((RETRY + 1))
      if [ "$RETRY" -ge "$MAX_RETRIES" ]; then
        echo "⚠️  API not ready after ${MAX_RETRIES} attempts, starting anyway..."
        break
      fi
      echo "   Waiting for API... ($RETRY/$MAX_RETRIES)"
      sleep 2
    done

    # Warm up API so first SSR request is fast
    echo "🔥 Warming up API..."
    node -e "
      Promise.all([
        fetch('http://api:3001/health'),
        fetch('http://api:3001/graphql', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({query:'{translations(locale:\"ru\"){key}}'})
        })
      ]).then(() => console.log('   API warmed up!')).catch(() => console.log('   Warmup skipped'))
    " 2>/dev/null || true

    echo "✅ Starting web in development mode..."
    exec npx turbo run dev --filter=@dzencode/web
  fi
fi

echo "❌ SERVICE_TYPE is not defined!"
exit 1
