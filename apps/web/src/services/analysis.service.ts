import api from './api'
import type { Analysis } from '../types'

export type CreateAnalysisInput = {
  birthName: string
  currentName?: string
  nicknames?: string[]
  birthDay: number
  birthMonth: number
  birthYear: number
}

export const analysisService = {
  async create(input: CreateAnalysisInput): Promise<Analysis> {
    const { data } = await api.post<Analysis>('/analyses', input)
    return data
  },

  async getAll(): Promise<Analysis[]> {
    const { data } = await api.get<Analysis[]>('/analyses')
    return data
  },

  async getById(id: string): Promise<Analysis> {
    const { data } = await api.get<Analysis>(`/analyses/${id}`)
    return data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/analyses/${id}`)
  },
}
