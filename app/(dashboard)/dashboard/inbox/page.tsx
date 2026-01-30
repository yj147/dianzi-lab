import Link from 'next/link'
import { ArrowLeft, Inbox, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

import { PaymentStatusWithDialog } from '@/components/payment/PaymentStatusWithDialog'
import { Button } from '@/components/ui/button'
import { getInboxMessages } from '@/lib/message-actions'

export default async function InboxPage() {
  const messages = await getInboxMessages()

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between border-b-2 border-brand-dark pb-4">
        <h1 className="font-heading text-3xl font-bold text-brand-dark">
          消息中心
        </h1>
        <div className="font-mono text-sm text-muted-foreground">
          INBOX // {messages.length} MESSAGES
        </div>
      </div>

      {messages.length > 0 ? (
        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="group relative border-2 border-brand-dark bg-surface p-6 shadow-solid-sm transition-all hover:-translate-y-1 hover:shadow-solid"
            >
              {!msg.isRead && (
                <div className="absolute -left-2 -top-2 z-10 bg-brand-accent px-2 py-0.5 font-mono text-[10px] font-bold text-white shadow-solid-sm">
                  NEW
                </div>
              )}
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg border-2 border-brand-dark bg-brand-primary/10 text-brand-primary shadow-solid-sm">
                    <MessageSquare className="size-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      来自: {msg.sender.email}
                    </div>
                    <Link
                      href={`/idea/${msg.idea.id}/result`}
                      className="font-heading font-bold text-brand-primary hover:underline"
                    >
                      项目: {msg.idea.title}
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <PaymentStatusWithDialog
                    paymentStatus={msg.idea.paymentStatus}
                    price={msg.idea.price}
                    paidAtISO={msg.idea.paidAt ? msg.idea.paidAt.toISOString() : null}
                  />
                  <time className="font-mono text-xs text-muted-foreground">
                    {format(msg.createdAt, 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                  </time>
                </div>
              </div>
              <p className="text-pretty border-l-4 border-brand-primary/20 pl-4 text-base leading-relaxed text-brand-dark">
                {msg.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-brand-dark/20 bg-surface/50 py-20 text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground shadow-solid-sm">
            <Inbox className="size-8" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-brand-dark">
            收件箱空空如也
          </h3>
          <p className="mt-2 text-muted-foreground">
            目前没有任何关于你的点子的消息。
          </p>
          <div className="mt-8">
            <Button asChild variant="secondary">
              <Link href="/dashboard" className="inline-flex items-center gap-2">
                <ArrowLeft className="size-4" />
                返回仪表板
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
