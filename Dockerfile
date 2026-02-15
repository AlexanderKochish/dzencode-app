FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN npm install -g turbo
WORKDIR /app

FROM base AS pruner
COPY . .
RUN turbo prune @dzencode/web @dzencode/server --docker

FROM base AS builder
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./
RUN npm install

COPY --from=pruner /app/out/full/ .
COPY .gitignore .gitignore

RUN npx turbo run generate

RUN npx turbo run build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app .


COPY --from=pruner --chown=nextjs:nodejs /app/docker-entrypoint.sh ./docker-entrypoint.sh


RUN sed -i 's/\r$//' ./docker-entrypoint.sh && \
    chmod +x ./docker-entrypoint.sh

USER nextjs

EXPOSE 3000 3001

ENTRYPOINT ["/bin/sh", "./docker-entrypoint.sh"]