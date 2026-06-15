import { useState } from 'react'
import type { CalculationTrace } from '../../types'
import { MasterNumberBadge } from '../MasterNumberBadge/MasterNumberBadge'
import { CalculationTrace as CalculationTraceComponent } from '../CalculationTrace/CalculationTrace'
import { Card } from '../ui/Card'

type Props = {
  title: string
  trace: CalculationTrace
  description?: string
}

export function NumerologyCard({ title, trace, description }: Props) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <Card className="flex flex-col gap-2 cursor-pointer hover:border-amber-500 transition-colors group">
        <div className="flex items-start justify-between">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {title}
          </span>
          {trace.karmicDebt !== undefined && (
            <span className="inline-flex items-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
              Débito {trace.karmicDebt}
            </span>
          )}
        </div>

        <div
          className="flex items-center gap-3"
          onClick={() => setModalOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setModalOpen(true)}
        >
          <span className="text-5xl font-bold text-amber-400 font-serif leading-none group-hover:text-amber-300 transition-colors">
            {trace.result}
          </span>
          <div className="flex flex-col gap-1">
            {trace.isMasterNumber && <MasterNumberBadge number={trace.result} />}
            {description && (
              <p className="text-xs text-zinc-400 line-clamp-2">{description}</p>
            )}
          </div>
        </div>

        <CalculationTraceComponent trace={trace} />
      </Card>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-zinc-100">{title}</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-6xl font-bold text-amber-400 font-serif">{trace.result}</span>
              <div className="flex flex-col gap-1">
                {trace.isMasterNumber && <MasterNumberBadge number={trace.result} />}
                {trace.karmicDebt !== undefined && (
                  <span className="inline-flex items-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                    Débito Kármico {trace.karmicDebt}
                  </span>
                )}
              </div>
            </div>
            {description && (
              <p className="text-sm text-zinc-300 mb-4">{description}</p>
            )}
            <CalculationTraceComponent trace={trace} label="Detalhes do Cálculo" />
          </div>
        </div>
      )}
    </>
  )
}
