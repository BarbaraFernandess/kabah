/**
 * @file report.service.ts
 * @description Report generation — JSON and PDF (HTML/CSS print placeholder).
 *
 * The JSON report is a curated view of the stored FullAnalysis, enriched with
 * human-readable interpretation data from the Interpretation table when available.
 *
 * The PDF implementation uses a basic HTML template with print-friendly CSS.
 * A production implementation should replace this with a headless Chromium or
 * Puppeteer-based renderer.
 */

import { prisma } from '../../database/client.js';
import { getAnalysis } from '../analysis/analysis.service.js';
import type { FullAnalysis, CalculationTrace } from '@kabah/engine';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CategoryKey =
  | 'destiny'
  | 'soul'
  | 'personality'
  | 'mission'
  | 'expression'
  | 'motivation'
  | 'impression'
  | 'maturity';

export type NumberSummary = {
  result: number;
  isMasterNumber: boolean;
  karmicDebt?: number;
  formula: string;
  interpretation?: {
    title: string;
    summary: string;
    keywords: string[];
  } | null;
};

export type FullReport = {
  analysisId: string;
  generatedAt: string;
  subject: {
    birthName: string;
    currentName: string | null;
    birthDate: string;
  };
  numbers: Record<CategoryKey, NumberSummary>;
  karmicLessons: number[];
  karmicDebts: { number: number; original: number }[];
  hiddenTendencies: { number: number; frequency: number }[];
  lifeCycles: { name: string; number: number; startAge: number; endAge: number | null }[];
  challenges: { name: string; number: number }[];
  personalPeriods: {
    personalYear: number;
    personalMonth: number;
    personalDay: number;
  };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function enrichWithInterpretation(
  category: CategoryKey,
  trace: CalculationTrace,
): Promise<NumberSummary> {
  const interpretation = await prisma.interpretation.findUnique({
    where: { category_number: { category, number: trace.result } },
    select: { title: true, summary: true, keywords: true },
  });

  return {
    result: trace.result,
    isMasterNumber: trace.isMasterNumber,
    ...(trace.karmicDebt !== undefined && { karmicDebt: trace.karmicDebt }),
    formula: trace.formula,
    interpretation: interpretation ?? null,
  };
}

// ─── JSON Report ──────────────────────────────────────────────────────────────

export async function generateReport(userId: string, analysisId: string): Promise<FullReport> {
  const analysis = await getAnalysis(userId, analysisId);
  const full = analysis.result as unknown as FullAnalysis;

  const categories: CategoryKey[] = [
    'destiny',
    'soul',
    'personality',
    'mission',
    'expression',
    'motivation',
    'impression',
    'maturity',
  ];

  const numberEntries = await Promise.all(
    categories.map(async (cat) => {
      const trace = full[cat];
      const summary = await enrichWithInterpretation(cat, trace);
      return [cat, summary] as [CategoryKey, NumberSummary];
    }),
  );

  const numbers = Object.fromEntries(numberEntries) as Record<CategoryKey, NumberSummary>;

  const { birthName, currentName, birthDay, birthMonth, birthYear } = analysis;

  return {
    analysisId,
    generatedAt: new Date().toISOString(),
    subject: {
      birthName,
      currentName,
      birthDate: `${String(birthDay).padStart(2, '0')}/${String(birthMonth).padStart(2, '0')}/${birthYear}`,
    },
    numbers,
    karmicLessons: full.karmicLessons,
    karmicDebts: full.karmicDebts.map((d) => ({ number: d.number, original: d.original })),
    hiddenTendencies: full.hiddenTendencies,
    lifeCycles: full.lifeCycles.map((lc) => ({
      name: lc.name,
      number: lc.number,
      startAge: lc.startAge,
      endAge: lc.endAge,
    })),
    challenges: full.challenges.map((c) => ({ name: c.name, number: c.number })),
    personalPeriods: {
      personalYear: full.personalPeriods.personalYear.result,
      personalMonth: full.personalPeriods.personalMonth.result,
      personalDay: full.personalPeriods.personalDay.result,
    },
  };
}

// ─── PDF (HTML placeholder) ───────────────────────────────────────────────────

export async function generatePdf(userId: string, analysisId: string): Promise<string> {
  const report = await generateReport(userId, analysisId);

  const numberRows = (Object.entries(report.numbers) as [CategoryKey, NumberSummary][])
    .map(
      ([cat, n]) => `
      <tr>
        <td>${cat}</td>
        <td><strong>${n.result}${n.isMasterNumber ? ' ✦' : ''}</strong></td>
        <td>${n.karmicDebt !== undefined ? `Débito: ${n.karmicDebt}` : '—'}</td>
        <td>${n.interpretation?.title ?? '—'}</td>
        <td>${n.interpretation?.summary ?? '—'}</td>
      </tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Mapa Numerológico — ${report.subject.birthName}</title>
  <style>
    @media print { body { margin: 0; } .no-print { display: none; } }
    body { font-family: Georgia, serif; max-width: 900px; margin: 40px auto; color: #1a1a1a; }
    h1 { text-align: center; font-size: 1.8rem; margin-bottom: 4px; }
    .subtitle { text-align: center; color: #666; font-size: 0.9rem; margin-bottom: 32px; }
    section { margin-bottom: 32px; }
    h2 { border-bottom: 1px solid #ddd; padding-bottom: 6px; font-size: 1.2rem; }
    table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    th, td { padding: 8px 12px; border: 1px solid #e0e0e0; text-align: left; }
    th { background: #f5f5f5; font-weight: 600; }
    .badge { display: inline-block; background: #8b6914; color: #fff; border-radius: 4px; padding: 2px 6px; font-size: 0.75rem; }
    footer { text-align: center; font-size: 0.75rem; color: #999; margin-top: 48px; }
  </style>
</head>
<body>
  <h1>Mapa Numerológico Cabalístico</h1>
  <p class="subtitle">
    ${report.subject.birthName}
    ${report.subject.currentName !== null ? `· Nome atual: ${report.subject.currentName}` : ''}
    · Nascimento: ${report.subject.birthDate}
  </p>

  <section>
    <h2>Números Principais</h2>
    <table>
      <thead>
        <tr>
          <th>Categoria</th>
          <th>Número</th>
          <th>Débito Kármico</th>
          <th>Título</th>
          <th>Resumo</th>
        </tr>
      </thead>
      <tbody>${numberRows}</tbody>
    </table>
  </section>

  <section>
    <h2>Ciclos de Vida</h2>
    <table>
      <thead><tr><th>Ciclo</th><th>Número</th><th>Faixa etária</th></tr></thead>
      <tbody>
        ${report.lifeCycles
          .map(
            (lc) => `<tr>
            <td>${lc.name}</td>
            <td>${lc.number}</td>
            <td>${lc.startAge}${lc.endAge !== null ? ` – ${lc.endAge}` : '+'} anos</td>
          </tr>`,
          )
          .join('')}
      </tbody>
    </table>
  </section>

  <section>
    <h2>Desafios</h2>
    <table>
      <thead><tr><th>Desafio</th><th>Número</th></tr></thead>
      <tbody>
        ${report.challenges
          .map((c) => `<tr><td>${c.name}</td><td>${c.number}</td></tr>`)
          .join('')}
      </tbody>
    </table>
  </section>

  <section>
    <h2>Períodos Pessoais</h2>
    <table>
      <thead><tr><th>Período</th><th>Número</th></tr></thead>
      <tbody>
        <tr><td>Ano Pessoal</td><td>${report.personalPeriods.personalYear}</td></tr>
        <tr><td>Mês Pessoal</td><td>${report.personalPeriods.personalMonth}</td></tr>
        <tr><td>Dia Pessoal</td><td>${report.personalPeriods.personalDay}</td></tr>
      </tbody>
    </table>
  </section>

  ${
    report.karmicLessons.length > 0
      ? `<section>
      <h2>Lições Kármicas</h2>
      <p>${report.karmicLessons.map((n) => `<span class="badge">${n}</span>`).join(' ')}</p>
    </section>`
      : ''
  }

  ${
    report.karmicDebts.length > 0
      ? `<section>
      <h2>Débitos Kármicos</h2>
      <p>${report.karmicDebts.map((d) => `<span class="badge">${d.original} → ${d.number}</span>`).join(' ')}</p>
    </section>`
      : ''
  }

  ${
    report.hiddenTendencies.length > 0
      ? `<section>
      <h2>Tendências Ocultas</h2>
      <p>${report.hiddenTendencies.map((t) => `<span class="badge">${t.number} (×${t.frequency})</span>`).join(' ')}</p>
    </section>`
      : ''
  }

  <footer>
    Gerado em ${new Date(report.generatedAt).toLocaleString('pt-BR')} · Kabah · Numerologia Cabalística (Método Sonia Café)
  </footer>
</body>
</html>`;
}
