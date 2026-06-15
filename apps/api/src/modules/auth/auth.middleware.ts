/**
 * @file auth.middleware.ts
 * @description JWT authentication middleware and role guard.
 *
 * Usage:
 *   router.get('/protected', requireAuth, handler);
 *   router.delete('/admin', requireAuth, requireRole('ADMIN'), handler);
 */

import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../../shared/errors.js';
import type { JwtPayload, AuthUser } from '../../types/index.js';

// Extend Express Request to carry the authenticated user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

function getJwtSecret(): string {
  const secret = process.env['JWT_SECRET'];
  if (!secret) throw new Error('JWT_SECRET environment variable is not set');
  return secret;
}

/**
 * Middleware that requires a valid Bearer JWT.
 * Attaches the decoded user to `req.user`.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token de autenticação não fornecido', 'MISSING_TOKEN');
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, getJwtSecret()) as JwtPayload;
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch {
    throw new UnauthorizedError('Token inválido ou expirado', 'INVALID_TOKEN');
  }
}

/**
 * Role guard middleware factory. Must be used AFTER `requireAuth`.
 */
export function requireRole(role: string) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (req.user === undefined) {
      throw new UnauthorizedError('Não autenticado', 'NOT_AUTHENTICATED');
    }
    if (req.user.role !== role) {
      throw new ForbiddenError(
        'Você não tem permissão para acessar este recurso',
        'FORBIDDEN',
      );
    }
    next();
  };
}
