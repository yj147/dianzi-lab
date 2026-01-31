'use client'

import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

type PaymentStatusBadgeProps = {
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED'
  price: string | null
  paidAt: Date | null
  onPayClick?: () => void
}

export function PaymentStatusBadge({
  paymentStatus,
  price,
  paidAt,
  onPayClick,
}: PaymentStatusBadgeProps) {
  // PAID: 显示「已支付」(+ 金额) + 时间
  if (paymentStatus === 'PAID') {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="rounded bg-brand-success/15 px-2 py-0.5 font-bold text-brand-success">
          已支付{price ? ` ¥${price}` : ''}
        </span>
        {paidAt && (
          <span className="text-xs text-muted-foreground">
            {format(paidAt, 'yyyy-MM-dd HH:mm', { locale: zhCN })}
          </span>
        )}
      </div>
    )
  }

  // REFUNDED: 显示「已退款」(+ 金额)
  if (paymentStatus === 'REFUNDED') {
    return (
      <span className="rounded bg-muted px-2 py-0.5 text-sm font-bold text-muted-foreground">
        已退款{price ? ` ¥${price}` : ''}
      </span>
    )
  }

  // PENDING + 无价格: 显示「报价中」
  if (!price) {
    return (
      <span className="rounded bg-muted px-2 py-0.5 text-sm font-bold text-muted-foreground">
        报价中
      </span>
    )
  }

  // PENDING + 有价格: 显示「待支付」+ 支付按钮
  return (
    <div className="flex items-center gap-2">
      <span className="rounded bg-brand-accent/15 px-2 py-0.5 text-sm font-bold text-brand-accent">
        待支付 ¥{price}
      </span>
      {onPayClick && (
        <button
          type="button"
          onClick={onPayClick}
          className="rounded bg-brand-primary px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-brand-primary/90"
        >
          支付
        </button>
      )}
    </div>
  )
}
