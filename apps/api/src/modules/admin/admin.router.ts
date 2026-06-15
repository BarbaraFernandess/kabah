/**
 * @file admin.router.ts
 * @description Express router for /api/admin endpoints.
 *
 * All routes require JWT authentication AND the ADMIN role.
 */

import { Router } from 'express';
import {
  listInterpretationsHandler,
  updateInterpretationHandler,
  getConfigHandler,
  updateConfigHandler,
} from './admin.controller.js';
import { requireAuth, requireRole } from '../auth/auth.middleware.js';

export const adminRouter = Router();

// Apply auth + admin role to every route in this router
adminRouter.use(requireAuth, requireRole('ADMIN'));

/** GET /api/admin/interpretations */
adminRouter.get('/interpretations', listInterpretationsHandler);

/** PUT /api/admin/interpretations/:id */
adminRouter.put('/interpretations/:id', updateInterpretationHandler);

/** GET /api/admin/config */
adminRouter.get('/config', getConfigHandler);

/** PUT /api/admin/config/:key */
adminRouter.put('/config/:key', updateConfigHandler);
