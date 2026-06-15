import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import axios from 'axios'

type Mode = 'login' | 'register'

export function LoginPage() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(name, email, password)
      }
      navigate('/')
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Erro ao autenticar. Verifique suas credenciais.')
      } else {
        setError('Erro inesperado. Tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <svg className="h-16 w-16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="50,10 90,80 10,80" stroke="#fbbf24" strokeWidth="5"/>
              <polygon points="50,90 10,20 90,20" stroke="#fbbf24" strokeWidth="5"/>
              <circle cx="50" cy="50" r="5" fill="#fbbf24"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-amber-400 tracking-widest font-serif">KABAH</h1>
          <p className="mt-2 text-sm text-zinc-400">Numerologia Cabalística</p>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6">
          <div className="flex rounded-lg bg-zinc-900 p-1 mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null) }}
              className={[
                'flex-1 py-1.5 rounded-md text-sm font-medium transition-colors',
                mode === 'login'
                  ? 'bg-zinc-700 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200',
              ].join(' ')}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null) }}
              className={[
                'flex-1 py-1.5 rounded-md text-sm font-medium transition-colors',
                mode === 'register'
                  ? 'bg-zinc-700 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200',
              ].join(' ')}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <Input
                id="name"
                label="Nome"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            )}
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              id="password"
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />

            {error && (
              <div className="rounded-lg bg-red-900/30 border border-red-700 px-3 py-2 text-sm text-red-300">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              {mode === 'login' ? 'Entrar' : 'Criar conta'}
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-zinc-500">
          {mode === 'login' ? (
            <>
              Não tem conta?{' '}
              <Link
                to="#"
                onClick={() => setMode('register')}
                className="text-amber-400 hover:underline"
              >
                Cadastre-se
              </Link>
            </>
          ) : (
            <>
              Já tem conta?{' '}
              <Link
                to="#"
                onClick={() => setMode('login')}
                className="text-amber-400 hover:underline"
              >
                Entrar
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
