'use client'

import { useState } from 'react'

import { PaymentQRDialog } from '@/components/payment/PaymentQRDialog'
import { PaymentStatusBadge } from '@/components/payment/PaymentStatusBadge'

type PaymentStatusWithDialogProps = {
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED'
  price: string | null
  paidAtISO: string | null
}

const HAS_ANY_QR = Boolean(
  process.env.NEXT_PUBLIC_WECHAT_PAY_QR || process.env.NEXT_PUBLIC_ALIPAY_QR
)

export function PaymentStatusWithDialog({
  paymentStatus,
  price,
  paidAtISO,
}: PaymentStatusWithDialogProps) {
  const [open, setOpen] = useState(false)

  const paidAt = (() => {
    if (!paidAtISO) return null
    const date = new Date(paidAtISO)
    return Number.isNaN(date.getTime()) ? null : date
  })()

  const canPay = paymentStatus === 'PENDING' && Boolean(price) && HAS_ANY_QR

  return (
    <>
      <PaymentStatusBadge
        paymentStatus={paymentStatus}
        price={price}
        paidAt={paidAt}
        onPayClick={canPay ? () => setOpen(true) : undefined}
      />
      {price && HAS_ANY_QR ? (
        <PaymentQRDialog price={price} open={open} onOpenChange={setOpen} />
      ) : null}
    </>
  )
}
