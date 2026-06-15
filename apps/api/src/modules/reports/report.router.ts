/**
 * @file report.router.ts
 * @description Express router for /api/analyses/:id/report and /pdf endpoints.
 *
 * Mounted at /api/analyses in app.ts so the full paths become:
 *   GET /api/analyses/:id/report
 *   GET /api/analyses/:id/pdf
 */

import { Router } from 'express';
import { getReportHandler, getPdfHandler } from './report.controller.js';
import { requireAuth } from '../auth/auth.middleware.js';

export const reportRouter = Router();

/** GET /api/analyses/:id/report */
reportRouter.get('/:id/report', requireAuth, getReportHandler);

/** GET /api/analyses/:id/pdf */
reportRouter.get('/:id/pdf', requireAuth, getPdfHandler);
