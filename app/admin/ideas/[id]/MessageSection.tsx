'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

import { MESSAGE_MAX_LENGTH } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

import { adminSendMessage } from '../actions'

type MessageItem = {
  id: string
  content: string
  senderId: string
  createdAt: string
  sender: { email: string }
}

export default function MessageSection({
  ideaId,
  ideaOwnerId,
  initialMessages,
}: {
  ideaId: string
  ideaOwnerId: string
  initialMessages: MessageItem[]
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [content, setContent] = useState('')

  const trimmedContent = content.trim()
  const canSend = trimmedContent.length > 0 && !isPending

  function formatTimestamp(value: string): string {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return format(date, 'yyyy-MM-dd HH:mm', { locale: zhCN })
  }

  function handleSend(): void {
    if (!canSend) return

    startTransition(async () => {
      try {
        const result = await adminSendMessage(ideaId, trimmedContent)
        if (!result.success) {
          toast({
            title: '发送失败',
            description: result.error,
            variant: 'destructive',
          })
          return
        }

        setContent('')
        toast({ title: '消息已发送', variant: 'success' })
        router.refresh()
      } catch {
        toast({
          title: '发送失败',
          description: '网络异常，请稍后再试',
          variant: 'destructive',
        })
      }
    })
  }

  return (
    <section className="rounded-xl border-2 border-brand-dark bg-brand-surface p-8 shadow-solid-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between border-b-2 border-brand-dark/10 pb-6">
        <div className="space-y-1">
          <h2 className="font-heading text-xl font-bold text-brand-dark">
            沟通记录 // MESSAGES
          </h2>
          <p className="text-sm text-muted-foreground">
            在此处与点子作者进行实时沟通，反馈审核建议或推进详情。
          </p>
        </div>
        <div className="font-mono text-xs font-bold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">
          {trimmedContent.length} / {MESSAGE_MAX_LENGTH} CHARS
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <Textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="输入要发送的消息…"
          maxLength={MESSAGE_MAX_LENGTH}
          className="min-h-[120px] bg-white border-2 border-gray-200 focus:border-brand-primary rounded-lg transition-colors"
        />
        <div className="flex items-center justify-end">
          <Button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="shadow-solid hover:shadow-solid-lg transition-all active:shadow-none active:translate-y-0.5"
          >
            {isPending ? '正在投递...' : '投递消息'}
          </Button>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        {initialMessages.length > 0 ? (
          initialMessages.map((message) => {
            const isFromOwner = message.senderId === ideaOwnerId
            return (
              <article
                key={message.id}
                className={`relative rounded-xl border-2 border-brand-dark p-5 transition-all shadow-solid-sm ${
                  isFromOwner ? 'bg-white ml-4' : 'bg-brand-primary/5 mr-4 border-brand-primary'
                }`}
              >
                <div className={`absolute -top-3 ${isFromOwner ? 'right-4' : 'left-4'} px-2 py-0.5 bg-brand-dark text-white text-[10px] font-mono font-bold shadow-solid-sm`}>
                  {isFromOwner ? 'FROM USER' : 'ADMIN'}
                </div>
                <header className="flex flex-wrap items-center justify-between gap-2 text-xs mb-3 border-b border-brand-dark/5 pb-2">
                  <span className="font-mono font-bold text-brand-dark/60">
                    {message.sender.email}
                  </span>
                  <time
                    dateTime={message.createdAt}
                    className="font-mono text-[10px] uppercase font-bold text-muted-foreground"
                  >
                    {formatTimestamp(message.createdAt)}
                  </time>
                </header>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-brand-dark">
                  {message.content}
                </p>
              </article>
            )
          })
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-sm text-muted-foreground font-mono">NO MESSAGES YET // 暂无沟通记录</p>
          </div>
        )}
      </div>
    </section>
  )
}
