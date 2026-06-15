import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../../components/Layout/Layout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { useAnalysis } from '../../hooks/useAnalysis'

export function HistoryPage() {
  const { analyses, isLoading, error, fetchAll, remove } = useAnalysis()

  useEffect(() => {
    void fetchAll()
  }, [fetchAll])

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Excluir análise de "${name}"?`)) return
    await remove(id)
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Histórico de Análises</h1>
            <p className="mt-1 text-sm text-zinc-400">
              {analyses.length > 0
                ? `${analyses.length} análise${analyses.length !== 1 ? 's' : ''} realizadas`
                : 'Nenhuma análise ainda'}
            </p>
          </div>
          <Link to="/new">
            <Button>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Nova Análise
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <Card className="text-center py-8 text-red-400">{error}</Card>
        ) : analyses.length === 0 ? (
          <Card className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <svg className="h-12 w-12 text-zinc-600" viewBox="0 0 100 100" fill="none">
                <polygon points="50,10 90,80 10,80" stroke="currentColor" strokeWidth="4"/>
                <polygon points="50,90 10,20 90,20" stroke="currentColor" strokeWidth="4"/>
              </svg>
              <div>
                <p className="text-zinc-300 font-medium">Nenhuma análise encontrada</p>
                <p className="text-zinc-500 text-sm mt-1">Crie sua primeira análise numerológica</p>
              </div>
              <Link to="/new">
                <Button>Criar Análise</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-700 bg-zinc-800/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider hidden sm:table-cell">
                    Nascimento
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Destino
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider hidden md:table-cell">
                    Missão
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider hidden md:table-cell">
                    Alma
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider hidden lg:table-cell">
                    Data da Análise
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {analyses.map((analysis) => (
                  <tr
                    key={analysis.id}
                    className="bg-zinc-900 hover:bg-zinc-800 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-zinc-100">{analysis.birthName}</p>
                        {analysis.currentName && (
                          <p className="text-xs text-zinc-500 mt-0.5">{analysis.currentName}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-400 hidden sm:table-cell">
                      {String(analysis.birthDay).padStart(2,'0')}/{String(analysis.birthMonth).padStart(2,'0')}/{analysis.birthYear}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xl font-bold text-amber-400 font-serif">
                        {analysis.result.destiny.result}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <span className="text-xl font-bold text-amber-400 font-serif">
                        {analysis.result.mission.result}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <span className="text-xl font-bold text-amber-400 font-serif">
                        {analysis.result.soul.result}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400 hidden lg:table-cell">
                      {new Date(analysis.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/analysis/${analysis.id}`}>
                          <Button variant="ghost" size="sm">Ver</Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => void handleDelete(analysis.id, analysis.birthName)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}
