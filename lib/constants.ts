import type { IdeaStatus } from '@prisma/client'

export const STATUS_CONFIG: Record<
  IdeaStatus,
  { label: string; description: string }
> = {
  PENDING: { label: '审核中', description: '正在等待管理员评估可行性...' },
  APPROVED: { label: '已立项', description: '创意已被选中，即将进入开发。' },
  IN_PROGRESS: { label: '开发中', description: '工程师正在将想法变为现实。' },
  COMPLETED: { label: '已上线', description: '成品已发布，欢迎体验！' },
}
