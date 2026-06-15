/**
 * Personal Periods (Períodos Pessoais) Calculator
 *
 *   Ano Pessoal  = dia(nascimento) + mês(nascimento) + anoAtual  → reduzido
 *   Mês Pessoal  = AnoPessoal + mêsAtual                         → reduzido
 *   Dia Pessoal  = MêsPessoal + diaAtual                         → reduzido
 */

import type { BirthDate, CalculationTrace, PersonalPeriods } from '../types/index.js';
import { reduce, isMasterNumber, reduceWithKarmicCheck } from './base.calculator.js';
import type { CalculationStep } from '../types/index.js';

function buildSimpleTrace(
  rawSum: number,
  steps: CalculationStep[],
  formula: string,
  note: string,
): CalculationTrace {
  const { result, karmicDebt } = reduceWithKarmicCheck(rawSum);

  return {
    result,
    isMasterNumber: isMasterNumber(result),
    ...(karmicDebt !== undefined && { karmicDebt }),
    formula,
    steps: [
      ...steps,
      {
        description: karmicDebt
          ? `Débito kármico ${karmicDebt} → redução final`
          : 'Redução final',
        value: result,
      },
    ],
    methodologicalNote: note,
  };
}

/**
 * Calculate Personal Periods (Ano, Mês and Dia Pessoal).
 *
 * @param birthDate      Birth date (day and month used for Personal Year).
 * @param referenceDate  The date to compute periods for.
 */
export function calculatePersonalPeriods(
  birthDate: BirthDate,
  referenceDate: BirthDate,
): PersonalPeriods {
  const { day: bDay, month: bMonth } = birthDate;
  const { day: rDay, month: rMonth, year: rYear } = referenceDate;

  // --- Personal Year ---
  const pyRaw =
    String(bDay)
      .split('')
      .reduce((a, d) => a + Number(d), 0) +
    String(bMonth)
      .split('')
      .reduce((a, d) => a + Number(d), 0) +
    String(rYear)
      .split('')
      .reduce((a, d) => a + Number(d), 0);

  const pySteps: CalculationStep[] = [
    { description: `Dia de nascimento: ${bDay}`, value: bDay },
    { description: `Mês de nascimento: ${bMonth}`, value: bMonth },
    { description: `Ano atual: ${rYear}`, value: rYear },
    {
      description: `Soma dos dígitos: ${pyRaw}`,
      value: pyRaw,
    },
  ];

  const personalYear = buildSimpleTrace(
    pyRaw,
    pySteps,
    `dígitos(${bDay}) + dígitos(${bMonth}) + dígitos(${rYear}) = ${pyRaw}`,
    'Ano Pessoal: dia e mês de nascimento + ano atual, todos os dígitos somados e reduzidos.',
  );

  // --- Personal Month ---
  const pmRaw = personalYear.result + rMonth;

  const pmSteps: CalculationStep[] = [
    { description: `Ano Pessoal: ${personalYear.result}`, value: personalYear.result },
    { description: `Mês atual: ${rMonth}`, value: rMonth },
    {
      description: `Soma: ${personalYear.result} + ${rMonth} = ${pmRaw}`,
      value: pmRaw,
    },
  ];

  const personalMonth = buildSimpleTrace(
    pmRaw,
    pmSteps,
    `AnoPessoal(${personalYear.result}) + MêsAtual(${rMonth}) = ${pmRaw}`,
    'Mês Pessoal: Ano Pessoal + mês atual, reduzidos.',
  );

  // --- Personal Day ---
  const pdRaw = personalMonth.result + rDay;

  const pdSteps: CalculationStep[] = [
    { description: `Mês Pessoal: ${personalMonth.result}`, value: personalMonth.result },
    { description: `Dia atual: ${rDay}`, value: rDay },
    {
      description: `Soma: ${personalMonth.result} + ${rDay} = ${pdRaw}`,
      value: pdRaw,
    },
  ];

  const personalDay = buildSimpleTrace(
    pdRaw,
    pdSteps,
    `MêsPessoal(${personalMonth.result}) + DiaAtual(${rDay}) = ${pdRaw}`,
    'Dia Pessoal: Mês Pessoal + dia atual, reduzidos.',
  );

  return {
    personalYear,
    personalMonth,
    personalDay,
    referenceDate,
  };
}
