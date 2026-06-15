/**
 * @file validation.ts
 * @description Zod schemas and validation helpers shared across modules.
 */

import { z } from 'zod';

// ─── Re-usable field schemas ──────────────────────────────────────────────────

export const emailSchema = z
  .string({ required_error: 'E-mail é obrigatório' })
  .email('E-mail inválido')
  .toLowerCase()
  .trim();

export const passwordSchema = z
  .string({ required_error: 'Senha é obrigatória' })
  .min(8, 'Senha deve ter ao menos 8 caracteres');

export const nameSchema = z
  .string({ required_error: 'Nome é obrigatório' })
  .min(2, 'Nome deve ter ao menos 2 caracteres')
  .trim();

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// ─── Analysis ─────────────────────────────────────────────────────────────────

export const createAnalysisSchema = z.object({
  birthName: z
    .string({ required_error: 'Nome de nascimento é obrigatório' })
    .min(2, 'Nome de nascimento deve ter ao menos 2 caracteres')
    .trim(),
  currentName: z.string().trim().optional(),
  nicknames: z.array(z.string().trim()).optional(),
  birthDay: z
    .number({ required_error: 'Dia de nascimento é obrigatório' })
    .int()
    .min(1)
    .max(31),
  birthMonth: z
    .number({ required_error: 'Mês de nascimento é obrigatório' })
    .int()
    .min(1)
    .max(12),
  birthYear: z
    .number({ required_error: 'Ano de nascimento é obrigatório' })
    .int()
    .min(1900)
    .max(new Date().getFullYear()),
  referenceDay: z.number().int().min(1).max(31).optional(),
  referenceMonth: z.number().int().min(1).max(12).optional(),
  referenceYear: z.number().int().min(1900).optional(),
});

// ─── Admin ────────────────────────────────────────────────────────────────────

export const updateInterpretationSchema = z.object({
  title: z.string().trim().min(1).optional(),
  summary: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  strengths: z.array(z.string().trim().min(1)).optional(),
  challenges: z.array(z.string().trim().min(1)).optional(),
  keywords: z.array(z.string().trim().min(1)).optional(),
  reference: z.string().trim().min(1).optional(),
});

export const updateConfigSchema = z.object({
  value: z.unknown(),
});

// ─── Helper: parse or throw ───────────────────────────────────────────────────

import { BadRequestError } from './errors.js';
import { ZodError } from 'zod';

/**
 * Parse `data` against `schema`. On failure, collects all Zod issues and
 * throws a `BadRequestError` with a human-readable message.
 */
export function parseOrThrow<T>(schema: z.ZodType<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (err) {
    if (err instanceof ZodError) {
      const message = err.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join('; ');
      throw new BadRequestError(message, 'VALIDATION_ERROR');
    }
    throw err;
  }
}
