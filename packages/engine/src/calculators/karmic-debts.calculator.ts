/**
 * Karmic Debts (Débitos Kármicos) Aggregator
 *
 * Collects all karmic debts found across the primary calculations
 * (Destiny, Mission, Soul, Personality) and deduplicates by the
 * original debt number.
 */

import type { CalculationTrace } from '../types/index.js';

export type KarmicDebtEntry = {
  /** The reduced result (e.g. 5 for debt 14) */
  number: number;
  /** The pre-reduction debt value (13, 14, 16 or 19) */
  original: number;
  /** Trace of the calculation that produced the debt */
  trace: CalculationTrace;
};

/**
 * Aggregate karmic debts from a set of named calculation traces.
 *
 * @param traces  Map of calculation-name → CalculationTrace
 * @returns       Deduplicated array of KarmicDebtEntry, sorted by `original`.
 */
export function collectKarmicDebts(
  traces: Record<string, CalculationTrace>,
): KarmicDebtEntry[] {
  const seen = new Map<number, KarmicDebtEntry>();

  for (const trace of Object.values(traces)) {
    if (trace.karmicDebt !== undefined) {
      const debt = trace.karmicDebt;
      if (!seen.has(debt)) {
        seen.set(debt, {
          number: trace.result,
          original: debt,
          trace,
        });
      }
    }
  }

  return Array.from(seen.values()).sort((a, b) => a.original - b.original);
}
