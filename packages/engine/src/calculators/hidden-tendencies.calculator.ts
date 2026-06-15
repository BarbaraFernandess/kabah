/**
 * Hidden Tendencies (Tendências Ocultas) Calculator
 *
 * Numbers that appear with frequency >= threshold (default 3) in the
 * birth name are considered "hidden tendencies" — energies that strongly
 * colour the person's character.
 */

import { numerologyConfig } from '../config/numerology.config.js';

const { hiddenTendencyThreshold } = numerologyConfig;

export type HiddenTendency = {
  number: number;
  frequency: number;
};

/**
 * Calculate Hidden Tendencies (Tendências Ocultas) for a birth name.
 *
 * @param numberFrequency  Frequency map from NameAnalysis (digit → count).
 * @param threshold        Minimum frequency to qualify (defaults to config value).
 * @returns Sorted array of { number, frequency } entries.
 */
export function calculateHiddenTendencies(
  numberFrequency: Record<number, number>,
  threshold: number = hiddenTendencyThreshold,
): HiddenTendency[] {
  const tendencies: HiddenTendency[] = [];

  for (let digit = 1; digit <= 9; digit++) {
    const freq = numberFrequency[digit] ?? 0;
    if (freq >= threshold) {
      tendencies.push({ number: digit, frequency: freq });
    }
  }

  return tendencies.sort((a, b) => a.number - b.number);
}
