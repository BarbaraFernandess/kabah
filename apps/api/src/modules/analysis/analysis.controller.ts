/**
 * @file analysis.controller.ts
 * @description HTTP handlers for /api/analyses endpoints.
 *
 * @openapi
 * /api/analyses:
 *   post:
 *     summary: Create a new numerology analysis
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [birthName, birthDay, birthMonth, birthYear]
 *             properties:
 *               birthName:
 *                 type: string
 *               currentName:
 *                 type: string
 *               nicknames:
 *                 type: array
 *                 items:
 *                   type: string
 *               birthDay:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 31
 *               birthMonth:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *               birthYear:
 *                 type: integer
 *                 minimum: 1900
 *               referenceDay:
 *                 type: integer
 *               referenceMonth:
 *                 type: integer
 *               referenceYear:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized
 *
 *   get:
 *     summary: List all analyses for the authenticated user
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *
 * /api/analyses/{id}:
 *   get:
 *     summary: Get a single analysis by ID
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *
 *   delete:
 *     summary: Delete an analysis by ID
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No Content
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */

import type { Request, Response, NextFunction } from 'express';
import * as analysisService from './analysis.service.js';
import { createAnalysisSchema, parseOrThrow } from '../../shared/validation.js';

export async function createAnalysisHandler(
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

    const body = parseOrThrow(createAnalysisSchema, req.body);
    const analysis = await analysisService.createAnalysis(userId, body);
    res.status(201).json({ success: true, data: { analysis } });
  } catch (err) {
    next(err);
  }
}

export async function listAnalysesHandler(
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

    const analyses = await analysisService.listAnalyses(userId);
    res.json({ success: true, data: { analyses } });
  } catch (err) {
    next(err);
  }
}

export async function getAnalysisHandler(
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

    const { id } = req.params;
    if (id === undefined) {
      res.status(400).json({ success: false, error: 'ID inválido' });
      return;
    }

    const analysis = await analysisService.getAnalysis(userId, id);
    res.json({ success: true, data: { analysis } });
  } catch (err) {
    next(err);
  }
}

export async function deleteAnalysisHandler(
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

    const { id } = req.params;
    if (id === undefined) {
      res.status(400).json({ success: false, error: 'ID inválido' });
      return;
    }

    await analysisService.deleteAnalysis(userId, id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
