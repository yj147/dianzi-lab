import { IdeaStatus } from '@prisma/client'

export const STATUS_CONFIG: Record<IdeaStatus, { label: string; color: string }> = {
  PENDING: { label: '待审核', color: 'bg-gray-500' },
  APPROVED: { label: '已采纳', color: 'bg-blue-500' },
  IN_PROGRESS: { label: '开发中', color: 'bg-orange-500' },
  COMPLETED: { label: '已完成', color: 'bg-green-500' },
}
