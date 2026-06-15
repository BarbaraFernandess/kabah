/**
 * @file analysis.router.ts
 * @description Express router for /api/analyses endpoints.
 */

import { Router } from 'express';
import {
  createAnalysisHandler,
  listAnalysesHandler,
  getAnalysisHandler,
  deleteAnalysisHandler,
} from './analysis.controller.js';
import { requireAuth } from '../auth/auth.middleware.js';

export const analysisRouter = Router();

/** POST /api/analyses */
analysisRouter.post('/', requireAuth, createAnalysisHandler);

/** GET /api/analyses */
analysisRouter.get('/', requireAuth, listAnalysesHandler);

/** GET /api/analyses/:id */
analysisRouter.get('/:id', requireAuth, getAnalysisHandler);

/** DELETE /api/analyses/:id */
analysisRouter.delete('/:id', requireAuth, deleteAnalysisHandler);
