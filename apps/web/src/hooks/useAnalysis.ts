import { useCallback, useState } from 'react'
import type { Analysis } from '../types'
import { analysisService } from '../services/analysis.service'
import type { CreateAnalysisInput } from '../services/analysis.service'

export function useAnalysis() {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [current, setCurrent] = useState<Analysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await analysisService.getAll()
      setAnalyses(data)
    } catch {
      setError('Erro ao carregar análises.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchById = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await analysisService.getById(id)
      setCurrent(data)
    } catch {
      setError('Erro ao carregar análise.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const create = useCallback(async (input: CreateAnalysisInput): Promise<Analysis> => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await analysisService.create(input)
      setAnalyses((prev) => [data, ...prev])
      return data
    } catch {
      setError('Erro ao criar análise.')
      throw new Error('Erro ao criar análise.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const remove = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await analysisService.delete(id)
      setAnalyses((prev) => prev.filter((a) => a.id !== id))
    } catch {
      setError('Erro ao remover análise.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { analyses, current, isLoading, error, fetchAll, fetchById, create, remove }
}
