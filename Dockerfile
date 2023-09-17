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

COPY --from=builder --chown=nextjs:nodejs /app/node_modules   ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next          ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public         ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json   ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./next.config.js

# timezones are always fun 🤡
RUN apk add --no-cache tzdata
ENV TZ Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

USER nextjs

EXPOSE 3000

CMD ["./node_modules/next/dist/bin/next", "start"]
