/**
 * Maturity (Maturidade) Calculator
 *
 * Formula: Destiny + Mission → reduce with karmic check.
 * Becomes active at approximately 35 years of age.
 *
 * Example: destiny=5, mission=6 → 11 (master number)
 */

import type { CalculationTrace } from '../types/index.js';
import { buildTrace } from './base.calculator.js';
import type { CalculationStep } from '../types/index.js';

/**
 * Calculate the Maturity (Maturidade) number.
 *
 * @param destinyResult  Already-reduced Destiny number.
 * @param missionResult  Already-reduced Mission number.
 */
export function calculateMaturity(
  destinyResult: number,
  missionResult: number,
): CalculationTrace {
  const rawSum = destinyResult + missionResult;

  const steps: CalculationStep[] = [
    { description: `Destino: ${destinyResult}`, value: destinyResult },
    { description: `Missão: ${missionResult}`, value: missionResult },
    {
      description: `Soma: ${destinyResult} + ${missionResult} = ${rawSum}`,
      value: rawSum,
    },
  ];

  const formula = `Destino(${destinyResult}) + Missão(${missionResult}) = ${rawSum}`;

  return buildTrace(
    rawSum,
    steps,
    formula,
    'Maturidade: Destino + Missão reduzidos. Ativo a partir dos ~35 anos. Verificar débitos kármicos.',
  );
}
