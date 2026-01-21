'use client'

import type { Idea, User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { RotateCcw, Trash2, InboxIcon } from 'lucide-react'

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
import { permanentDeleteIdea, restoreIdea } from '../actions'

type IdeaRow = Idea & { user: Pick<User, 'email'> }

function formatDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString('zh-CN')
}

// Mobile card component
function TrashCard({ idea, onRestore, onPermanentDelete }: {
  idea: IdeaRow
  onRestore: (ideaId: string) => void
  onPermanentDelete: (ideaId: string) => void
}) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-900">
      <h3 className="mb-2 font-medium text-gray-900 dark:text-gray-100">{idea.title}</h3>
      <div className="mb-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
        <p>{idea.user.email}</p>
        <p>删除于 {formatDate(idea.updatedAt)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40"
          onClick={() => onRestore(idea.id)}
        >
          <RotateCcw className="h-4 w-4" />
          恢复
        </button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
              aria-label="永久删除"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认永久删除？</AlertDialogTitle>
              <AlertDialogDescription>
                此操作不可撤销，是否继续？
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={() => onPermanentDelete(idea.id)}>
                确认删除
              </AlertDialogAction>
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
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
            <InboxIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">回收站为空</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            没有被删除的点子
          </p>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-gray-900">
        {/* Desktop table view */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  标题
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  提交者邮箱
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  删除时间
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  操作
                </th>
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
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {formatDate(idea.updatedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-600 transition-colors hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40"
                            onClick={() => handleRestore(idea.id)}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>恢复</TooltipContent>
                      </Tooltip>

                      <AlertDialog>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                              <button
                                type="button"
                                className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </AlertDialogTrigger>
                          </TooltipTrigger>
                          <TooltipContent>永久删除</TooltipContent>
                        </Tooltip>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>确认永久删除？</AlertDialogTitle>
                            <AlertDialogDescription>
                              此操作不可撤销，是否继续？
                            </AlertDialogDescription>
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

        {/* Mobile card view */}
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
