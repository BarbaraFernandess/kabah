import type { HTMLAttributes, ReactNode } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={[
        'rounded-xl border border-zinc-700 bg-zinc-800 p-4',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}
