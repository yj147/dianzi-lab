'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Idea, IdeaStatus, User } from '@prisma/client'
import { Trash2, InboxIcon } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import StatusBadge from '@/components/StatusBadge'
import { STATUS_CONFIG } from '@/lib/constants'
import { moveToTrash, updateIdeaStatus } from '../actions'

type IdeaRow = Idea & { user: Pick<User, 'email'> }

const IDEA_STATUSES = Object.keys(STATUS_CONFIG) as IdeaStatus[]

function isIdeaStatus(value: string | null): value is IdeaStatus {
  return value !== null && Object.prototype.hasOwnProperty.call(STATUS_CONFIG, value)
}

function formatDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString('zh-CN')
}

// Mobile card component
function IdeaCard({ idea, onStatusChange, onMoveToTrash }: {
  idea: IdeaRow
  onStatusChange: (ideaId: string, status: IdeaStatus) => void
  onMoveToTrash: (ideaId: string) => void
}) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-900">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{idea.title}</h3>
        <StatusBadge status={idea.status} />
      </div>
      <div className="mb-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
        <p>{idea.user.email}</p>
        <p>{formatDate(idea.createdAt)}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="状态变更"
            className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-colors hover:border-gray-300 focus-visible:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
            value={idea.status}
            onChange={(e) => onStatusChange(idea.id, e.target.value as IdeaStatus)}
          >
          {IDEA_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_CONFIG[status].label}
            </option>
          ))}
        </select>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/20 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
              aria-label="移至垃圾箱"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认移至垃圾箱？</AlertDialogTitle>
              <AlertDialogDescription>
                此操作会将点子移至垃圾箱，您可以在垃圾箱中恢复或永久删除。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={() => onMoveToTrash(idea.id)}>
                确认移除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default function IdeasTable({ ideas }: { ideas: IdeaRow[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentStatus = searchParams.get('status')
  const filterValue = isIdeaStatus(currentStatus) ? currentStatus : ''

  const handleFilterChange = (value: string) => {
    if (value) {
      router.push(`/admin/ideas?status=${value}`)
    } else {
      router.push('/admin/ideas')
    }
    router.refresh()
  }

  const handleStatusChange = async (ideaId: string, status: IdeaStatus) => {
    await updateIdeaStatus(ideaId, status)
    router.refresh()
  }

  const handleMoveToTrash = async (ideaId: string) => {
    await moveToTrash(ideaId)
    router.refresh()
  }

  return (
    <TooltipProvider>
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-gray-900">
        {/* Header with filter */}
        <div className="flex flex-col gap-3 border-b bg-gray-50/50 p-4 sm:flex-row sm:items-center sm:justify-between dark:bg-gray-800/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">点子列表</h2>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">状态筛选</span>
            <select
              aria-label="状态筛选"
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-colors hover:border-gray-300 focus-visible:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
              value={filterValue}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="">全部</option>
              {IDEA_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_CONFIG[status].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {ideas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
              <InboxIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">暂无点子</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {filterValue ? '尝试调整筛选条件' : '等待用户提交新点子'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table view */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    <th className="px-4 py-3 font-medium">标题</th>
                    <th className="px-4 py-3 font-medium">提交者邮箱</th>
                    <th className="px-4 py-3 font-medium">状态</th>
                    <th className="px-4 py-3 font-medium">提交时间</th>
                    <th className="px-4 py-3 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {ideas.map((idea) => (
                    <tr
                      key={idea.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                        {idea.title}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {idea.user.email}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={idea.status} />
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {formatDate(idea.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <select
                            aria-label="状态变更"
                            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm transition-colors hover:border-gray-300 focus-visible:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
                            value={idea.status}
                            onChange={(e) =>
                              handleStatusChange(idea.id, e.target.value as IdeaStatus)
                            }
                          >
                            {IDEA_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {STATUS_CONFIG[status].label}
                              </option>
                            ))}
                          </select>

                          <AlertDialog>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                  <button
                                    type="button"
                                    className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/20 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                                    aria-label="移至垃圾箱"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </AlertDialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>移至垃圾箱</TooltipContent>
                            </Tooltip>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>确认移至垃圾箱？</AlertDialogTitle>
                                <AlertDialogDescription>
                                  此操作会将点子移至垃圾箱，您可以在垃圾箱中恢复或永久删除。
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleMoveToTrash(idea.id)}>
                                  确认移除
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="grid gap-3 p-4 md:hidden">
              {ideas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onStatusChange={handleStatusChange}
                  onMoveToTrash={handleMoveToTrash}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  )
}
