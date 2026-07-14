/**
 * @file admin.service.ts
 * @description Business logic for admin-only endpoints.
 *
 * Manages Interpretation and NumerologyConfig records.
 */

import { prisma } from '../../database/client.js';
import { NotFoundError } from '../../shared/errors.js';

// Derive record types from Prisma's generated return types to avoid relying on
// named model exports that only exist after `prisma generate`.
type InterpretationRecord = Awaited<ReturnType<typeof prisma.interpretation.findFirst>>;
type NumerologyConfigRecord = Awaited<ReturnType<typeof prisma.numerologyConfig.findFirst>>;

// ─── Interpretations ──────────────────────────────────────────────────────────

export async function listInterpretations(): Promise<NonNullable<InterpretationRecord>[]> {
  return prisma.interpretation.findMany({
    orderBy: [{ category: 'asc' }, { number: 'asc' }],
  });
}

export type UpdateInterpretationInput = {
  title?: string | undefined;
  summary?: string | undefined;
  description?: string | undefined;
  strengths?: string[] | undefined;
  challenges?: string[] | undefined;
  keywords?: string[] | undefined;
  reference?: string | undefined;
};

export async function updateInterpretation(
  id: string,
  data: UpdateInterpretationInput,
): Promise<NonNullable<InterpretationRecord>> {
  const existing = await prisma.interpretation.findUnique({ where: { id } });
  if (existing === null) {
    throw new NotFoundError('Interpretação não encontrada', 'INTERPRETATION_NOT_FOUND');
  }

  // Build the update payload — only include keys that were explicitly provided
  const updatePayload: Record<string, unknown> = { updatedAt: new Date() };

  if (data.title !== undefined) updatePayload['title'] = data.title;
  if (data.summary !== undefined) updatePayload['summary'] = data.summary;
  if (data.description !== undefined) updatePayload['description'] = data.description;
  if (data.strengths !== undefined) updatePayload['strengths'] = JSON.stringify(data.strengths);
  if (data.challenges !== undefined) updatePayload['challenges'] = JSON.stringify(data.challenges);
  if (data.keywords !== undefined) updatePayload['keywords'] = JSON.stringify(data.keywords);
  if (data.reference !== undefined) updatePayload['reference'] = data.reference;

  return prisma.interpretation.update({
    where: { id },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: updatePayload as any,
  });
}

// ─── Config ───────────────────────────────────────────────────────────────────

export async function getConfig(): Promise<NonNullable<NumerologyConfigRecord>[]> {
  return prisma.numerologyConfig.findMany({
    orderBy: { key: 'asc' },
  });
}

export async function upsertConfigKey(
  key: string,
  value: unknown,
): Promise<NonNullable<NumerologyConfigRecord>> {
  return prisma.numerologyConfig.upsert({
    where: { key },
    create: { key, value: JSON.stringify(value), updatedAt: new Date() },
    update: { value: JSON.stringify(value), updatedAt: new Date() },
  });
}
