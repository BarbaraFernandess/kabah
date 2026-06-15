/**
 * Karmic Lessons (Lições Kármicas) Calculator
 *
 * Numbers 1-9 that are ABSENT from the birth name's letter values.
 * These represent areas where the person needs to develop during this lifetime.
 */

/**
 * Calculate the Karmic Lessons (Lições Kármicas) for a birth name.
 *
 * @param numberFrequency  Frequency map from NameAnalysis (digit → count).
 * @returns Sorted array of digits 1-9 that do not appear in the name.
 */
export function calculateKarmicLessons(
  numberFrequency: Record<number, number>,
): number[] {
  const lessons: number[] = [];

  for (let digit = 1; digit <= 9; digit++) {
    const freq = numberFrequency[digit];
    if (freq === undefined || freq === 0) {
      lessons.push(digit);
    }
  }

  return lessons;
}
