/**
 * @file analysis.service.ts
 * @description Business logic for creating, listing and deleting analyses.
 *
 * Imports NumerologyEngine from @kabah/engine and delegates all calculations
 * to it. The full FullAnalysis result is serialised and stored as JSON in the
 * `result` column of the Analysis table.
 */

import { NumerologyEngine } from '@kabah/engine';
import type { AnalysisInput } from '@kabah/engine';
import { prisma } from '../../database/client.js';
import { NotFoundError, ForbiddenError } from '../../shared/errors.js';

const engine = new NumerologyEngine();

// Derive types from Prisma's generated return types to avoid named model imports
// that only exist after `prisma generate`.
type AnalysisRecord = NonNullable<Awaited<ReturnType<typeof prisma.analysis.findUnique>>>;

/** Shape returned by list endpoints (without the heavy `result` JSON). */
export type AnalysisSummary = Omit<AnalysisRecord, 'result'>;

// ─── Create ───────────────────────────────────────────────────────────────────

export type CreateAnalysisInput = {
  birthName: string;
  currentName?: string | undefined;
  nicknames?: string[] | undefined;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  referenceDay?: number | undefined;
  referenceMonth?: number | undefined;
  referenceYear?: number | undefined;
};

export async function createAnalysis(
  userId: string,
  input: CreateAnalysisInput,
): Promise<AnalysisRecord> {
  const analysisInput: AnalysisInput = {
    birthName: input.birthName,
    birthDate: {
      day: input.birthDay,
      month: input.birthMonth,
      year: input.birthYear,
    },
  };

  if (input.currentName !== undefined) {
    analysisInput.currentName = input.currentName;
  }

  if (input.nicknames !== undefined) {
    analysisInput.nicknames = input.nicknames;
  }

  if (
    input.referenceDay !== undefined &&
    input.referenceMonth !== undefined &&
    input.referenceYear !== undefined
  ) {
    analysisInput.referenceDate = {
      day: input.referenceDay,
      month: input.referenceMonth,
      year: input.referenceYear,
    };
  }

  const fullAnalysis = engine.analyze(analysisInput);

  const analysis = await prisma.analysis.create({
    data: {
      userId,
      birthName: input.birthName,
      ...(input.currentName !== undefined ? { currentName: input.currentName } : {}),
      nicknames: input.nicknames ?? [],
      birthDay: input.birthDay,
      birthMonth: input.birthMonth,
      birthYear: input.birthYear,
      result: fullAnalysis as unknown as object,
    },
  });

  return analysis;
}

// ─── List (user's own) ────────────────────────────────────────────────────────

export async function listAnalyses(userId: string): Promise<AnalysisSummary[]> {
  return prisma.analysis.findMany({
    where: { userId },
    select: {
      id: true,
      userId: true,
      birthName: true,
      currentName: true,
      nicknames: true,
      birthDay: true,
      birthMonth: true,
      birthYear: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

// ─── Get one ──────────────────────────────────────────────────────────────────

export async function getAnalysis(userId: string, id: string): Promise<AnalysisRecord> {
  const analysis = await prisma.analysis.findUnique({ where: { id } });

  if (analysis === null) {
    throw new NotFoundError('Análise não encontrada', 'ANALYSIS_NOT_FOUND');
  }

  if (analysis.userId !== userId) {
    throw new ForbiddenError('Sem permissão para acessar esta análise', 'FORBIDDEN');
  }

  return analysis;
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteAnalysis(userId: string, id: string): Promise<void> {
  const analysis = await prisma.analysis.findUnique({ where: { id } });

  if (analysis === null) {
    throw new NotFoundError('Análise não encontrada', 'ANALYSIS_NOT_FOUND');
  }

  if (analysis.userId !== userId) {
    throw new ForbiddenError('Sem permissão para excluir esta análise', 'FORBIDDEN');
  }

  await prisma.analysis.delete({ where: { id } });
}
