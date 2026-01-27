'use client'

import { Inbox, RotateCcw, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { permanentDeleteIdea, restoreIdea } from '../actions'

type IdeaRow = {
  id: string
  title: string
  updatedAt: Date | string
  user: { email: string }
}

function formatDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString('zh-CN')
}

function TrashCard({
  idea,
  onRestore,
  onPermanentDelete,
}: {
  idea: IdeaRow
  onRestore: (ideaId: string) => void
  onPermanentDelete: (ideaId: string) => void
}) {
  return (
    <div className="rounded-xl border-2 border-brand-dark bg-brand-surface p-4 shadow-solid-sm">
      <h3 className="text-pretty font-heading text-base font-bold text-brand-dark">{idea.title}</h3>
      <div className="mt-2 space-y-1 text-sm text-gray-600">
        <p className="truncate font-mono text-xs text-gray-500">{idea.user.email}</p>
        <p className="font-mono text-xs text-gray-500">删除于 {formatDate(idea.updatedAt)}</p>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={() => onRestore(idea.id)}
        >
          <RotateCcw className="mr-2 size-4" aria-hidden="true" />
          恢复
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="ghost" size="icon" aria-label="永久删除" className="text-red-600 hover:bg-red-50 hover:text-red-700 focus-visible:ring-red-600">
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认永久删除？</AlertDialogTitle>
              <AlertDialogDescription>此操作不可撤销，是否继续？</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={() => onPermanentDelete(idea.id)}>确认删除</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default function TrashTable({ ideas }: { ideas: IdeaRow[] }) {
  const router = useRouter()

  const handleRestore = async (ideaId: string) => {
    await restoreIdea(ideaId)
    router.refresh()
  }

  const handlePermanentDelete = async (ideaId: string) => {
    await permanentDeleteIdea(ideaId)
    router.refresh()
  }

  if (ideas.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-brand-dark/40 bg-brand-surface p-12 text-center shadow-solid-sm">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-brand-primary text-white shadow-solid-sm">
          <Inbox className="size-6" aria-hidden="true" />
        </div>
        <h2 className="text-balance font-heading text-2xl font-bold text-brand-dark">回收站为空</h2>
        <p className="text-pretty mx-auto mt-3 max-w-xl text-sm text-gray-600">没有被删除的点子。</p>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="overflow-hidden rounded-xl border-2 border-brand-dark bg-brand-surface shadow-solid-sm">
        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-600">
                <tr className="border-b-2 border-brand-dark">
                  <th scope="col" className="px-6 py-4">
                    标题
                  </th>
                  <th scope="col" className="px-6 py-4">
                    提交者邮箱
                  </th>
                  <th scope="col" className="px-6 py-4">
                    删除时间
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {ideas.map((idea) => (
                  <tr
                    key={idea.id}
                    className="border-b border-brand-dark/10 last:border-b-0 hover:bg-gray-50/60"
                  >
                    <td className="px-6 py-5 font-heading font-bold text-brand-dark">{idea.title}</td>
                    <td className="px-6 py-5 font-mono text-xs text-gray-600">{idea.user.email}</td>
                    <td className="px-6 py-5 font-mono text-xs text-gray-600">{formatDate(idea.updatedAt)}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label="恢复"
                              className="text-brand-success hover:bg-brand-success/10 focus-visible:ring-brand-success"
                              onClick={() => handleRestore(idea.id)}
                            >
                              <RotateCcw className="size-4" aria-hidden="true" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>恢复</TooltipContent>
                        </Tooltip>

                        <AlertDialog>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertDialogTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  aria-label="永久删除"
                                  className="text-red-600 hover:bg-red-50 hover:text-red-700 focus-visible:ring-red-600"
                                >
                                  <Trash2 className="size-4" aria-hidden="true" />
                                </Button>
                              </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>永久删除</TooltipContent>
                          </Tooltip>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>确认永久删除？</AlertDialogTitle>
                              <AlertDialogDescription>此操作不可撤销，是否继续？</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handlePermanentDelete(idea.id)}>
                                确认删除
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

          <div className="border-t-2 border-brand-dark/10 bg-gray-50 px-6 py-4">
            <span className="text-sm font-bold text-gray-600">共 {ideas.length} 项</span>
          </div>
        </div>

        <div className="grid gap-3 p-4 md:hidden">
          {ideas.map((idea) => (
            <TrashCard
              key={idea.id}
              idea={idea}
              onRestore={handleRestore}
              onPermanentDelete={handlePermanentDelete}
            />
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
