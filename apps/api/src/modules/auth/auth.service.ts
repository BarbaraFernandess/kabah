/**
 * @file auth.service.ts
 * @description Authentication business logic — register, login, profile.
 *
 * @openapi
 * components:
 *   schemas:
 *     AuthUserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         name:
 *           type: string
 *         role:
 *           type: string
 *           enum: [USER, ADMIN]
 *         createdAt:
 *           type: string
 *           format: date-time
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/AuthUserResponse'
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../database/client.js';
import { ConflictError, UnauthorizedError } from '../../shared/errors.js';
import type { JwtPayload } from '../../types/index.js';

const SALT_ROUNDS = 12;

function getJwtSecret(): string {
  const secret = process.env['JWT_SECRET'];
  if (!secret) throw new Error('JWT_SECRET environment variable is not set');
  return secret;
}

function getJwtExpiresIn(): string {
  return process.env['JWT_EXPIRES_IN'] ?? '7d';
}

function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: getJwtExpiresIn(),
  } as jwt.SignOptions);
}

type SafeUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
};

function sanitizeUser(user: {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
}): SafeUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  };
}

// ─── Register ─────────────────────────────────────────────────────────────────

export async function register(
  email: string,
  password: string,
  name: string,
): Promise<{ token: string; user: SafeUser }> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing !== null) {
    throw new ConflictError('E-mail já cadastrado', 'EMAIL_TAKEN');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { email, passwordHash, name },
  });

  const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
  const token = signToken(payload);

  return { token, user: sanitizeUser(user) };
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(
  email: string,
  password: string,
): Promise<{ token: string; user: SafeUser }> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user === null) {
    throw new UnauthorizedError('Credenciais inválidas', 'INVALID_CREDENTIALS');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError('Credenciais inválidas', 'INVALID_CREDENTIALS');
  }

  const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
  const token = signToken(payload);

  return { token, user: sanitizeUser(user) };
}

// ─── Me ───────────────────────────────────────────────────────────────────────

export async function getMe(
  userId: string,
): Promise<SafeUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user === null) {
    throw new UnauthorizedError('Usuário não encontrado', 'USER_NOT_FOUND');
  }
  return sanitizeUser(user);
}
