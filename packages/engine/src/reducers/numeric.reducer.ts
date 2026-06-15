/**
 * Core numeric reduction logic for Kabalistic Numerology.
 * Implements the Sonia Café reduction rules:
 *   - Master numbers (11, 22, 33) are never reduced.
 *   - Karmic debt numbers (13, 14, 16, 19) are recorded before reduction.
 */

import { numerologyConfig } from '../config/numerology.config.js';

const { masterNumbers, karmicDebtNumbers } = numerologyConfig;

/** Returns true if `n` is a master number (11, 22, 33). */
export function isMasterNumber(n: number): boolean {
  return (masterNumbers as readonly number[]).includes(n);
}

/** Returns true if `n` is a karmic-debt number (13, 14, 16, 19). */
export function isKarmicDebt(n: number): boolean {
  return (karmicDebtNumbers as readonly number[]).includes(n);
}

/**
 * Recursively reduce `n` to a single digit, preserving master numbers.
 *
 * Examples:
 *   reduce(1)  → 1
 *   reduce(10) → 1
 *   reduce(11) → 11  (master)
 *   reduce(29) → 11  (2+9=11)
 *   reduce(99) → 9   (9+9=18 → 1+8=9)
 */
export function reduce(n: number): number {
  if (isMasterNumber(n)) return n;
  if (n <= 9) return n;

  const sum = String(n)
    .split('')
    .reduce((acc, digit) => acc + Number(digit), 0);

  return reduce(sum);
}

/**
 * Like `reduce`, but records a karmic debt if `n` is 13, 14, 16 or 19
 * before the reduction is applied.
 */
export function reduceWithKarmicCheck(n: number): {
  result: number;
  karmicDebt?: number;
} {
  if (isKarmicDebt(n)) {
    return { result: reduce(n), karmicDebt: n };
  }
  return { result: reduce(n) };
}

/**
 * Sum all digits of `n` (one level only, no recursion).
 * Used when building step-by-step traces.
 */
export function sumDigits(n: number): number {
  return String(n)
    .split('')
    .reduce((acc, d) => acc + Number(d), 0);
}
