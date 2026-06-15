import type { LifeCycle } from '../../types'
import { MasterNumberBadge } from '../MasterNumberBadge/MasterNumberBadge'
import { CalculationTrace } from '../CalculationTrace/CalculationTrace'

type Props = {
  cycles: LifeCycle[]
  currentAge: number
}

export function LifeCycleTimeline({ cycles, currentAge }: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {cycles.map((cycle, i) => {
        const isActive =
          currentAge >= cycle.startAge &&
          (cycle.endAge === null || currentAge < cycle.endAge)

        return (
          <div
            key={i}
            className={[
              'flex-1 rounded-xl border p-4 transition-colors',
              isActive
                ? 'border-amber-400 bg-amber-400/5'
                : 'border-zinc-700 bg-zinc-800',
            ].join(' ')}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                  {i + 1}º Ciclo
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {cycle.startAge} – {cycle.endAge !== null ? `${cycle.endAge} anos` : 'em diante'}
                </p>
              </div>
              {isActive && (
                <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-black">
                  Atual
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mb-3">
              <span
                className={[
                  'text-4xl font-bold font-serif',
                  isActive ? 'text-amber-400' : 'text-zinc-300',
                ].join(' ')}
              >
                {cycle.number}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-200">{cycle.name}</span>
                {cycle.isMasterNumber && <MasterNumberBadge number={cycle.number} />}
              </div>
            </div>

            <CalculationTrace trace={cycle.trace} />
          </div>
        )
      })}
    </div>
  )
}
