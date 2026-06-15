/**
 * Base utilities shared by all calculators.
 *
 * Provides helpers for building CalculationTrace objects step-by-step,
 * reducing sums with karmic-debt awareness, and formatting formulas.
 */

import type { CalculationStep, CalculationTrace } from '../types/index.js';
import { reduce, reduceWithKarmicCheck, isMasterNumber } from '../reducers/numeric.reducer.js';

export { reduce, reduceWithKarmicCheck, isMasterNumber };

/**
 * Reduce `total` and build a CalculationTrace from the provided steps.
 *
 * @param total          Raw sum before reduction
 * @param steps          Steps accumulated up to (and including) the raw sum
 * @param formula        Human-readable formula string
 * @param methodNote     Methodological reference
 * @param checkKarmic    Whether to check for karmic-debt numbers (default true)
 */
export function buildTrace(
  total: number,
  steps: CalculationStep[],
  formula: string,
  methodNote: string,
  checkKarmic = true,
): CalculationTrace {
  let result: number;
  let karmicDebt: number | undefined;

  if (checkKarmic) {
    const checked = reduceWithKarmicCheck(total);
    result = checked.result;
    karmicDebt = checked.karmicDebt;
  } else {
    result = reduce(total);
  }

  const allSteps: CalculationStep[] = [
    ...steps,
    {
      description: karmicDebt
        ? `Débito kármico detectado (${karmicDebt}) → redução final`
        : 'Redução final',
      value: result,
    },
  ];

  return {
    result,
    isMasterNumber: isMasterNumber(result),
    ...(karmicDebt !== undefined && { karmicDebt }),
    formula,
    steps: allSteps,
    methodologicalNote: methodNote,
  };
}

/**
 * Sum the values of the given letters and return the raw total along with
 * an array of steps for tracing.
 */
export function sumLetterValues(
  letterValues: { letter: string; value: number }[],
): { total: number; steps: CalculationStep[] } {
  const steps: CalculationStep[] = letterValues.map(({ letter, value }) => ({
    description: `${letter} = ${value}`,
    value,
  }));

  const total = letterValues.reduce((acc, { value }) => acc + value, 0);
  steps.push({ description: `Soma bruta`, value: total });

  return { total, steps };
}

/**
 * Build a formatted formula string from individual letter contributions.
 * e.g. "M(4) + A(1) + R(9) = 14"
 */
export function letterFormula(
  letterValues: { letter: string; value: number }[],
  total: number,
): string {
  const parts = letterValues.map(({ letter, value }) => `${letter}(${value})`);
  return `${parts.join(' + ')} = ${total}`;
}
