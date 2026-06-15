FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# Install dependencies
FROM base AS deps
COPY package.json ./
COPY ../../packages/engine/package.json ../../packages/engine/
RUN pnpm install --frozen-lockfile

# Build stage
FROM deps AS builder
COPY . .
COPY ../../packages/engine ../../packages/engine
RUN pnpm run db:generate
RUN pnpm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY src/database/schema.prisma ./src/database/schema.prisma

EXPOSE 3001

CMD ["node", "dist/main.js"]
