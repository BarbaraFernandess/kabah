import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <svg className="h-7 w-7" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,10 90,80 10,80" stroke="#fbbf24" strokeWidth="5"/>
            <polygon points="50,90 10,20 90,20" stroke="#fbbf24" strokeWidth="5"/>
          </svg>
          <span className="text-xl font-bold text-amber-400 tracking-widest font-serif">KABAH</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-zinc-800 text-amber-400'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
              }`
            }
          >
            Início
          </NavLink>
          <NavLink
            to="/new"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-zinc-800 text-amber-400'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
              }`
            }
          >
            Nova Análise
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-zinc-800 text-amber-400'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
              }`
            }
          >
            Histórico
          </NavLink>
          {user?.role === 'ADMIN' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-zinc-800 text-amber-400'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                }`
              }
            >
              Admin
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden md:block text-sm text-zinc-400 truncate max-w-[140px]">
              {user.name}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors px-3 py-1.5 rounded-lg hover:bg-zinc-800"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  )
}
