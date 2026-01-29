'use client'

import { Rocket, Trash2, X } from 'lucide-react'
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

type IdeaRow = {
  id: string
  title: string
  description: string
  updatedAt: Date | string
  user: { email: string }
}

function snippet(text: string, max = 50): string {
  const trimmed = text.trim()
  if (!trimmed) return '-'
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max)}...`
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
      <div className="bg-surface border-2 border-brand-dark rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
          <Trash2 size={32} aria-hidden="true" />
        </div>
        <h3 className="font-heading font-bold text-xl text-foreground mb-2">
          回收站为空
        </h3>
        <p className="text-muted-foreground">这里很干净。</p>
      </div>
    )
  }

  return (
    <div className="bg-surface border-2 border-brand-dark rounded-xl shadow-solid overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-muted border-b-2 border-brand-dark text-xs uppercase text-muted-foreground font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">已删项目</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ideas.map((idea) => (
              <tr
                key={idea.id}
                className="hover:bg-red-50/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-bold text-muted-foreground text-lg mb-1 line-through decoration-2 decoration-border">
                    {idea.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {snippet(idea.description)}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => handleRestore(idea.id)}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <Rocket size={14} aria-hidden="true" /> 恢复
                    </button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
                        >
                          <X size={14} aria-hidden="true" /> 永久删除
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
                          <AlertDialogAction
                            onClick={() => handlePermanentDelete(idea.id)}
                          >
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
