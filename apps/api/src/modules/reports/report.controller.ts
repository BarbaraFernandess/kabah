/**
 * @file report.controller.ts
 * @description HTTP handlers for report endpoints.
 *
 * @openapi
 * /api/analyses/{id}/report:
 *   get:
 *     summary: Generate a JSON report for an analysis
 *     tags: [Reports]
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
 *         description: OK — full numerology report as JSON
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *
 * /api/analyses/{id}/pdf:
 *   get:
 *     summary: Generate a printable HTML/PDF for an analysis
 *     tags: [Reports]
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
 *         description: OK — HTML document (print-ready)
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */

import type { Request, Response, NextFunction } from 'express';
import * as reportService from './report.service.js';

export async function getReportHandler(
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

    const report = await reportService.generateReport(userId, id);
    res.json({ success: true, data: { report } });
  } catch (err) {
    next(err);
  }
}

export async function getPdfHandler(
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

    const html = await reportService.generatePdf(userId, id);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    next(err);
  }
}
