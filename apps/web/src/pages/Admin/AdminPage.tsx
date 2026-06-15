import { useEffect, useState, useCallback } from 'react'
import { Layout } from '../../components/Layout/Layout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { useAuth } from '../../hooks/useAuth'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import axios from 'axios'

type Interpretation = {
  id: string
  category: string
  number: number
  title: string
  description: string
}

const CATEGORIES = ['destino', 'missão', 'alma', 'personalidade', 'expressão', 'motivação', 'impressão', 'maturidade', 'ciclo', 'desafio', 'ano-pessoal', 'geral']

export function AdminPage() {
  const { user } = useAuth()
  const [interpretations, setInterpretations] = useState<Interpretation[]>([])
  const [filtered, setFiltered] = useState<Interpretation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState('')
  const [filterNumber, setFilterNumber] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Interpretation>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const fetchInterpretations = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data } = await api.get<Interpretation[]>('/admin/interpretations')
      setInterpretations(data)
      setFiltered(data)
    } catch {
      setError('Erro ao carregar interpretações.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchInterpretations()
  }, [fetchInterpretations])

  useEffect(() => {
    let result = interpretations
    if (filterCategory) {
      result = result.filter((i) => i.category === filterCategory)
    }
    if (filterNumber) {
      result = result.filter((i) => String(i.number) === filterNumber)
    }
    setFiltered(result)
  }, [filterCategory, filterNumber, interpretations])

  const startEdit = (interp: Interpretation) => {
    setEditingId(interp.id)
    setEditForm({ ...interp })
    setSaveError(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
    setSaveError(null)
  }

  const saveEdit = async () => {
    if (!editingId) return
    setIsSaving(true)
    setSaveError(null)
    try {
      const { data } = await api.put<Interpretation>(`/admin/interpretations/${editingId}`, editForm)
      setInterpretations((prev) => prev.map((i) => (i.id === editingId ? data : i)))
      setEditingId(null)
      setEditForm({})
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setSaveError(err.response?.data?.message ?? 'Erro ao salvar.')
      } else {
        setSaveError('Erro inesperado.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (user?.role !== 'ADMIN') {
    return (
      <Layout>
        <Card className="text-center py-12">
          <p className="text-red-400 font-medium">Acesso negado.</p>
          <p className="text-zinc-400 text-sm mt-1">Esta página é restrita a administradores.</p>
          <Link to="/" className="mt-4 inline-block text-amber-400 hover:underline">
            Voltar ao início
          </Link>
        </Card>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Painel Administrativo</h1>
          <p className="mt-1 text-sm text-zinc-400">Gerenciar interpretações numerológicas</p>
        </div>

        <Card>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[180px]">
              <label className="text-xs text-zinc-400 mb-1 block font-medium uppercase tracking-wider">
                Categoria
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">Todas</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[120px]">
              <Input
                label="Número"
                placeholder="Ex: 7"
                value={filterNumber}
                onChange={(e) => setFilterNumber(e.target.value)}
                inputMode="numeric"
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="ghost"
                onClick={() => { setFilterCategory(''); setFilterNumber('') }}
              >
                Limpar filtros
              </Button>
            </div>
          </div>
        </Card>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <Card className="text-center py-8 text-red-400">{error}</Card>
        ) : filtered.length === 0 ? (
          <Card className="text-center py-8 text-zinc-400">
            Nenhuma interpretação encontrada com os filtros aplicados.
          </Card>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-zinc-500">{filtered.length} interpretação(ões) encontrada(s)</p>
            {filtered.map((interp) => (
              <Card key={interp.id}>
                {editingId === interp.id ? (
                  <div className="space-y-4">
                    <div className="flex gap-3 flex-wrap">
                      <div className="flex-1 min-w-[140px]">
                        <label className="text-xs text-zinc-400 mb-1 block font-medium">Categoria</label>
                        <select
                          value={editForm.category ?? ''}
                          onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24">
                        <Input
                          label="Número"
                          value={String(editForm.number ?? '')}
                          onChange={(e) => setEditForm((f) => ({ ...f, number: Number(e.target.value) }))}
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                    <Input
                      label="Título"
                      value={editForm.title ?? ''}
                      onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                    />
                    <div>
                      <label className="text-xs text-zinc-400 mb-1 block font-medium">Descrição</label>
                      <textarea
                        value={editForm.description ?? ''}
                        onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                        rows={4}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-y"
                      />
                    </div>
                    {saveError && (
                      <div className="text-sm text-red-400 rounded-lg bg-red-900/20 border border-red-800 px-3 py-2">
                        {saveError}
                      </div>
                    )}
                    <div className="flex gap-2 justify-end">
                      <Button variant="secondary" size="sm" onClick={cancelEdit} disabled={isSaving}>
                        Cancelar
                      </Button>
                      <Button size="sm" onClick={() => void saveEdit()} isLoading={isSaving}>
                        Salvar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="rounded-full bg-zinc-700 px-2 py-0.5 text-xs text-zinc-300 font-mono">
                          {interp.category}
                        </span>
                        <span className="rounded-full bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 text-xs text-amber-400 font-bold">
                          {interp.number}
                        </span>
                      </div>
                      <p className="font-medium text-zinc-100 truncate">{interp.title}</p>
                      <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{interp.description}</p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => startEdit(interp)} className="shrink-0">
                      Editar
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
