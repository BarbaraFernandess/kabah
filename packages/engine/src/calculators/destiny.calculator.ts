/**
 * Destiny (Destino) Calculator
 *
 * Formula: reduce(day) + reduce(month) + reduce(year) → reduce with karmic check
 *
 * Example: born 15/03/1985
 *   day   = 1+5 = 6
 *   month = 3
 *   year  = 1+9+8+5 = 23 → 2+3 = 5
 *   sum   = 6+3+5 = 14 → karmic debt 14 → result 5
 */

import type { BirthDate, CalculationTrace } from '../types/index.js';
import { reduce, buildTrace, isMasterNumber } from './base.calculator.js';
import type { CalculationStep } from '../types/index.js';

/**
 * Sum the individual digits of `n` (single-level, no recursion) for tracing.
 */
function digitSum(n: number): number {
  return String(n)
    .split('')
    .reduce((acc, d) => acc + Number(d), 0);
}

/**
 * Reduce a date component (day, month or year) to a single digit or master
 * number, returning both the result and the intermediate steps.
 */
function reduceDatePart(
  value: number,
  label: string,
): { reduced: number; steps: CalculationStep[] } {
  const steps: CalculationStep[] = [];

  if (value > 9 && !isMasterNumber(value)) {
    const digitsStr = String(value).split('').join('+');
    const firstSum = digitSum(value);
    steps.push({
      description: `${label}: ${digitsStr} = ${firstSum}`,
      value: firstSum,
    });

    const reduced = reduce(firstSum);
    if (reduced !== firstSum) {
      steps.push({
        description: `${label} reduzido: ${reduced}`,
        value: reduced,
      });
    }
    return { reduced, steps };
  }

  const reduced = reduce(value);
  steps.push({ description: `${label}: ${value}`, value: reduced });
  return { reduced, steps };
}

/** Calculate the Destiny (Destino) number for a given birth date. */
export function calculateDestiny(birthDate: BirthDate): CalculationTrace {
  const { day, month, year } = birthDate;

  const dayResult = reduceDatePart(day, 'Dia');
  const monthResult = reduceDatePart(month, 'Mês');
  const yearResult = reduceDatePart(year, 'Ano');

  const allSteps: CalculationStep[] = [
    ...dayResult.steps,
    ...monthResult.steps,
    ...yearResult.steps,
  ];

  const rawSum = dayResult.reduced + monthResult.reduced + yearResult.reduced;
  allSteps.push({
    description: `Soma: ${dayResult.reduced} + ${monthResult.reduced} + ${yearResult.reduced} = ${rawSum}`,
    value: rawSum,
  });

  const formula = `dia(${day})→${dayResult.reduced} + mês(${month})→${monthResult.reduced} + ano(${year})→${yearResult.reduced} = ${rawSum}`;

  return buildTrace(
    rawSum,
    allSteps,
    formula,
    'Destino: soma dos dígitos do dia, mês e ano reduzidos individualmente. Verificar débitos kármicos antes da redução final.',
  );
}
