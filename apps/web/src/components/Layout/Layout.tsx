import type { ReactNode } from 'react'
import { Navbar } from './Navbar'

type Props = {
  children: ReactNode
}

export function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
