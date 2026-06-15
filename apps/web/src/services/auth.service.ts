import api from './api'
import type { User } from '../types'

export type LoginResponse = {
  token: string
  user: User
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password })
    return data
  },

  async register(name: string, email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/register', { name, email, password })
    return data
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>('/auth/me')
    return data
  },

  logout(): void {
    localStorage.removeItem('token')
  },
}
