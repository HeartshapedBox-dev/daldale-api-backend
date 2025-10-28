ARG NODE_IMAGE=node:20-slim

FROM ${NODE_IMAGE} AS base

RUN apt-get update && apt-get install -y procps

RUN npm install -g pnpm@9.12.2

# Development stage
FROM base AS development
WORKDIR /app
RUN chown -R node:node /app

COPY --chown=node:node package*.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies)
RUN pnpm fetch --frozen-lockfile
RUN pnpm install --frozen-lockfile

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

# Build stage
FROM base AS builder
WORKDIR /app

COPY --chown=node:node package*.json pnpm-lock.yaml ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node --from=development /app/src ./src
COPY --chown=node:node --from=development /app/tsconfig.json ./tsconfig.json
COPY --chown=node:node --from=development /app/tsconfig.build.json ./tsconfig.build.json
COPY --chown=node:node --from=development /app/nest-cli.json ./nest-cli.json
COPY --chown=node:node --from=development /app/env ./env
COPY --chown=node:node --from=development /app/src/modules/database/schema.prisma ./src/modules/database/schema.prisma

# Generate Prisma Client
RUN pnpm prisma:generate

# Build server
RUN pnpm build

# Removes unnecessary packages and re-install only production dependencies
ENV NODE_ENV production
RUN pnpm prune --prod
RUN pnpm fetch --frozen-lockfile
RUN pnpm install --frozen-lockfile --prod

USER node

# Production stage
FROM ${NODE_IMAGE} AS production
WORKDIR /app

RUN npm install -g pm2

RUN chown -R node:node /app

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/package.json ./
COPY --chown=node:node --from=builder /app/src/modules/database/schema.prisma ./src/modules/database/schema.prisma

USER node

# Prisma migrate는 런타임에 실행 (CMD 전에 스크립트로 처리)
CMD ["node", "dist/main.js"]

