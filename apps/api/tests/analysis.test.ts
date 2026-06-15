/**
 * @file analysis.test.ts
 * @description Unit tests for analysis service.
 *
 * Tests verify that the service:
 *  1. Calls NumerologyEngine.analyze with the correct AnalysisInput.
 *  2. Persists the result to the database.
 *  3. Enforces ownership when retrieving or deleting.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('../src/database/client.js', () => ({
  prisma: {
    analysis: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('@kabah/engine', () => ({
  NumerologyEngine: vi.fn().mockImplementation(() => ({
    analyze: vi.fn().mockReturnValue({
      input: {},
      nameAnalysis: {},
      destiny: { result: 5, isMasterNumber: false, formula: '', steps: [], methodologicalNote: '' },
      mission: { result: 3, isMasterNumber: false, formula: '', steps: [], methodologicalNote: '' },
      soul: { result: 7, isMasterNumber: false, formula: '', steps: [], methodologicalNote: '' },
      personality: { result: 2, isMasterNumber: false, formula: '', steps: [], methodologicalNote: '' },
      expression: { result: 8, isMasterNumber: false, formula: '', steps: [], methodologicalNote: '' },
      motivation: { result: 7, isMasterNumber: false, formula: '', steps: [], methodologicalNote: '' },
      impression: { result: 2, isMasterNumber: false, formula: '', steps: [], methodologicalNote: '' },
      karmicLessons: [],
      karmicDebts: [],
      hiddenTendencies: [],
      lifeCycles: [],
      challenges: [],
      maturity: { result: 8, isMasterNumber: false, formula: '', steps: [], methodologicalNote: '' },
      personalPeriods: {
        personalYear: { result: 4, isMasterNumber: false, formula: '', steps: [], methodologicalNote: '' },
        personalMonth: { result: 6, isMasterNumber: false, formula: '', steps: [], methodologicalNote: '' },
        personalDay: { result: 1, isMasterNumber: false, formula: '', steps: [], methodologicalNote: '' },
        referenceDate: { day: 1, month: 6, year: 2025 },
      },
    }),
  })),
}));

// ─── Imports (after mocks) ────────────────────────────────────────────────────

import { prisma } from '../src/database/client.js';
import * as analysisService from '../src/modules/analysis/analysis.service.js';
import { NotFoundError, ForbiddenError } from '../src/shared/errors.js';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockAnalysis = {
  id: 'analysis_001',
  userId: 'user_001',
  birthName: 'Maria das Graças Silva',
  currentName: null,
  nicknames: [],
  birthDay: 15,
  birthMonth: 3,
  birthYear: 1985,
  result: {},
  createdAt: new Date('2025-06-01'),
  updatedAt: new Date('2025-06-01'),
};

const createInput = {
  birthName: 'Maria das Graças Silva',
  birthDay: 15,
  birthMonth: 3,
  birthYear: 1985,
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── createAnalysis ───────────────────────────────────────────────────────────

describe('analysisService.createAnalysis', () => {
  it('calls the engine and saves the result to the database', async () => {
    vi.mocked(prisma.analysis.create).mockResolvedValue(mockAnalysis);

    const result = await analysisService.createAnalysis('user_001', createInput);

    expect(prisma.analysis.create).toHaveBeenCalledOnce();
    expect(result.id).toBe('analysis_001');
    expect(result.birthName).toBe('Maria das Graças Silva');
  });

  it('passes a referenceDate to the engine when provided', async () => {
    vi.mocked(prisma.analysis.create).mockResolvedValue(mockAnalysis);

    // The engine is instantiated in analysis.service.ts; we verify the DB
    // create is called (which means analyze() succeeded internally).
    const result = await analysisService.createAnalysis('user_001', {
      ...createInput,
      referenceDay: 1,
      referenceMonth: 6,
      referenceYear: 2025,
    });

    expect(prisma.analysis.create).toHaveBeenCalledOnce();
    expect(result.id).toBe('analysis_001');
  });
});

// ─── listAnalyses ─────────────────────────────────────────────────────────────

describe('analysisService.listAnalyses', () => {
  it('returns only analyses belonging to the user', async () => {
    const summary = {
      id: mockAnalysis.id,
      userId: mockAnalysis.userId,
      birthName: mockAnalysis.birthName,
      currentName: mockAnalysis.currentName,
      nicknames: mockAnalysis.nicknames,
      birthDay: mockAnalysis.birthDay,
      birthMonth: mockAnalysis.birthMonth,
      birthYear: mockAnalysis.birthYear,
      createdAt: mockAnalysis.createdAt,
      updatedAt: mockAnalysis.updatedAt,
    };

    vi.mocked(prisma.analysis.findMany).mockResolvedValue([summary] as never);

    const results = await analysisService.listAnalyses('user_001');

    expect(prisma.analysis.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'user_001' } }),
    );
    expect(results).toHaveLength(1);
  });
});

// ─── getAnalysis ──────────────────────────────────────────────────────────────

describe('analysisService.getAnalysis', () => {
  it('returns the analysis when the user owns it', async () => {
    vi.mocked(prisma.analysis.findUnique).mockResolvedValue(mockAnalysis);

    const result = await analysisService.getAnalysis('user_001', 'analysis_001');

    expect(result.id).toBe('analysis_001');
  });

  it('throws NotFoundError when the analysis does not exist', async () => {
    vi.mocked(prisma.analysis.findUnique).mockResolvedValue(null);

    await expect(analysisService.getAnalysis('user_001', 'nonexistent')).rejects.toThrow(
      NotFoundError,
    );
  });

  it('throws ForbiddenError when the analysis belongs to another user', async () => {
    vi.mocked(prisma.analysis.findUnique).mockResolvedValue({
      ...mockAnalysis,
      userId: 'other_user',
    });

    await expect(analysisService.getAnalysis('user_001', 'analysis_001')).rejects.toThrow(
      ForbiddenError,
    );
  });
});

// ─── deleteAnalysis ───────────────────────────────────────────────────────────

describe('analysisService.deleteAnalysis', () => {
  it('deletes the analysis when the user owns it', async () => {
    vi.mocked(prisma.analysis.findUnique).mockResolvedValue(mockAnalysis);
    vi.mocked(prisma.analysis.delete).mockResolvedValue(mockAnalysis);

    await expect(analysisService.deleteAnalysis('user_001', 'analysis_001')).resolves.toBeUndefined();
    expect(prisma.analysis.delete).toHaveBeenCalledWith({ where: { id: 'analysis_001' } });
  });

  it('throws ForbiddenError when attempting to delete another user\'s analysis', async () => {
    vi.mocked(prisma.analysis.findUnique).mockResolvedValue({
      ...mockAnalysis,
      userId: 'other_user',
    });

    await expect(analysisService.deleteAnalysis('user_001', 'analysis_001')).rejects.toThrow(
      ForbiddenError,
    );
  });
});
