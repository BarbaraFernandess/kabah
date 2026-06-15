type Props = {
  number: number
}

export function MasterNumberBadge({ number }: Props) {
  return (
    <span className="inline-flex items-center rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-black">
      Mestre {number}
    </span>
  )
}
