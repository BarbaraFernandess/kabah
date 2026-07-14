/**
 * @file client.ts
 * @description Singleton Prisma Client instance.
 *
 * Reusing a single PrismaClient across the app avoids exhausting the DB
 * connection pool during hot-reloads in development.
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../shared/logger.js';

// SQLite stores JSON as TEXT; this extension auto-parses them on every read.
const buildClient = () =>
  new PrismaClient({
    log: process.env['NODE_ENV'] === 'development' ? ['query', 'warn', 'error'] : ['error'],
  }).$extends({
    result: {
      analysis: {
        nicknames: {
          needs: { nicknames: true },
          compute: (d) => JSON.parse(d.nicknames) as string[],
        },
        result: {
          needs: { result: true },
          compute: (d) => JSON.parse(d.result) as unknown,
        },
      },
      interpretation: {
        strengths: {
          needs: { strengths: true },
          compute: (d) => JSON.parse(d.strengths) as string[],
        },
        challenges: {
          needs: { challenges: true },
          compute: (d) => JSON.parse(d.challenges) as string[],
        },
        keywords: {
          needs: { keywords: true },
          compute: (d) => JSON.parse(d.keywords) as string[],
        },
      },
      numerologyConfig: {
        value: {
          needs: { value: true },
          compute: (d) => JSON.parse(d.value) as unknown,
        },
      },
    },
  });

type ExtendedPrismaClient = ReturnType<typeof buildClient>;

declare global {
  // eslint-disable-next-line no-var
  var __prisma: ExtendedPrismaClient | undefined;
}

const createPrismaClient = (): ExtendedPrismaClient => {
  const client = buildClient();
  client.$connect().then(() => {
    logger.info('Database connected');
  }).catch((err: unknown) => {
    logger.error('Database connection failed', err);
  });
  return client;
};

export const prisma: ExtendedPrismaClient =
  process.env['NODE_ENV'] === 'production'
    ? createPrismaClient()
    : (global.__prisma ??= createPrismaClient());
