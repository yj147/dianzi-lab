'use client'

import type { IdeaStatus } from '@prisma/client'
import { Beaker, CheckCircle2, Clock, Rocket, type LucideIcon } from 'lucide-react'
import { STATUS_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'

const ICONS: Record<IdeaStatus, LucideIcon> = {
  PENDING: Clock,
  APPROVED: CheckCircle2,
  IN_PROGRESS: Beaker,
  COMPLETED: Rocket,
}

export default function StatusBadge({
  status,
  size = 'md',
}: {
  status: IdeaStatus
  size?: 'sm' | 'md'
}) {
  const config = STATUS_CONFIG[status]
  const Icon = ICONS[status]

  const styles: Record<IdeaStatus, string> = {
    PENDING: 'bg-gray-100 text-gray-500 border-gray-200',
    APPROVED: 'bg-blue-50 text-brand-primary border-blue-200',
    IN_PROGRESS: 'bg-orange-50 text-orange-600 border-orange-200',
    COMPLETED: 'bg-green-50 text-brand-success border-green-200',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-mono font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        styles[status]
      )}
    >
      <Icon size={size === 'sm' ? 12 : 14} aria-hidden="true" />
      {config.label}
    </span>
  )
}
