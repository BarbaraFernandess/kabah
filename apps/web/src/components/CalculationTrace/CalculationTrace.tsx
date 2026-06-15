import { useState } from 'react'
import type { CalculationTrace as CalculationTraceType } from '../../types'
import { MasterNumberBadge } from '../MasterNumberBadge/MasterNumberBadge'

type Props = {
  trace: CalculationTraceType
  label?: string
}

export function CalculationTrace({ trace, label }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-zinc-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2 bg-zinc-900 hover:bg-zinc-800 transition-colors text-left"
      >
        <span className="text-sm text-zinc-300 font-medium">
          {label ?? 'Ver Cálculo'}
        </span>
        <svg
          className={['h-4 w-4 text-amber-400 transition-transform', open ? 'rotate-180' : ''].join(' ')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-4 py-3 bg-zinc-950 space-y-3">
          <div>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Fórmula</span>
            <p className="mt-1 font-mono text-sm text-amber-400">{trace.formula}</p>
          </div>

          <div>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Passos</span>
            <ol className="mt-1 space-y-1">
              {trace.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-700 text-zinc-300 text-xs flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-zinc-300">
                    {step.description}
                    {step.value !== '' && (
                      <span className="ml-2 font-mono text-amber-400">= {step.value}</span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Resultado</span>
            <span className="font-bold text-amber-400 text-lg">{trace.result}</span>
            {trace.isMasterNumber && <MasterNumberBadge number={trace.result} />}
            {trace.karmicDebt !== undefined && (
              <span className="inline-flex items-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                Débito Kármico {trace.karmicDebt}
              </span>
            )}
          </div>

          <div className="border-t border-zinc-800 pt-2">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Nota metodológica</span>
            <p className="mt-1 text-xs text-zinc-400 italic">{trace.methodologicalNote}</p>
          </div>
        </div>
      )}
    </div>
  )
}
