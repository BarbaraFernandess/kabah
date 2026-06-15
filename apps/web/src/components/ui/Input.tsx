import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-zinc-300">
          {label}
        </label>
      )}
      <input
        id={id}
        className={[
          'w-full rounded-lg border bg-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500',
          'focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent',
          'transition-colors',
          error ? 'border-red-500' : 'border-zinc-700',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  )
}
