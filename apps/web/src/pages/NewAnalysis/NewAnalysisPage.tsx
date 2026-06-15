import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../../components/Layout/Layout'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { useAnalysis } from '../../hooks/useAnalysis'
import axios from 'axios'

type NicknameEntry = { id: number; value: string }

function parseBirthDate(raw: string): { day: number; month: number; year: number } | null {
  const parts = raw.split('/')
  if (parts.length !== 3) return null
  const [day, month, year] = parts.map(Number)
  if (!day || !month || !year || year < 1900 || year > 2100) return null
  if (day < 1 || day > 31 || month < 1 || month > 12) return null
  return { day, month, year }
}

export function NewAnalysisPage() {
  const navigate = useNavigate()
  const { create, isLoading } = useAnalysis()

  const [birthName, setBirthName] = useState('')
  const [currentName, setCurrentName] = useState('')
  const [birthDateRaw, setBirthDateRaw] = useState('')
  const [nicknames, setNicknames] = useState<NicknameEntry[]>([])
  const [nicknameCounter, setNicknameCounter] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const addNickname = () => {
    setNicknames((prev) => [...prev, { id: nicknameCounter, value: '' }])
    setNicknameCounter((c) => c + 1)
  }

  const removeNickname = (id: number) => {
    setNicknames((prev) => prev.filter((n) => n.id !== id))
  }

  const updateNickname = (id: number, value: string) => {
    setNicknames((prev) => prev.map((n) => (n.id === id ? { ...n, value } : n)))
  }

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!birthName.trim()) errors.birthName = 'Nome completo de nascimento é obrigatório'
    const parsed = parseBirthDate(birthDateRaw)
    if (!birthDateRaw) {
      errors.birthDate = 'Data de nascimento é obrigatória'
    } else if (!parsed) {
      errors.birthDate = 'Data inválida. Use o formato DD/MM/AAAA'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!validate()) return

    const parsed = parseBirthDate(birthDateRaw)!
    const filteredNicknames = nicknames.map((n) => n.value).filter(Boolean)

    try {
      const analysis = await create({
        birthName: birthName.trim(),
        currentName: currentName.trim() || undefined,
        nicknames: filteredNicknames.length > 0 ? filteredNicknames : undefined,
        birthDay: parsed.day,
        birthMonth: parsed.month,
        birthYear: parsed.year,
      })
      navigate(`/analysis/${analysis.id}`)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Erro ao calcular análise. Tente novamente.')
      } else {
        setError('Erro inesperado. Tente novamente.')
      }
    }
  }

  const formatBirthDate = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 2) return digits
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Nova Análise</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Preencha os dados para calcular sua numerologia cabalística completa
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">
              Dados Pessoais
            </h2>
            <div className="space-y-4">
              <Input
                id="birthName"
                label="Nome completo de nascimento *"
                placeholder="Ex: Maria Aparecida da Silva"
                value={birthName}
                onChange={(e) => setBirthName(e.target.value)}
                error={fieldErrors.birthName}
                autoComplete="off"
              />
              <Input
                id="currentName"
                label="Nome atual (opcional)"
                placeholder="Ex: Maria Silva"
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                autoComplete="off"
              />
              <Input
                id="birthDate"
                label="Data de nascimento *"
                placeholder="DD/MM/AAAA"
                value={birthDateRaw}
                onChange={(e) => setBirthDateRaw(formatBirthDate(e.target.value))}
                error={fieldErrors.birthDate}
                maxLength={10}
                inputMode="numeric"
              />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
                Apelidos (opcional)
              </h2>
              <Button type="button" variant="ghost" size="sm" onClick={addNickname}>
                + Adicionar
              </Button>
            </div>
            {nicknames.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-4">
                Nenhum apelido adicionado
              </p>
            ) : (
              <div className="space-y-3">
                {nicknames.map((n) => (
                  <div key={n.id} className="flex gap-2">
                    <Input
                      placeholder="Apelido"
                      value={n.value}
                      onChange={(e) => updateNickname(n.id, e.target.value)}
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => removeNickname(n.id)}
                      className="flex-shrink-0 text-zinc-500 hover:text-red-400 transition-colors p-2"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {error && (
            <div className="rounded-lg bg-red-900/30 border border-red-700 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => window.history.back()}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" size="lg" isLoading={isLoading}>
              Calcular Numerologia
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
