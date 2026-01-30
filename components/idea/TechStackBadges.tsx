import { cn } from '@/lib/utils'

export default function TechStackBadges({
  items,
  className,
}: {
  items: string[]
  className?: string
}) {
  const normalized = items.map((item) => item.trim()).filter(Boolean)

  if (normalized.length === 0) return null

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {normalized.map((item) => (
        <span
          key={item}
          className="rounded-full bg-muted px-3 py-1 font-mono text-xs font-medium text-muted-foreground"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

