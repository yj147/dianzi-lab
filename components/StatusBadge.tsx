import { IdeaStatus } from '@prisma/client'
import { STATUS_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function StatusBadge({ status }: { status: IdeaStatus }) {
  const config = STATUS_CONFIG[status]

  const styles: Record<IdeaStatus, string> = {
    PENDING: 'bg-amber-50 text-amber-600 border-amber-200',
    APPROVED: 'bg-blue-50 text-brand-primary border-blue-200',
    IN_PROGRESS: 'bg-orange-50 text-brand-accent border-orange-200',
    COMPLETED: 'bg-green-50 text-brand-success border-green-200',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-sm font-medium',
        styles[status]
      )}
    >
      {config.label}
    </span>
  )
}
