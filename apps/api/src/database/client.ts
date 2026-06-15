/**
 * @file client.ts
 * @description Singleton Prisma Client instance.
 *
 * Reusing a single PrismaClient across the app avoids exhausting the DB
 * connection pool during hot-reloads in development.
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../shared/logger.js';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const createPrismaClient = (): PrismaClient => {
  const client = new PrismaClient({
    log: process.env['NODE_ENV'] === 'development' ? ['query', 'warn', 'error'] : ['error'],
  });

  client.$connect().then(() => {
    logger.info('Database connected');
  }).catch((err: unknown) => {
    logger.error('Database connection failed', err);
  });

  return client;
};

export const prisma: PrismaClient =
  process.env['NODE_ENV'] === 'production'
    ? createPrismaClient()
    : (global.__prisma ??= createPrismaClient());
