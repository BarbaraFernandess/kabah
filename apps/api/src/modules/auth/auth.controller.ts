/**
 * @file auth.controller.ts
 * @description HTTP handlers for authentication endpoints.
 *
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created — returns token and user
 *       409:
 *         description: Email already registered
 *
 * /api/auth/login:
 *   post:
 *     summary: Login with email + password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK — returns token and user
 *       401:
 *         description: Invalid credentials
 *
 * /api/auth/me:
 *   get:
 *     summary: Get authenticated user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK — returns user
 *       401:
 *         description: Unauthorized
 */

import type { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service.js';
import { registerSchema, loginSchema, parseOrThrow } from '../../shared/validation.js';

export async function registerHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = parseOrThrow(registerSchema, req.body);
    const result = await authService.register(body.email, body.password, body.name);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = parseOrThrow(loginSchema, req.body);
    const result = await authService.login(body.email, body.password);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function meHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (userId === undefined) {
      res.status(401).json({ success: false, error: 'Não autenticado' });
      return;
    }
    const user = await authService.getMe(userId);
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}
