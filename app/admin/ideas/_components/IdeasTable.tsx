'use client'

import type { IdeaStatus } from '@prisma/client'
import { CheckCircle2, Code, Eye, RotateCcw, Trash2, Trophy } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import StatusBadge from '@/components/StatusBadge'
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
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { moveToTrash, updateIdeaStatus } from '../actions'

type IdeaRow = {
  id: string
  title: string
  description: string
  status: IdeaStatus
  isDeleted: boolean
  createdAt: Date | string
  user: { email: string }
  assessment?: { finalScore: number } | null
}

function formatRelativeTime(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value)
  const diffMs = Date.now() - date.getTime()

  if (Number.isNaN(diffMs)) return '-'
  if (diffMs < 60_000) return '刚刚'

  const diffMinutes = Math.floor(diffMs / 60_000)
  if (diffMinutes < 60) return `${diffMinutes}分钟前`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}小时前`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`

  return date.toLocaleDateString('zh-CN')
}

function getAvatarText(email: string): string {
  const trimmed = email.trim()
  if (!trimmed) return '?'
  return trimmed[0]?.toUpperCase() ?? '?'
}

function getPrimaryAction(status: IdeaStatus): {
  nextStatus: IdeaStatus
  label: string
  Icon: typeof CheckCircle2
} {
  switch (status) {
    case 'PENDING':
      return { nextStatus: 'APPROVED', label: '批准', Icon: CheckCircle2 }
    case 'APPROVED':
      return { nextStatus: 'IN_PROGRESS', label: '开始开发', Icon: Code }
    case 'IN_PROGRESS':
      return { nextStatus: 'COMPLETED', label: '标记完成', Icon: Trophy }
    case 'COMPLETED':
      return { nextStatus: 'IN_PROGRESS', label: '回退开发中', Icon: RotateCcw }
  }
}

export default function IdeasTable({ ideas }: { ideas: IdeaRow[] }) {
  const router = useRouter()
  const [busyIdeaId, setBusyIdeaId] = useState<string | null>(null)
  const [rowError, setRowError] = useState<{ ideaId: string; message: string } | null>(null)

  const runRowAction = async (ideaId: string, action: () => Promise<void>) => {
    setRowError((prev) => (prev?.ideaId === ideaId ? null : prev))
    setBusyIdeaId(ideaId)
    try {
      await action()
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : '操作失败，请重试'
      setRowError({ ideaId, message })
    } finally {
      setBusyIdeaId(null)
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border-2 border-brand-dark bg-brand-surface shadow-solid-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-gray-50 text-xs font-bold text-gray-600">
            <tr className="border-b-2 border-brand-dark">
              <th scope="col" className="px-6 py-4">
                点子
              </th>
              <th scope="col" className="px-6 py-4">
                提交者
              </th>
              <th scope="col" className="px-6 py-4">
                状态
              </th>
              <th scope="col" className="px-6 py-4">
                评分
              </th>
              <th scope="col" className="px-6 py-4">
                时间
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {ideas.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-sm text-gray-500">
                  暂无符合筛选条件的点子
                </td>
              </tr>
            ) : (
              ideas.map((idea) => {
                const isBusy = busyIdeaId === idea.id
                const { nextStatus, label, Icon } = getPrimaryAction(idea.status)

                const score = idea.assessment?.finalScore
                const scoreStyle =
                  score === undefined
                    ? ''
                    : score >= 70
                      ? 'bg-brand-success/15 text-brand-success'
                      : score >= 40
                        ? 'bg-amber-100/60 text-amber-800'
                        : 'bg-red-100/60 text-red-700'

                return (
                  <tr key={idea.id} className="border-b border-brand-dark/10 last:border-b-0 hover:bg-gray-50/60">
                    <td className="px-6 py-5 align-top">
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="font-heading text-base font-bold text-brand-dark">{idea.title}</p>
                        </div>
                        {idea.description ? (
                          <p className="text-pretty text-sm text-gray-600">{idea.description}</p>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-brand-dark text-sm font-heading font-bold text-white">
                          {getAvatarText(idea.user.email)}
                        </div>
                        <span className="max-w-[220px] truncate font-bold text-brand-dark">{idea.user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <StatusBadge status={idea.status} />
                    </td>
                    <td className="px-6 py-5 align-top">
                      {score === undefined ? (
                        <span className="font-mono text-xs text-gray-400">-</span>
                      ) : (
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full border-2 border-brand-dark/10 px-3 py-1 font-mono text-sm font-bold tabular-nums',
                            scoreStyle
                          )}
                        >
                          {score}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 align-top font-mono text-xs text-gray-500">
                      {formatRelativeTime(idea.createdAt)}
                    </td>
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="ghost" size="icon" aria-label="查看详情">
                          <Link href={`/admin/ideas/${idea.id}`}>
                            <Eye className="size-4" aria-hidden="true" />
                          </Link>
                        </Button>

                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          aria-label={label}
                          disabled={isBusy}
                          onClick={() => runRowAction(idea.id, () => updateIdeaStatus(idea.id, nextStatus))}
                        >
                          <Icon className="size-4" aria-hidden="true" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label="驳回"
                              disabled={isBusy}
                              className="text-red-600 hover:bg-red-50 hover:text-red-700 focus-visible:ring-red-600"
                            >
                              <Trash2 className="size-4" aria-hidden="true" />
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>确认驳回？</AlertDialogTitle>
                              <AlertDialogDescription>
                                驳回会将点子移入回收站，您可以在回收站中恢复或永久删除。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={isBusy}>取消</AlertDialogCancel>
                              <AlertDialogAction
                                disabled={isBusy}
                                onClick={() => runRowAction(idea.id, () => moveToTrash(idea.id))}
                              >
                                确认驳回
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>

                      {rowError?.ideaId === idea.id ? (
                        <p className="mt-2 text-right text-xs font-bold text-red-600">{rowError.message}</p>
                      ) : null}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t-2 border-brand-dark/10 bg-gray-50 px-6 py-4">
        <span className="text-sm font-bold text-gray-600">
          显示 1 至 {ideas.length} 项，共 {ideas.length} 个点子
        </span>
      </div>
    </div>
  )
}
