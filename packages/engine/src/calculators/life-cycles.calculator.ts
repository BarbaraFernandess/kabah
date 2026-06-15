/**
 * Life Cycles (Ciclos de Vida) Calculator
 *
 * Three cycles are derived from the birth date:
 *
 *   1st Cycle (Formativo):  number of MONTH (reduced).
 *                           Starts at age 0, ends at (36 - Destiny) years.
 *   2nd Cycle (Produtivo):  number of DAY (reduced).
 *                           Starts where 1st ends, lasts 27 years.
 *   3rd Cycle (Colheita):   number of YEAR (reduced).
 *                           Starts where 2nd ends, never ends (endAge = null).
 */

import type { BirthDate, CalculationTrace, LifeCycle } from '../types/index.js';
import { reduce, isMasterNumber } from './base.calculator.js';
import type { CalculationStep } from '../types/index.js';

function reduceDatePart(
  value: number,
  label: string,
): { reduced: number; steps: CalculationStep[] } {
  const steps: CalculationStep[] = [];
  const reduced = reduce(value);

  if (value > 9) {
    const digitsStr = String(value).split('').join('+');
    const firstSum = String(value)
      .split('')
      .reduce((acc, d) => acc + Number(d), 0);
    steps.push({
      description: `${label}: ${digitsStr} = ${firstSum}`,
      value: firstSum,
    });
    if (reduced !== firstSum) {
      steps.push({
        description: `${label} reduzido: ${reduced}`,
        value: reduced,
      });
    }
  } else {
    steps.push({ description: `${label}: ${value}`, value: reduced });
  }

  return { reduced, steps };
}

function buildCycleTrace(
  reduced: number,
  steps: CalculationStep[],
  label: string,
  formula: string,
): CalculationTrace {
  return {
    result: reduced,
    isMasterNumber: isMasterNumber(reduced),
    formula,
    steps: [
      ...steps,
      { description: `Número do ciclo ${label}`, value: reduced },
    ],
    methodologicalNote: `Ciclo de vida ${label}: número reduzido extraído da data de nascimento.`,
  };
}

/**
 * Calculate the three Life Cycles.
 *
 * @param birthDate     Birth date.
 * @param destinyResult Already-reduced Destiny number (used to compute 1st cycle end age).
 */
export function calculateLifeCycles(
  birthDate: BirthDate,
  destinyResult: number,
): LifeCycle[] {
  const { day, month, year } = birthDate;

  const monthResult = reduceDatePart(month, 'Mês');
  const dayResult = reduceDatePart(day, 'Dia');
  const yearResult = reduceDatePart(year, 'Ano');

  // 1st Cycle: month reduced, ends at (36 - destiny)
  const firstEndAge = 36 - destinyResult;

  // 2nd Cycle: day reduced, starts at firstEndAge, lasts 27 years
  const secondStartAge = firstEndAge;
  const secondEndAge = firstEndAge + 27;

  // 3rd Cycle: year reduced, starts at secondEndAge, never ends
  const thirdStartAge = secondEndAge;

  return [
    {
      number: monthResult.reduced,
      isMasterNumber: isMasterNumber(monthResult.reduced),
      name: 'Formativo',
      startAge: 0,
      endAge: firstEndAge,
      trace: buildCycleTrace(
        monthResult.reduced,
        monthResult.steps,
        'Formativo (1º)',
        `Mês(${month})→${monthResult.reduced}; termina aos ${firstEndAge} anos (36 - Destino(${destinyResult}))`,
      ),
    },
    {
      number: dayResult.reduced,
      isMasterNumber: isMasterNumber(dayResult.reduced),
      name: 'Produtivo',
      startAge: secondStartAge,
      endAge: secondEndAge,
      trace: buildCycleTrace(
        dayResult.reduced,
        dayResult.steps,
        'Produtivo (2º)',
        `Dia(${day})→${dayResult.reduced}; dos ${secondStartAge} aos ${secondEndAge} anos (27 anos de duração)`,
      ),
    },
    {
      number: yearResult.reduced,
      isMasterNumber: isMasterNumber(yearResult.reduced),
      name: 'Colheita',
      startAge: thirdStartAge,
      endAge: null,
      trace: buildCycleTrace(
        yearResult.reduced,
        yearResult.steps,
        'Colheita (3º)',
        `Ano(${year})→${yearResult.reduced}; começa aos ${thirdStartAge} anos e dura o resto da vida`,
      ),
    },
  ];
}
