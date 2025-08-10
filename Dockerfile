
# ---------- deps ----------
FROM node:20-alpine AS deps
WORKDIR /app
# Enable corepack for pnpm/yarn if needed
RUN corepack enable || true
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
# Prefer npm if no lockfiles available
RUN if [ -f pnpm-lock.yaml ]; then corepack use pnpm && pnpm i --frozen-lockfile;     elif [ -f yarn.lock ]; then corepack use yarn && yarn --frozen-lockfile;     elif [ -f package-lock.json ]; then npm ci;     else npm i; fi

# ---------- builder ----------
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma client (no DB needed for codegen)
RUN npx prisma generate
RUN npm run build

# ---------- runner ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
# Copy app artifacts
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh
USER nextjs
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
