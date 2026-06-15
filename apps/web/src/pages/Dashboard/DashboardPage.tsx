import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useAnalysis } from '../../hooks/useAnalysis'
import { Layout } from '../../components/Layout/Layout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'

export function DashboardPage() {
  const { user } = useAuth()
  const { analyses, isLoading, error, fetchAll } = useAnalysis()

  useEffect(() => {
    void fetchAll()
  }, [fetchAll])

  const recent = analyses.slice(0, 3)

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">
              Bem-vindo, <span className="text-amber-400">{user?.name ?? '...'}</span>
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Sua jornada numerológica começa aqui
            </p>
          </div>
          <Link to="/new">
            <Button size="lg">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Nova Análise
            </Button>
          </Link>
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-200">Análises Recentes</h2>
            <Link to="/history" className="text-sm text-amber-400 hover:underline">
              Ver histórico completo →
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <Card className="text-center py-8 text-red-400">{error}</Card>
          ) : recent.length === 0 ? (
            <Card className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <svg className="h-12 w-12 text-zinc-600" viewBox="0 0 100 100" fill="none">
                  <polygon points="50,10 90,80 10,80" stroke="currentColor" strokeWidth="4"/>
                  <polygon points="50,90 10,20 90,20" stroke="currentColor" strokeWidth="4"/>
                </svg>
                <div>
                  <p className="text-zinc-300 font-medium">Nenhuma análise ainda</p>
                  <p className="text-zinc-500 text-sm mt-1">Crie sua primeira análise numerológica</p>
                </div>
                <Link to="/new">
                  <Button>Criar Análise</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((analysis) => (
                <Link key={analysis.id} to={`/analysis/${analysis.id}`}>
                  <Card className="hover:border-amber-500 transition-colors group h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-zinc-100 group-hover:text-amber-400 transition-colors">
                          {analysis.birthName}
                        </p>
                        {analysis.currentName && (
                          <p className="text-xs text-zinc-500 mt-0.5">{analysis.currentName}</p>
                        )}
                      </div>
                      <span className="text-2xl font-bold text-amber-400 font-serif">
                        {analysis.result.destiny.result}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs text-zinc-400">
                      <span>
                        Destino: <strong className="text-amber-400">{analysis.result.destiny.result}</strong>
                      </span>
                      <span>
                        Missão: <strong className="text-amber-400">{analysis.result.mission.result}</strong>
                      </span>
                      <span>
                        Alma: <strong className="text-amber-400">{analysis.result.soul.result}</strong>
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-3">
                      {new Date(analysis.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <Card className="text-center py-6">
            <div className="text-3xl font-bold text-amber-400 font-serif">{analyses.length}</div>
            <div className="text-sm text-zinc-400 mt-1">Análises realizadas</div>
          </Card>
          <Card className="text-center py-6">
            <div className="text-3xl font-bold text-amber-400 font-serif">16</div>
            <div className="text-sm text-zinc-400 mt-1">Cálculos por análise</div>
          </Card>
          <Card className="text-center py-6">
            <div className="text-3xl font-bold text-amber-400 font-serif">∞</div>
            <div className="text-sm text-zinc-400 mt-1">Possibilidades</div>
          </Card>
        </section>
      </div>
    </Layout>
  )
}
