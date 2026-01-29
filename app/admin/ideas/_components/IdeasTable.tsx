'use client'

import type { IdeaStatus } from '@prisma/client'
import { CheckCircle2, Hammer, Rocket, RotateCcw, Trash2 } from 'lucide-react'
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
import { moveToTrash, updateIdeaStatus } from '../actions'

type IdeaRow = {
  id: string
  title: string
  description: string
  tags: string[]
  status: IdeaStatus
  isDeleted: boolean
  createdAt: Date | string
  user: { email: string }
}

function getAuthorName(email: string): string {
  const trimmed = email.trim()
  if (!trimmed) return '未知'
  const local = trimmed.split('@')[0]?.trim()
  return local ? local : trimmed
}

export default function IdeasTable({ ideas }: { ideas: IdeaRow[] }) {
  const router = useRouter()
  const [busyIdeaId, setBusyIdeaId] = useState<string | null>(null)
  const [rowError, setRowError] = useState<{
    ideaId: string
    message: string
  } | null>(null)

  const runRowAction = async (ideaId: string, action: () => Promise<void>) => {
    setRowError((prev) => (prev?.ideaId === ideaId ? null : prev))
    setBusyIdeaId(ideaId)
    try {
      await action()
      router.refresh()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '操作失败，请重试'
      setRowError({ ideaId, message })
    } finally {
      setBusyIdeaId(null)
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border-2 border-brand-dark bg-surface shadow-solid">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-muted text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <tr className="border-b-2 border-brand-dark">
              <th scope="col" className="px-6 py-4">
                点子详情
              </th>
              <th scope="col" className="px-6 py-4">
                提交人
              </th>
              <th scope="col" className="px-6 py-4">
                当前状态
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ideas.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  没有找到符合条件的项目
                </td>
              </tr>
            ) : (
              ideas.map((idea) => {
                const isBusy = busyIdeaId === idea.id
                const authorName = getAuthorName(idea.user.email)
                const avatarText = authorName.slice(0, 1).toUpperCase()

                return (
                  <tr
                    key={idea.id}
                    className="group hover:bg-muted transition-colors"
                  >
                    <td className="max-w-xs px-6 py-4 md:max-w-md">
                      <div className="mb-1 font-bold text-brand-dark text-lg">
                        <Link
                          href={`/admin/ideas/${idea.id}`}
                          className="hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                          {idea.title}
                        </Link>
                      </div>
                      <div className="line-clamp-2 text-sm text-muted-foreground">
                        {idea.description}
                      </div>
                      {idea.tags.length > 0 ? (
                        <div className="mt-2 flex gap-2">
                          {idea.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </td>

                    <td className="px-6 py-4 align-top pt-5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {avatarText}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {authorName}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 align-top pt-5">
                      <StatusBadge status={idea.status} size="sm" />
                    </td>

                    <td className="px-6 py-4 text-right align-top pt-5">
                      <div className="flex items-center justify-end gap-2 opacity-60 transition-opacity group-hover:opacity-100">
                        {idea.status === 'PENDING' ? (
                          <Button
                            type="button"
                            size="sm"
                            disabled={isBusy}
                            className="h-9 border-brand-primary bg-brand-primary px-4 text-xs hover:bg-brand-primary/90"
                            onClick={() =>
                              runRowAction(idea.id, () =>
                                updateIdeaStatus(idea.id, 'APPROVED')
                              )
                            }
                          >
                            <CheckCircle2
                              size={14}
                              className="mr-1"
                              aria-hidden="true"
                            />
                            通过审核
                          </Button>
                        ) : null}

                        {idea.status === 'APPROVED' ? (
                          <Button
                            type="button"
                            size="sm"
                            disabled={isBusy}
                            className="h-9 border-brand-accent bg-brand-accent px-4 text-xs text-white hover:bg-brand-accent/90"
                            onClick={() =>
                              runRowAction(idea.id, () =>
                                updateIdeaStatus(idea.id, 'IN_PROGRESS')
                              )
                            }
                          >
                            <Hammer
                              size={14}
                              className="mr-1"
                              aria-hidden="true"
                            />
                            启动开发
                          </Button>
                        ) : null}

                        {idea.status === 'IN_PROGRESS' ? (
                          <Button
                            type="button"
                            size="sm"
                            disabled={isBusy}
                            className="h-9 border-brand-success bg-brand-success px-4 text-xs text-white hover:bg-brand-success/90"
                            onClick={() =>
                              runRowAction(idea.id, () =>
                                updateIdeaStatus(idea.id, 'COMPLETED')
                              )
                            }
                          >
                            <Rocket
                              size={14}
                              className="mr-1"
                              aria-hidden="true"
                            />
                            发布上线
                          </Button>
                        ) : null}

                        {idea.status === 'COMPLETED' ? (
                          <Button
                            type="button"
                            size="sm"
                            disabled={isBusy}
                            className="h-9 border-brand-accent bg-brand-accent px-4 text-xs text-white hover:bg-brand-accent/90"
                            onClick={() =>
                              runRowAction(idea.id, () =>
                                updateIdeaStatus(idea.id, 'IN_PROGRESS')
                              )
                            }
                          >
                            <RotateCcw
                              size={14}
                              className="mr-1"
                              aria-hidden="true"
                            />
                            回退到开发中
                          </Button>
                        ) : null}

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              type="button"
                              aria-label="移至回收站"
                              title="移至回收站"
                              disabled={isBusy}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-colors hover:border-destructive/20 hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
                            >
                              <Trash2 size={16} aria-hidden="true" />
                            </button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                确认移至回收站？
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                移至回收站后，您可以在回收站中恢复或永久删除。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={isBusy}>
                                取消
                              </AlertDialogCancel>
                              <AlertDialogAction
                                disabled={isBusy}
                                onClick={() =>
                                  runRowAction(idea.id, () =>
                                    moveToTrash(idea.id)
                                  )
                                }
                              >
                                确认移至回收站
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>

                      {rowError?.ideaId === idea.id ? (
                        <p className="mt-2 text-right text-xs font-bold text-red-600">
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
    </div>
  )
}
