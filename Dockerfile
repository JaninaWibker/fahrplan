FROM node:18-alpine AS base

# -- INSTALLING DEPENDENCIES --
FROM base AS deps
WORKDIR /app

# install pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm i --frozen-lockfile

# -- BUILDING --
FROM base AS builder
WORKDIR /app

# timezones are always fun 🤡
RUN apk add --no-cache tzdata
ENV TZ Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
# build the app
RUN npm run build

# -- RUNNER --
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser  --system --uid 1001 nextjs

COPY --from=builder /app/package.json .
COPY --from=builder /app/pnpm-lock.yaml .
COPY --from=builder /app/next.config.js .
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
