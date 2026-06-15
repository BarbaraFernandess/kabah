/**
 * @file admin.controller.ts
 * @description HTTP handlers for admin endpoints.
 *
 * @openapi
 * /api/admin/interpretations:
 *   get:
 *     summary: List all interpretations
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       403:
 *         description: Forbidden (ADMIN role required)
 *
 * /api/admin/interpretations/{id}:
 *   put:
 *     summary: Update an interpretation
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               summary:
 *                 type: string
 *               description:
 *                 type: string
 *               strengths:
 *                 type: array
 *                 items:
 *                   type: string
 *               challenges:
 *                 type: array
 *                 items:
 *                   type: string
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *               reference:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 *
 * /api/admin/config:
 *   get:
 *     summary: Get all config keys
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *
 * /api/admin/config/{key}:
 *   put:
 *     summary: Upsert a config key
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [value]
 *             properties:
 *               value: {}
 *     responses:
 *       200:
 *         description: OK
 */

import type { Request, Response, NextFunction } from 'express';
import * as adminService from './admin.service.js';
import {
  updateInterpretationSchema,
  updateConfigSchema,
  parseOrThrow,
} from '../../shared/validation.js';

export async function listInterpretationsHandler(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const interpretations = await adminService.listInterpretations();
    res.json({ success: true, data: { interpretations } });
  } catch (err) {
    next(err);
  }
}

export async function updateInterpretationHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    if (id === undefined) {
      res.status(400).json({ success: false, error: 'ID inválido' });
      return;
    }

    const body = parseOrThrow(updateInterpretationSchema, req.body);
    const interpretation = await adminService.updateInterpretation(id, body);
    res.json({ success: true, data: { interpretation } });
  } catch (err) {
    next(err);
  }
}

export async function getConfigHandler(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const config = await adminService.getConfig();
    res.json({ success: true, data: { config } });
  } catch (err) {
    next(err);
  }
}

export async function updateConfigHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { key } = req.params;
    if (key === undefined) {
      res.status(400).json({ success: false, error: 'Key inválida' });
      return;
    }

    const body = parseOrThrow(updateConfigSchema, req.body);
    const entry = await adminService.upsertConfigKey(key, body.value);
    res.json({ success: true, data: { config: entry } });
  } catch (err) {
    next(err);
  }
}
