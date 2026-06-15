/**
 * @file auth.test.ts
 * @description Unit tests for auth module (service logic only — no DB required).
 *
 * We mock PrismaClient and bcryptjs so these tests run without a real database.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mocks ────────────────────────────────────────────────────────────────────

// Mock the Prisma client singleton before any imports that use it
vi.mock('../src/database/client.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed_password'),
    compare: vi.fn(),
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn().mockReturnValue('mock.jwt.token'),
    verify: vi.fn(),
  },
}));

// ─── Imports (after mocks) ────────────────────────────────────────────────────

import { prisma } from '../src/database/client.js';
import * as authService from '../src/modules/auth/auth.service.js';
import { ConflictError, UnauthorizedError } from '../src/shared/errors.js';

// ─── Test setup ───────────────────────────────────────────────────────────────

const mockUser = {
  id: 'cuid_abc123',
  email: 'test@example.com',
  name: 'Test User',
  passwordHash: 'hashed_password',
  role: 'USER' as const,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
  analyses: [],
};

beforeEach(() => {
  vi.clearAllMocks();
  process.env['JWT_SECRET'] = 'test-secret-at-least-32-chars-long-xyz';
  process.env['JWT_EXPIRES_IN'] = '7d';
});

// ─── register ─────────────────────────────────────────────────────────────────

describe('authService.register', () => {
  it('creates a new user and returns token + user when email is available', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue(mockUser);

    const result = await authService.register('test@example.com', 'Password1!', 'Test User');

    expect(result.token).toBe('mock.jwt.token');
    expect(result.user.email).toBe('test@example.com');
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('throws ConflictError when email is already taken', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

    await expect(
      authService.register('test@example.com', 'Password1!', 'Test User'),
    ).rejects.toThrow(ConflictError);
  });
});

// ─── login ────────────────────────────────────────────────────────────────────

describe('authService.login', () => {
  it('returns token + user on valid credentials', async () => {
    const bcrypt = await import('bcryptjs');
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
    vi.mocked(bcrypt.default.compare).mockResolvedValue(true as never);

    const result = await authService.login('test@example.com', 'Password1!');

    expect(result.token).toBe('mock.jwt.token');
    expect(result.user.id).toBe('cuid_abc123');
  });

  it('throws UnauthorizedError when user is not found', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    await expect(authService.login('nope@example.com', 'Password1!')).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it('throws UnauthorizedError when password does not match', async () => {
    const bcrypt = await import('bcryptjs');
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
    vi.mocked(bcrypt.default.compare).mockResolvedValue(false as never);

    await expect(authService.login('test@example.com', 'WrongPass!')).rejects.toThrow(
      UnauthorizedError,
    );
  });
});

// ─── getMe ────────────────────────────────────────────────────────────────────

describe('authService.getMe', () => {
  it('returns the user when found', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

    const user = await authService.getMe('cuid_abc123');

    expect(user.id).toBe('cuid_abc123');
    expect(user).not.toHaveProperty('passwordHash');
  });

  it('throws UnauthorizedError when user is not found', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    await expect(authService.getMe('nonexistent')).rejects.toThrow(UnauthorizedError);
  });
});
