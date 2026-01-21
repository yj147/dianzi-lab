'use client'

import type { Idea, User } from '@prisma/client'
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
import { permanentDeleteIdea, restoreIdea } from '../actions'

type IdeaRow = Idea & { user: Pick<User, 'email'> }

function formatDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString('zh-CN')
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

  return (
    <div className="overflow-hidden rounded-xl border bg-white dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600 dark:bg-gray-800 dark:text-gray-200">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium">
                标题
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                提交者邮箱
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                删除时间
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {ideas.map((idea) => (
              <tr key={idea.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                  {idea.title}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{idea.user.email}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {formatDate(idea.updatedAt)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
                      onClick={() => handleRestore(idea.id)}
                    >
                      恢复
                    </button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                        >
                          永久删除
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
    </div>
  )
}

