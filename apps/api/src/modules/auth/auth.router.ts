/**
 * @file auth.router.ts
 * @description Express router for /api/auth endpoints.
 */

import { Router } from 'express';
import { registerHandler, loginHandler, meHandler } from './auth.controller.js';
import { requireAuth } from './auth.middleware.js';

export const authRouter = Router();

/** POST /api/auth/register */
authRouter.post('/register', registerHandler);

/** POST /api/auth/login */
authRouter.post('/login', loginHandler);

/** GET /api/auth/me */
authRouter.get('/me', requireAuth, meHandler);
