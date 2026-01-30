'use client'

import { useState } from 'react'
import { PaymentStatus } from '@prisma/client'
import { Banknote, CheckCircle2, Clock, RotateCcw } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import { updateIdeaPrice, updatePaymentStatus } from '@/lib/payment-actions'

const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; icon: typeof Clock; style: string }
> = {
  PENDING: {
    label: '待支付',
    icon: Clock,
    style: 'bg-muted text-muted-foreground border-border',
  },
  PAID: {
    label: '已支付',
    icon: CheckCircle2,
    style: 'bg-brand-success/15 text-brand-success border-brand-success/30',
  },
  REFUNDED: {
    label: '已退款',
    icon: RotateCcw,
    style: 'bg-amber-50 text-amber-600 border-amber-200',
  },
}

interface PaymentSectionProps {
  ideaId: string
  initialPrice: string | null
  initialPaymentStatus: PaymentStatus
  initialPaidAt: string | null
}

export default function PaymentSection({
  ideaId,
  initialPrice,
  initialPaymentStatus,
  initialPaidAt,
}: PaymentSectionProps) {
  const [price, setPrice] = useState(initialPrice ?? '')
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus)
  const [paidAt, setPaidAt] = useState(initialPaidAt)
  const [priceError, setPriceError] = useState<string | null>(null)
  const [statusError, setStatusError] = useState<string | null>(null)
  const [pendingAction, setPendingAction] = useState<'price' | 'status' | null>(
    null
  )
  const isBusy = pendingAction !== null

  const handleSavePrice = async () => {
    if (isBusy) return

    setPriceError(null)
    setPendingAction('price')
    try {
      const normalizedPrice = price.trim()
      const result = await updateIdeaPrice(
        ideaId,
        normalizedPrice.length > 0 ? normalizedPrice : null
      )
      if (result.success) {
        setPrice(result.idea.price ?? '')
      } else {
        setPriceError(result.error)
      }
    } catch {
      setPriceError('保存失败，请稍后重试')
    } finally {
      setPendingAction(null)
    }
  }

  const handleStatusChange = async (newStatus: PaymentStatus) => {
    if (isBusy) return

    setStatusError(null)
    setPendingAction('status')
    try {
      const result = await updatePaymentStatus(ideaId, newStatus)
      if (result.success) {
        setPaymentStatus(result.idea.paymentStatus)
        setPaidAt(result.idea.paidAt?.toISOString() ?? null)
      } else {
        setStatusError(result.error)
      }
    } catch {
      setStatusError('更新失败，请稍后重试')
    } finally {
      setPendingAction(null)
    }
  }

  const config =
    PAYMENT_STATUS_CONFIG[paymentStatus] ?? PAYMENT_STATUS_CONFIG.PENDING
  const Icon = config.icon

  return (
    <section className="rounded-xl border-2 border-brand-dark bg-brand-surface p-6 shadow-solid-sm">
      <div className="flex items-center gap-2 mb-6">
        <Banknote className="size-5 text-brand-primary" aria-hidden="true" />
        <h2 className="font-heading text-lg font-bold text-brand-dark">
          报价与支付
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 报价设置 */}
        <div className="space-y-3">
          <label
            htmlFor="price-input"
            className="block text-xs font-bold uppercase tracking-wider text-gray-700"
          >
            报价金额（元）
          </label>
          <div className="flex gap-2">
            <input
              id="price-input"
              type="text"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              disabled={isBusy}
              className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-2.5 font-mono text-sm transition-colors focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
            <button
              type="button"
              onClick={handleSavePrice}
              disabled={isBusy}
              className="shrink-0 rounded-lg border-2 border-brand-dark bg-brand-dark px-4 py-2 font-heading font-bold text-white shadow-solid-sm transition-all hover:-translate-y-0.5 hover:bg-brand-accent hover:shadow-solid active:translate-y-0 active:shadow-none disabled:pointer-events-none disabled:opacity-50"
            >
              {pendingAction === 'price' ? '保存中...' : '保存'}
            </button>
          </div>
          {priceError && (
            <p className="text-sm text-red-500">{priceError}</p>
          )}
        </div>

        {/* 支付状态 */}
        <div className="space-y-3">
          <span className="block text-xs font-bold uppercase tracking-wider text-gray-700">
            支付状态
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-sm font-medium',
                config.style
              )}
            >
              <Icon size={14} aria-hidden="true" />
              {config.label}
            </span>

            {paymentStatus === PaymentStatus.PENDING && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    disabled={isBusy}
                    className="rounded-lg border-2 border-brand-success bg-brand-success/10 px-3 py-1.5 font-heading text-sm font-bold text-brand-success transition-all hover:bg-brand-success hover:text-white disabled:pointer-events-none disabled:opacity-50"
                  >
                    确认付款
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认付款</AlertDialogTitle>
                    <AlertDialogDescription>
                      确认将支付状态改为「已支付」？此操作将记录付款时间。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleStatusChange(PaymentStatus.PAID)}
                    >
                      确认
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {paymentStatus === PaymentStatus.PAID && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    disabled={isBusy}
                    className="rounded-lg border-2 border-amber-500 bg-amber-50 px-3 py-1.5 font-heading text-sm font-bold text-amber-600 transition-all hover:bg-amber-500 hover:text-white disabled:pointer-events-none disabled:opacity-50"
                  >
                    标记退款
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认退款</AlertDialogTitle>
                    <AlertDialogDescription>
                      确认将支付状态改为「已退款」？
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        handleStatusChange(PaymentStatus.REFUNDED)
                      }
                    >
                      确认
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          {statusError && (
            <p className="text-sm text-red-500">{statusError}</p>
          )}
          {paidAt && (
            <p className="font-mono text-xs text-muted-foreground">
              付款时间：{new Date(paidAt).toLocaleString('zh-CN')}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
