import { IdeaStatus } from '@prisma/client'
import { STATUS_CONFIG } from '@/lib/constants'

export default function StatusBadge({ status }: { status: IdeaStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <span className={`${config.color} rounded px-2 py-1 text-sm font-medium text-white`}>
      {config.label}
    </span>
  )
}
