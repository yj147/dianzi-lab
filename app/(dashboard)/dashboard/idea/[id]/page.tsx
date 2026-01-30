import { format } from 'date-fns'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import DeliverableList from '@/components/DeliverableList'
import StatusBadge from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export default async function UserIdeaDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getSession()

  if (!session) {
    redirect('/login?callbackUrl=/dashboard')
  }

  const idea = await prisma.idea.findFirst({
    where: {
      id: params.id,
      userId: session.sub,
      isDeleted: false,
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      paymentStatus: true,
      tags: true,
      createdAt: true,
      updatedAt: true,
      deliverables: {
        select: {
          id: true,
          name: true,
          size: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!idea) {
    notFound()
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard" className="inline-flex items-center gap-2">
            <ArrowLeft className="size-4" aria-hidden="true" />
            返回我的点子
          </Link>
        </Button>
      </div>

      <header className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <h1 className="text-balance font-heading text-3xl font-bold text-brand-dark">
              {idea.title}
            </h1>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {idea.description}
            </p>
          </div>
          <div className="shrink-0">
            <StatusBadge status={idea.status} />
          </div>
        </div>

        {idea.tags.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {idea.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-mono text-xs font-medium text-muted-foreground"
              >
                <Tag className="size-3" aria-hidden="true" />
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3" aria-hidden="true" />
            创建于 {format(new Date(idea.createdAt), 'yyyy-MM-dd')}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3" aria-hidden="true" />
            更新于 {format(new Date(idea.updatedAt), 'yyyy-MM-dd')}
          </span>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>项目状态</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">开发状态</span>
              <StatusBadge status={idea.status} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">支付状态</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  idea.paymentStatus === 'PAID'
                    ? 'bg-brand-success/15 text-brand-success'
                    : idea.paymentStatus === 'REFUNDED'
                      ? 'bg-destructive/15 text-destructive'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {idea.paymentStatus === 'PAID'
                  ? '已支付'
                  : idea.paymentStatus === 'REFUNDED'
                    ? '已退款'
                    : '待支付'}
              </span>
            </div>
          </CardContent>
        </Card>

        <DeliverableList
          deliverables={idea.deliverables}
          ideaStatus={idea.status}
          paymentStatus={idea.paymentStatus}
        />
      </div>
    </div>
  )
}
