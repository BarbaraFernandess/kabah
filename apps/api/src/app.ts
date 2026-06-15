/**
 * @file app.ts
 * @description Express application factory.
 *
 * Configures middleware, mounts all routers and registers the central error
 * handler. Exported as a named `app` so that both `main.ts` (server) and test
 * files can import it.
 */

import express from 'express';
import cors from 'cors';
import { authRouter } from './modules/auth/auth.router.js';
import { analysisRouter } from './modules/analysis/analysis.router.js';
import { reportRouter } from './modules/reports/report.router.js';
import { adminRouter } from './modules/admin/admin.router.js';
import { errorHandler } from './shared/errors.js';
import { logger } from './shared/logger.js';

export const app = express();

// ─── Core middleware ──────────────────────────────────────────────────────────

const corsOrigin = process.env['CORS_ORIGIN'] ?? 'http://localhost:5173';

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Request logger ───────────────────────────────────────────────────────────

app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/auth', authRouter);
app.use('/api/analyses', analysisRouter);
app.use('/api/analyses', reportRouter);
app.use('/api/admin', adminRouter);

// ─── Health check ─────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Centralized error handler (must be last) ─────────────────────────────────

app.use(errorHandler);
