/**
 * Challenges (Desafios) Calculator
 *
 * Four challenges are derived from the birth date:
 *
 *   Desafio 1       = |Mês(reduzido) - Dia(reduzido)|
 *   Desafio 2       = |Dia(reduzido) - Ano(reduzido)|
 *   Desafio Principal = |Desafio1 - Desafio2|
 *   Desafio Final   = Mês(reduzido) + Dia(reduzido) + Ano(reduzido)  (no further reduction)
 */

import type { BirthDate, CalculationTrace, Challenge } from '../types/index.js';
import { reduce, isMasterNumber } from './base.calculator.js';
import type { CalculationStep } from '../types/index.js';

function reducePart(value: number): number {
  return reduce(value);
}

function buildChallengeTrace(
  result: number,
  steps: CalculationStep[],
  formula: string,
  note: string,
): CalculationTrace {
  return {
    result,
    isMasterNumber: isMasterNumber(result),
    formula,
    steps: [...steps, { description: 'Resultado', value: result }],
    methodologicalNote: note,
  };
}

/** Calculate the four Challenges (Desafios). */
export function calculateChallenges(birthDate: BirthDate): Challenge[] {
  const { day, month, year } = birthDate;

  const rMonth = reducePart(month);
  const rDay = reducePart(day);
  const rYear = reducePart(year);

  const challenge1 = Math.abs(rMonth - rDay);
  const challenge2 = Math.abs(rDay - rYear);
  const challengeMain = Math.abs(challenge1 - challenge2);
  const challengeFinal = rMonth + rDay + rYear; // NOT reduced further

  return [
    {
      number: challenge1,
      name: 'Desafio 1',
      trace: buildChallengeTrace(
        challenge1,
        [
          { description: `Mês reduzido: ${rMonth}`, value: rMonth },
          { description: `Dia reduzido: ${rDay}`, value: rDay },
          { description: `|${rMonth} - ${rDay}|`, value: challenge1 },
        ],
        `|Mês(${month})→${rMonth} - Dia(${day})→${rDay}| = ${challenge1}`,
        'Desafio 1: valor absoluto da diferença entre Mês e Dia (ambos reduzidos).',
      ),
    },
    {
      number: challenge2,
      name: 'Desafio 2',
      trace: buildChallengeTrace(
        challenge2,
        [
          { description: `Dia reduzido: ${rDay}`, value: rDay },
          { description: `Ano reduzido: ${rYear}`, value: rYear },
          { description: `|${rDay} - ${rYear}|`, value: challenge2 },
        ],
        `|Dia(${day})→${rDay} - Ano(${year})→${rYear}| = ${challenge2}`,
        'Desafio 2: valor absoluto da diferença entre Dia e Ano (ambos reduzidos).',
      ),
    },
    {
      number: challengeMain,
      name: 'Desafio Principal',
      trace: buildChallengeTrace(
        challengeMain,
        [
          { description: `Desafio 1: ${challenge1}`, value: challenge1 },
          { description: `Desafio 2: ${challenge2}`, value: challenge2 },
          { description: `|${challenge1} - ${challenge2}|`, value: challengeMain },
        ],
        `|Desafio1(${challenge1}) - Desafio2(${challenge2})| = ${challengeMain}`,
        'Desafio Principal: valor absoluto da diferença entre Desafio 1 e Desafio 2.',
      ),
    },
    {
      number: challengeFinal,
      name: 'Desafio Final',
      trace: buildChallengeTrace(
        challengeFinal,
        [
          { description: `Mês reduzido: ${rMonth}`, value: rMonth },
          { description: `Dia reduzido: ${rDay}`, value: rDay },
          { description: `Ano reduzido: ${rYear}`, value: rYear },
          {
            description: `${rMonth} + ${rDay} + ${rYear} = ${challengeFinal}`,
            value: challengeFinal,
          },
        ],
        `Mês(${month})→${rMonth} + Dia(${day})→${rDay} + Ano(${year})→${rYear} = ${challengeFinal}`,
        'Desafio Final: soma dos três componentes da data (reduzidos), sem redução adicional.',
      ),
    },
  ];
}
