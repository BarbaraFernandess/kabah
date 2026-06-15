import type { Request, Response, NextFunction } from 'express'
import { logger } from './logger.js'

/**
 * Base application error with HTTP status code
 */
export class AppError extends Error {
  constructor(
    public override readonly message: string,
    public readonly statusCode: number,
    public readonly code?: string,
  ) {
    super(message)
    this.name = 'AppError'
    Error.captureStackTrace(this, this.constructor)
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', code?: string) {
    super(message, 400, code)
    this.name = 'BadRequestError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', code?: string) {
    super(message, 401, code)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', code?: string) {
    super(message, 403, code)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not Found', code?: string) {
    super(message, 404, code)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict', code?: string) {
    super(message, 409, code)
    this.name = 'ConflictError'
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error', code?: string) {
    super(message, 500, code)
    this.name = 'InternalServerError'
  }
}

/**
 * Centralized error handler middleware.
 * Must be registered as the last middleware in Express.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(err.code !== undefined && { code: err.code }),
    })
    return
  }

  // Zod validation errors bubble up as plain objects with a `issues` array
  if (
    err !== null &&
    typeof err === 'object' &&
    'issues' in err &&
    Array.isArray((err as { issues: unknown[] }).issues)
  ) {
    res.status(400).json({
      success: false,
      error: 'Validation error',
      issues: (err as { issues: unknown[] }).issues,
    })
    return
  }

  logger.error('Unhandled error', err)

  res.status(500).json({
    success: false,
    error: 'Internal server error',
  })
}
