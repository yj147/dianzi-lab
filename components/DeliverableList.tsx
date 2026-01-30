'use client'

import type { IdeaStatus, PaymentStatus } from '@prisma/client'
import { Download, FileIcon, Loader2, Lock } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSignedUrl } from '@/lib/deliverable-actions'
import { cn } from '@/lib/utils'

type Deliverable = {
  id: string
  name: string
  size: number
}

type DeliverableListProps = {
  deliverables: Deliverable[]
  ideaStatus: IdeaStatus
  paymentStatus: PaymentStatus
  className?: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function DeliverableList({
  deliverables,
  ideaStatus,
  paymentStatus,
  className,
}: DeliverableListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const canDownload = ideaStatus === 'COMPLETED' && paymentStatus === 'PAID'
  const hasFiles = deliverables.length > 0

  async function handleDownload(deliverableId: string, fileName: string) {
    setLoadingId(deliverableId)
    try {
      const result = await getSignedUrl(deliverableId)
      if (result.success) {
        const link = document.createElement('a')
        link.href = result.signedUrl
        link.download = fileName
        link.click()
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('下载失败，请重试')
    } finally {
      setLoadingId(null)
    }
  }

  if (!hasFiles) {
    return (
      <Card className={cn('bg-muted/50', className)}>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <FileIcon
            className="mb-3 size-10 text-muted-foreground/50"
            aria-hidden="true"
          />
          <p className="text-sm text-muted-foreground">暂无交付文件</p>
        </CardContent>
      </Card>
    )
  }

  if (!canDownload) {
    return (
      <Card className={cn('bg-muted/50', className)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="size-4" aria-hidden="true" />
            交付文件
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {ideaStatus !== 'COMPLETED'
              ? '项目完成后可下载交付文件'
              : '支付后可下载交付文件'}
          </p>
          <div className="mt-3 space-y-2">
            {deliverables.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-lg bg-background/50 px-3 py-2 opacity-60"
              >
                <FileIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate text-sm">
                  {file.name}
                </span>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileIcon className="size-4" aria-hidden="true" />
          交付文件
          <span className="ml-auto font-mono text-xs font-normal text-muted-foreground">
            {deliverables.length} 个文件
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {deliverables.map((file) => {
          const isLoading = loadingId === file.id
          return (
            <div
              key={file.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2 transition-colors hover:bg-muted/50"
            >
              <FileIcon
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                {file.name}
              </span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="size-8 p-0"
                disabled={isLoading}
                onClick={() => handleDownload(file.id, file.name)}
                aria-label={`下载 ${file.name}`}
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Download className="size-4" />
                )}
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
