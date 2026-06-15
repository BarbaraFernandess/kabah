import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Layout } from '../../components/Layout/Layout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { NumerologyCard } from '../../components/NumerologyCard/NumerologyCard'
import { LifeCycleTimeline } from '../../components/LifeCycleTimeline/LifeCycleTimeline'
import { CalculationTrace } from '../../components/CalculationTrace/CalculationTrace'
import { useAnalysis } from '../../hooks/useAnalysis'

const ALL_LESSONS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export function AnalysisDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { current, isLoading, error, fetchById } = useAnalysis()

  useEffect(() => {
    if (id) void fetchById(id)
  }, [id, fetchById])

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-24">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    )
  }

  if (error || !current) {
    return (
      <Layout>
        <Card className="text-center py-12">
          <p className="text-red-400">{error ?? 'Análise não encontrada.'}</p>
          <Link to="/" className="mt-4 inline-block text-amber-400 hover:underline">
            Voltar ao início
          </Link>
        </Card>
      </Layout>
    )
  }

  const { result } = current
  const today = new Date()
  const currentAge = today.getFullYear() - current.birthYear

  const formatDate = (d: { day: number; month: number; year: number }) =>
    `${String(d.day).padStart(2, '0')}/${String(d.month).padStart(2, '0')}/${d.year}`

  return (
    <Layout>
      <div className="space-y-10 print:space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4 print:hidden">
          <div>
            <div className="flex items-center gap-2 text-sm text-zinc-500 mb-1">
              <Link to="/" className="hover:text-amber-400 transition-colors">Início</Link>
              <span>→</span>
              <Link to="/history" className="hover:text-amber-400 transition-colors">Histórico</Link>
              <span>→</span>
              <span className="text-zinc-300">{current.birthName}</span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-100">{current.birthName}</h1>
            {current.currentName && (
              <p className="text-sm text-zinc-400 mt-0.5">Nome atual: {current.currentName}</p>
            )}
            <p className="text-sm text-zinc-500 mt-0.5">
              Nascimento: {`${String(current.birthDay).padStart(2,'0')}/${String(current.birthMonth).padStart(2,'0')}/${current.birthYear}`}
              {' · '}Análise em {new Date(current.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <Button variant="secondary" onClick={() => window.print()}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Exportar PDF
          </Button>
        </div>

        <div className="print:block hidden">
          <h1 className="text-2xl font-bold">{current.birthName}</h1>
          <p className="text-sm text-gray-500">Análise de Numerologia Cabalística</p>
        </div>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-4">
            Números Principais
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <NumerologyCard title="Destino" trace={result.destiny} description="O propósito de vida definido pela data de nascimento" />
            <NumerologyCard title="Missão" trace={result.mission} description="A missão espiritual definida pelo nome de nascimento" />
            <NumerologyCard title="Alma" trace={result.soul} description="Os desejos mais profundos da alma (vogais)" />
            <NumerologyCard title="Personalidade" trace={result.personality} description="Como você aparece ao mundo externo (consoantes)" />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-4">
            Números Complementares
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <NumerologyCard title="Expressão" trace={result.expression} description="Talentos e capacidades naturais" />
            <NumerologyCard title="Motivação" trace={result.motivation} description="O que te move e inspira" />
            <NumerologyCard title="Impressão" trace={result.impression} description="A impressão que você causa nos outros" />
            <NumerologyCard title="Maturidade" trace={result.maturity} description="O número que emergirá na segunda metade da vida" />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-4">Lições Kármicas</h2>
          <Card>
            <p className="text-xs text-zinc-500 mb-4">
              Os números ausentes no nome indicam lições que a alma precisa aprender nesta encarnação.
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_LESSONS.map((n) => {
                const isAbsent = result.karmicLessons.includes(n)
                return (
                  <span
                    key={n}
                    className={[
                      'inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm',
                      isAbsent
                        ? 'bg-red-600 text-white'
                        : 'bg-zinc-700 text-zinc-300',
                    ].join(' ')}
                    title={isAbsent ? `${n} — Lição kármica (ausente)` : `${n} — Presente`}
                  >
                    {n}
                  </span>
                )
              })}
            </div>
            {result.karmicLessons.length === 0 && (
              <p className="text-sm text-zinc-400 mt-3">
                Nenhuma lição kármica identificada — todos os números estão presentes no nome.
              </p>
            )}
            {result.karmicLessons.length > 0 && (
              <p className="text-sm text-zinc-400 mt-3">
                Lições a desenvolver: {result.karmicLessons.join(', ')}
              </p>
            )}
          </Card>
        </section>

        {result.karmicDebts.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-zinc-200 mb-4">Débitos Kármicos</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {result.karmicDebts.map((debt, i) => (
                <Card key={i} className="border-red-900/50">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white">
                      Débito {debt.original}
                    </span>
                    <span className="text-zinc-400 text-sm">→ reduz para {debt.number}</span>
                  </div>
                  <CalculationTrace trace={debt.trace} label="Ver detalhes" />
                </Card>
              ))}
            </div>
          </section>
        )}

        {result.hiddenTendencies.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-zinc-200 mb-4">Tendências Ocultas</h2>
            <Card>
              <p className="text-xs text-zinc-500 mb-4">
                Números que aparecem com alta frequência no nome, revelando tendências latentes.
              </p>
              <div className="space-y-2">
                {result.hiddenTendencies.map((t, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center font-bold text-amber-400 text-sm">
                      {t.number}
                    </span>
                    <div className="flex-1 bg-zinc-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${Math.min(100, t.frequency * 15)}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-400 w-20 text-right">
                      {t.frequency}x no nome
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-4">Ciclos de Vida</h2>
          <LifeCycleTimeline cycles={result.lifeCycles} currentAge={currentAge} />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-4">Desafios</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {result.challenges.map((challenge, i) => (
              <Card key={i}>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2">
                  {i < 2 ? `${i + 1}º Desafio` : i === 2 ? 'Desafio Principal' : `${i + 1}º Desafio`}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-3xl font-bold text-amber-400 font-serif">
                    {challenge.number}
                  </span>
                  <span className="text-sm text-zinc-300">{challenge.name}</span>
                </div>
                <CalculationTrace trace={challenge.trace} />
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-4">Períodos Pessoais</h2>
          <p className="text-xs text-zinc-500 mb-4">
            Referência: {formatDate(result.personalPeriods.referenceDate)}
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2">Ano Pessoal</p>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl font-bold text-amber-400 font-serif">
                  {result.personalPeriods.personalYear.result}
                </span>
              </div>
              <CalculationTrace trace={result.personalPeriods.personalYear} />
            </Card>
            <Card>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2">Mês Pessoal</p>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl font-bold text-amber-400 font-serif">
                  {result.personalPeriods.personalMonth.result}
                </span>
              </div>
              <CalculationTrace trace={result.personalPeriods.personalMonth} />
            </Card>
            <Card>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2">Dia Pessoal</p>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl font-bold text-amber-400 font-serif">
                  {result.personalPeriods.personalDay.result}
                </span>
              </div>
              <CalculationTrace trace={result.personalPeriods.personalDay} />
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-4">Análise do Nome</h2>
          <Card>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Nome Original</p>
                <p className="text-zinc-100">{result.nameAnalysis.originalName}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Nome Normalizado</p>
                <p className="text-zinc-100 font-mono">{result.nameAnalysis.normalizedName}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Vogais</p>
                <p className="text-amber-400 font-mono">{result.nameAnalysis.vowels.join(' ')}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Consoantes</p>
                <p className="text-zinc-300 font-mono">{result.nameAnalysis.consonants.join(' ')}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-700">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Valores das Letras</p>
              <div className="flex flex-wrap gap-2">
                {result.nameAnalysis.letterValues.map((lv, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center bg-zinc-900 rounded-lg px-2 py-1.5 min-w-[2.5rem]"
                  >
                    <span className="text-xs text-amber-400 font-bold">{lv.value}</span>
                    <span className="text-xs text-zinc-300 font-mono">{lv.letter}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-700">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Frequência dos Números</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(result.nameAnalysis.numberFrequency).map(([num, freq]) => (
                  <div key={num} className="flex items-center gap-1 bg-zinc-900 rounded-full px-3 py-1">
                    <span className="text-sm font-bold text-amber-400">{num}</span>
                    <span className="text-xs text-zinc-400">×{freq}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>
      </div>
    </Layout>
  )
}
