import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink, Home } from 'lucide-react'

import ScreenshotGallery from '@/components/idea/ScreenshotGallery'
import TechStackBadges from '@/components/idea/TechStackBadges'
import StatusBadge from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/db'
import { cn } from '@/lib/utils'

export default async function PublicIdeaDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const idea = await prisma.idea.findFirst({
    where: {
      id: params.id,
      status: 'COMPLETED',
      isDeleted: false,
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      tags: true,
      screenshots: true,
      techStack: true,
      duration: true,
      externalUrl: true,
    },
  })

  if (!idea) {
    notFound()
  }

  const hasScreenshots = idea.screenshots.some((url) => url.trim().length > 0)
  const hasTechStack = idea.techStack.some((tag) => tag.trim().length > 0)
  const hasDuration = Boolean(idea.duration?.trim())

  const safeExternalUrl = (() => {
    const url = idea.externalUrl?.trim()
    if (!url) return null
    try {
      const parsed = new URL(url)
      return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? url : null
    } catch {
      return null
    }
  })()

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <header className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <h1 className="text-balance font-heading text-3xl font-bold text-brand-dark md:text-4xl">
              {idea.title}
            </h1>
            <p className="text-pretty mt-3 leading-relaxed text-muted-foreground">
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
                className="rounded-full bg-muted px-3 py-1 font-mono text-xs font-medium text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      <div
        className={cn(
          'grid gap-6',
          hasScreenshots ? 'lg:grid-cols-2' : undefined
        )}
      >
        {hasScreenshots ? (
          <section className="space-y-4">
            <h2 className="font-heading text-lg font-bold text-brand-dark">
              项目截图
            </h2>
            <ScreenshotGallery screenshots={idea.screenshots} title={idea.title} />
          </section>
        ) : null}

        {hasTechStack || hasDuration ? (
          <Card>
            <CardHeader>
              <CardTitle>项目信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {hasTechStack ? (
                <div className="space-y-3">
                  <div className="font-mono text-xs font-bold text-muted-foreground">
                    技术栈
                  </div>
                  <TechStackBadges items={idea.techStack} />
                </div>
              ) : null}

              {hasDuration ? (
                <div className="flex items-baseline justify-between gap-4 border-t border-border pt-4">
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    开发周期
                  </span>
                  <span className="font-mono text-sm font-bold text-brand-dark tabular-nums">
                    {idea.duration}
                  </span>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ) : null}
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        {safeExternalUrl ? (
          <Button asChild size="lg">
            <a
              href={safeExternalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2"
            >
              <ExternalLink className="size-5" aria-hidden="true" />
              访问项目
            </a>
          </Button>
        ) : null}

        <Button asChild variant="secondary" size="lg">
          <Link href="/" className="inline-flex items-center gap-2">
            <Home className="size-5" aria-hidden="true" />
            返回首页
          </Link>
        </Button>
      </div>
    </div>
  )
}

