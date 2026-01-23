'use client'

import type { IdeaStatus } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
import { STATUS_CONFIG } from '@/lib/constants'
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
}

const IDEA_ICON_PRESETS = [
  { icon: 'cloud_circle', iconClassName: 'bg-indigo-50 text-indigo-400', titleHover: 'group-hover:text-indigo-500' },
  { icon: 'potted_plant', iconClassName: 'bg-mint-50 text-mint-500', titleHover: 'group-hover:text-mint-600' },
  { icon: 'rocket_launch', iconClassName: 'bg-coral-50 text-coral-400', titleHover: 'group-hover:text-coral-500' },
  { icon: 'pets', iconClassName: 'bg-purple-50 text-purple-400', titleHover: 'group-hover:text-purple-500' },
  { icon: 'water_drop', iconClassName: 'bg-blue-50 text-blue-400', titleHover: 'group-hover:text-blue-500' },
] as const

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

function StatusPill({ status, isDeleted }: { status: IdeaStatus; isDeleted: boolean }) {
  if (isDeleted) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-coral-50 text-coral-500 border border-coral-100">
        <span className="material-symbols-outlined text-[14px]">cancel</span>
        已驳回
      </span>
    )
  }

  const label = STATUS_CONFIG[status].label

  const { icon, className } = (() => {
    switch (status) {
      case 'PENDING':
        return {
          icon: 'hourglass_top',
          className: 'bg-gray-100 text-gray-700 border border-gray-200',
        }
      case 'APPROVED':
        return {
          icon: 'thumb_up',
          className: 'bg-blue-100 text-blue-700 border border-blue-200',
        }
      case 'IN_PROGRESS':
        return {
          icon: 'build',
          className: 'bg-orange-100 text-orange-700 border border-orange-200',
        }
      case 'COMPLETED':
        return {
          icon: 'check_circle',
          className: 'bg-green-100 text-green-700 border border-green-200',
        }
    }
  })()

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold', className)}>
      <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
        {icon}
      </span>
      {label}
    </span>
  )
}

function getAvatarText(email: string): string {
  const trimmed = email.trim()
  if (!trimmed) return '?'
  return trimmed[0]?.toUpperCase() ?? '?'
}

function getPrimaryAction(status: IdeaStatus): {
  nextStatus: IdeaStatus
  label: string
  icon: string
  className: string
} {
  switch (status) {
    case 'PENDING':
      return {
        nextStatus: 'APPROVED',
        label: '批准',
        icon: 'auto_fix_high',
        className: 'bg-mint-100 text-mint-600 hover:bg-mint-200 hover:shadow-mint-200/50',
      }
    case 'APPROVED':
      return {
        nextStatus: 'IN_PROGRESS',
        label: '开始开发',
        icon: 'rocket_launch',
        className: 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:shadow-blue-200/50',
      }
    case 'IN_PROGRESS':
      return {
        nextStatus: 'COMPLETED',
        label: '标记完成',
        icon: 'check_circle',
        className: 'bg-orange-100 text-orange-700 hover:bg-orange-200 hover:shadow-orange-200/50',
      }
    case 'COMPLETED':
      return {
        nextStatus: 'IN_PROGRESS',
        label: '回退开发中',
        icon: 'undo',
        className: 'bg-lavender-100 text-lavender-500 hover:bg-lavender-200 hover:shadow-lavender-200/50',
      }
  }
}

export default function IdeasTable({
  ideas,
}: {
  ideas: IdeaRow[]
}) {
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
    <div className="glass-panel rounded-[2.5rem] p-1 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-lavender-200/50 text-slate-500">
              <th
                scope="col"
                className="py-6 px-8 font-display text-lg font-normal tracking-wide w-1/3"
              >
                奇思妙想 (Idea Title)
              </th>
              <th scope="col" className="py-6 px-6 font-display text-lg font-normal tracking-wide">
                造梦者 (Dreamer)
              </th>
              <th scope="col" className="py-6 px-6 font-display text-lg font-normal tracking-wide">
                状态 (Status)
              </th>
              <th scope="col" className="py-6 px-6 font-display text-lg font-normal tracking-wide">
                提交时间 (Time)
              </th>
              <th
                scope="col"
                className="py-6 px-8 font-display text-lg font-normal tracking-wide text-right"
              >
                魔法操作 (Magic Actions)
              </th>
            </tr>
          </thead>
          <tbody className="text-slate-600">
            {ideas.length === 0 ? (
              <tr className="table-row-glass group">
                <td colSpan={5} className="py-16 px-8 text-center text-sm font-medium text-slate-400">
                  暂无符合筛选条件的梦境
                </td>
              </tr>
            ) : (
              ideas.map((idea, index) => {
                const preset = IDEA_ICON_PRESETS[index % IDEA_ICON_PRESETS.length]
                const isBusy = busyIdeaId === idea.id
                const primaryAction = getPrimaryAction(idea.status)

                return (
                  <tr
                    key={idea.id}
                    className={cn(
                      'table-row-glass group',
                      index !== ideas.length - 1 ? 'border-b border-dashed border-lavender-100' : ''
                    )}
                  >
                    <td className="py-5 px-8">
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0',
                            preset.iconClassName
                          )}
                        >
                          <span className="material-symbols-outlined" aria-hidden="true">
                            {preset.icon}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div
                            className={cn(
                              'font-bold text-lg text-slate-800 transition-colors',
                              preset.titleHover
                            )}
                          >
                            {idea.title}
                          </div>
                          {idea.description ? (
                            <div className="text-sm text-slate-400 mt-0.5">
                              {idea.description}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </td>

                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-lavender-100 flex items-center justify-center text-xs font-bold text-lavender-500">
                          {getAvatarText(idea.user.email)}
                        </div>
                        <span className="font-medium">{idea.user.email}</span>
                      </div>
                    </td>

                    <td className="py-5 px-6">
                      <StatusPill status={idea.status} isDeleted={idea.isDeleted} />
                    </td>

                    <td className="py-5 px-6 font-sans text-slate-400 text-sm">
                      {formatRelativeTime(idea.createdAt)}
                    </td>

                    <td className="py-5 px-8">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          className={cn(
                            'action-btn disabled:cursor-not-allowed disabled:opacity-50',
                            primaryAction.className,
                          )}
                          title={primaryAction.label}
                          aria-label={primaryAction.label}
                          disabled={isBusy}
                          onClick={() =>
                            runRowAction(idea.id, () =>
                              updateIdeaStatus(idea.id, primaryAction.nextStatus),
                            )
                          }
                        >
                          <span className="material-symbols-outlined" aria-hidden="true">
                            {primaryAction.icon}
                          </span>
                        </button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              type="button"
                              className="action-btn bg-coral-50 text-coral-400 hover:bg-coral-100 hover:shadow-coral-200/50 disabled:cursor-not-allowed disabled:opacity-50"
                              title="驳回 (Reject)"
                              aria-label="驳回"
                              disabled={isBusy}
                            >
                              <span className="material-symbols-outlined" aria-hidden="true">
                                cloud_off
                              </span>
                            </button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>确认驳回？</AlertDialogTitle>
                              <AlertDialogDescription>
                                驳回会将梦境移入垃圾箱，您可以在垃圾箱中恢复或永久删除。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={isBusy}>取消</AlertDialogCancel>
                              <AlertDialogAction
                                disabled={isBusy}
                                className="bg-coral-500 hover:bg-coral-600"
                                onClick={() => runRowAction(idea.id, () => moveToTrash(idea.id))}
                              >
                                确认驳回
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>

                      {rowError?.ideaId === idea.id ? (
                        <p className="mt-2 text-right text-xs font-medium text-coral-500">
                          {rowError.message}
                        </p>
                      ) : null}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="px-8 py-6 border-t border-lavender-200/50 flex justify-between items-center bg-white/20">
        <span className="text-sm font-medium text-slate-500">
          显示 1 至 {ideas.length} 项，共 {ideas.length} 个奇思妙想
        </span>
      </div>
    </div>
  )
}
