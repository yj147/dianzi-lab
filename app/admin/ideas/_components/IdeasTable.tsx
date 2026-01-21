'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Idea, IdeaStatus, User } from '@prisma/client'

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
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">点子列表</h2>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">状态筛选</span>
          <select
            aria-label="状态筛选"
            className="rounded-lg border px-3 py-2 text-sm"
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
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-gray-500">
          暂无点子
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-600">
                <th className="px-3 py-2 font-medium">标题</th>
                <th className="px-3 py-2 font-medium">提交者邮箱</th>
                <th className="px-3 py-2 font-medium">状态</th>
                <th className="px-3 py-2 font-medium">提交时间</th>
                <th className="px-3 py-2 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {ideas.map((idea) => (
                <tr key={idea.id} className="border-b last:border-b-0">
                  <td className="px-3 py-3 font-medium text-gray-900">{idea.title}</td>
                  <td className="px-3 py-3 text-gray-700">{idea.user.email}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={idea.status} />
                  </td>
                  <td className="px-3 py-3 text-gray-700">
                    {formatDate(idea.createdAt)}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        aria-label="状态变更"
                        className="rounded-lg border px-3 py-2 text-sm"
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

                      <button
                        type="button"
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                        onClick={() => handleMoveToTrash(idea.id)}
                      >
                        移至垃圾箱
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

