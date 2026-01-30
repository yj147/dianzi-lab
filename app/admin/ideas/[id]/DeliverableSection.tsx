'use client'

import {
  type ChangeEvent,
  type DragEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react'
import { useRouter } from 'next/navigation'
import { FileUp, Loader2, Trash2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { uploadDeliverable, deleteDeliverable } from '@/lib/deliverable-actions'
import { Button } from '@/components/ui/button'
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
import { useToast } from '@/components/ui/use-toast'

type DeliverableItem = {
  id: string
  name: string
  size: number
  createdAt: string
}

type UploadStatus = 'uploading' | 'success' | 'error'

type UploadItem = {
  id: string
  name: string
  size: number
  status: UploadStatus
  message?: string
}

const MAX_FILE_SIZE = 50 * 1024 * 1024
const ACCEPTED_EXTENSIONS = [
  'zip',
  'rar',
  'pdf',
  'docx',
  'xlsx',
  'png',
  'jpg',
  'jpeg',
] as const

function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—'
  if (bytes === 0) return '0 B'

  const kb = 1024
  const mb = kb * 1024
  const gb = mb * 1024
  const formatter = new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 1 })

  if (bytes >= gb) return `${formatter.format(bytes / gb)} GB`
  if (bytes >= mb) return `${formatter.format(bytes / mb)} MB`
  if (bytes >= kb) return `${formatter.format(bytes / kb)} KB`
  return `${bytes} B`
}

function formatTimestamp(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('zh-CN')
}

function getExtension(name: string): string {
  const dotIndex = name.lastIndexOf('.')
  if (dotIndex === -1) return ''
  return name.slice(dotIndex + 1).toLowerCase()
}

function isAcceptedFileType(file: File): boolean {
  const ext = getExtension(file.name)
  return (ACCEPTED_EXTENSIONS as readonly string[]).includes(ext)
}

function describeAcceptedTypes(): string {
  return 'zip / rar / pdf / docx / xlsx / png / jpg'
}

export default function DeliverableSection({
  ideaId,
  deliverables,
}: {
  ideaId: string
  deliverables: DeliverableItem[]
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [isDragActive, setIsDragActive] = useState(false)
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const acceptAttribute = useMemo(
    () => ACCEPTED_EXTENSIONS.map((ext) => `.${ext}`).join(','),
    []
  )

  useEffect(() => {
    setUploadItems((prev) => prev.filter((item) => item.status !== 'success'))
  }, [deliverables])

  function openFilePicker() {
    if (isPending) return
    fileInputRef.current?.click()
  }

  function updateUploadItem(
    id: string,
    patch: Partial<Omit<UploadItem, 'id'>>
  ) {
    setUploadItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    )
  }

  function enqueueFiles(files: File[]) {
    if (files.length === 0) return

    const now = Date.now()
    const nextItems: UploadItem[] = []
    const validFiles: { file: File; uploadId: string }[] = []

    for (const file of files) {
      const uploadId = `${now}-${file.name}-${file.size}-${file.lastModified}-${Math.random()
        .toString(16)
        .slice(2)}`

      if (file.size > MAX_FILE_SIZE) {
        nextItems.push({
          id: uploadId,
          name: file.name,
          size: file.size,
          status: 'error',
          message: '文件大小超过 50MB 限制',
        })
        continue
      }

      if (!isAcceptedFileType(file)) {
        nextItems.push({
          id: uploadId,
          name: file.name,
          size: file.size,
          status: 'error',
          message: `不支持的文件类型（仅支持 ${describeAcceptedTypes()}）`,
        })
        continue
      }

      nextItems.push({
        id: uploadId,
        name: file.name,
        size: file.size,
        status: 'uploading',
      })
      validFiles.push({ file, uploadId })
    }

    setUploadItems((prev) => [...nextItems, ...prev])

    if (validFiles.length === 0) return

    startTransition(() => {
      void (async () => {
        let hasSuccess = false

        await Promise.all(
          validFiles.map(async ({ file, uploadId }) => {
            try {
              const formData = new FormData()
              formData.append('file', file)

              const result = await uploadDeliverable(ideaId, formData)
              if (!result.success) {
                updateUploadItem(uploadId, {
                  status: 'error',
                  message: result.error,
                })
                toast({
                  title: '上传失败',
                  description: result.error,
                  variant: 'destructive',
                })
                return
              }

              hasSuccess = true
              updateUploadItem(uploadId, { status: 'success' })
              toast({ title: '上传成功', variant: 'success' })
            } catch {
              updateUploadItem(uploadId, {
                status: 'error',
                message: '网络异常，请稍后再试',
              })
              toast({
                title: '上传失败',
                description: '网络异常，请稍后再试',
                variant: 'destructive',
              })
            }
          })
        )

        if (hasSuccess) {
          router.refresh()
        }
      })()
    })
  }

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target
    if (!files || files.length === 0) return

    enqueueFiles(Array.from(files))
    event.target.value = ''
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    setIsDragActive(false)
    enqueueFiles(Array.from(event.dataTransfer.files))
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    setIsDragActive(true)
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    setIsDragActive(false)
  }

  function handleDelete(deliverableId: string) {
    if (isPending) return

    setDeletingId(deliverableId)
    startTransition(() => {
      void (async () => {
        try {
          const result = await deleteDeliverable(deliverableId)
          if (!result.success) {
            toast({
              title: '删除失败',
              description: result.error,
              variant: 'destructive',
            })
            return
          }

          toast({ title: '已删除', variant: 'success' })
          router.refresh()
        } catch {
          toast({
            title: '删除失败',
            description: '网络异常，请稍后再试',
            variant: 'destructive',
          })
        } finally {
          setDeletingId((current) =>
            current === deliverableId ? null : current
          )
        }
      })()
    })
  }

  return (
    <section className="rounded-xl border-2 border-brand-dark bg-brand-surface p-8 shadow-solid-sm">
      <div className="flex flex-col gap-4 border-b-2 border-brand-dark/10 pb-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h2 className="font-heading text-xl font-bold text-brand-dark">
            交付文件 // DELIVERABLES
          </h2>
          <p className="text-sm text-muted-foreground">
            支持拖拽上传或点击选择文件（可多选）。
          </p>
        </div>
        <div className="rounded-lg border-2 border-dashed border-brand-dark/30 bg-muted px-3 py-2 text-xs font-mono text-muted-foreground">
          MAX 50MB / FILE
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          multiple
          accept={acceptAttribute}
          className="sr-only"
          onChange={handleFileInputChange}
        />

        <div
          role="button"
          tabIndex={0}
          onClick={openFilePicker}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              openFilePicker()
            }
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'group rounded-xl border-2 border-dashed bg-white p-6 shadow-solid-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            isDragActive
              ? 'border-brand-primary/70 bg-brand-primary/5'
              : 'border-brand-dark/30 hover:border-brand-dark/60 hover:bg-muted/30'
          )}
          aria-label="上传交付文件"
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-12 items-center justify-center rounded-full border-2 border-brand-dark bg-brand-surface shadow-solid-sm">
              <FileUp className="size-5 text-brand-dark" aria-hidden="true" />
            </div>
            <div>
              <p className="font-heading text-base font-bold text-brand-dark">
                拖拽文件到这里，或点击选择
              </p>
              <p className="mt-1 text-xs font-mono text-muted-foreground">
                支持类型：{describeAcceptedTypes()}（单文件 ≤ 50MB）
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              className="shadow-solid-sm hover:shadow-solid transition-all active:shadow-none active:translate-y-0.5"
            >
              {isPending ? '正在处理...' : '选择文件'}
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border-2 border-brand-dark bg-white shadow-solid-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr className="text-left">
                <th className="px-6 py-4 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  文件名
                </th>
                <th className="px-6 py-4 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  大小
                </th>
                <th className="px-6 py-4 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  上传时间
                </th>
                <th className="px-6 py-4 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  状态
                </th>
                <th className="px-6 py-4 text-right font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {uploadItems.length === 0 && deliverables.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-xs font-mono text-muted-foreground"
                  >
                    暂无交付文件
                  </td>
                </tr>
              ) : null}

              {uploadItems.map((item) => (
                <tr
                  key={item.id}
                  className={cn(
                    'transition-colors',
                    item.status === 'error' ? 'bg-destructive/5' : 'bg-white'
                  )}
                >
                  <td className="px-6 py-4">
                    <div className="truncate font-bold text-brand-dark">
                      {item.name}
                    </div>
                    {item.message ? (
                      <p className="mt-1 text-xs font-bold text-destructive">
                        {item.message}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                    {formatFileSize(item.size)}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                    —
                  </td>
                  <td className="px-6 py-4">
                    {item.status === 'uploading' ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-brand-accent/30 bg-brand-accent/15 px-3 py-1 font-mono text-xs font-bold text-brand-accent">
                        <Loader2
                          className="size-3 animate-spin"
                          aria-hidden="true"
                        />
                        上传中
                      </span>
                    ) : item.status === 'success' ? (
                      <span className="inline-flex items-center rounded-full border border-brand-success/30 bg-brand-success/15 px-3 py-1 font-mono text-xs font-bold text-brand-success">
                        已完成
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 font-mono text-xs font-bold text-destructive">
                        失败
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    —
                  </td>
                </tr>
              ))}

              {deliverables.map((deliverable) => (
                <tr key={deliverable.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="truncate font-bold text-brand-dark">
                      {deliverable.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                    {formatFileSize(deliverable.size)}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                    {formatTimestamp(deliverable.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full border border-brand-success/30 bg-brand-success/15 px-3 py-1 font-mono text-xs font-bold text-brand-success">
                      已上传
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={isPending || deletingId === deliverable.id}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" aria-hidden="true" />
                          删除
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>确认删除该文件？</AlertDialogTitle>
                          <AlertDialogDescription>
                            将从存储中永久删除「{deliverable.name}」，此操作不可撤销。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isPending}>
                            取消
                          </AlertDialogCancel>
                          <AlertDialogAction
                            disabled={isPending}
                            onClick={() => handleDelete(deliverable.id)}
                          >
                            确认删除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
