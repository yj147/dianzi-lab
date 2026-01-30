'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'

type PaymentQRDialogProps = {
  price: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const WECHAT_QR = process.env.NEXT_PUBLIC_WECHAT_PAY_QR
const ALIPAY_QR = process.env.NEXT_PUBLIC_ALIPAY_QR

export function PaymentQRDialog({ price, open, onOpenChange }: PaymentQRDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay'>(
    WECHAT_QR ? 'wechat' : 'alipay'
  )

  const qrUrl = paymentMethod === 'wechat' ? WECHAT_QR : ALIPAY_QR

  // 环境变量缺失时优雅降级
  if (!WECHAT_QR && !ALIPAY_QR) {
    return null
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">扫码支付</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            请使用微信或支付宝扫描下方二维码完成支付
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {/* 支付方式切换 */}
          <div className="flex gap-2">
            {WECHAT_QR && (
              <button
                type="button"
                onClick={() => setPaymentMethod('wechat')}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-bold transition-colors',
                  paymentMethod === 'wechat'
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                微信支付
              </button>
            )}
            {ALIPAY_QR && (
              <button
                type="button"
                onClick={() => setPaymentMethod('alipay')}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-bold transition-colors',
                  paymentMethod === 'alipay'
                    ? 'bg-blue-500 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                支付宝
              </button>
            )}
          </div>

          {/* 二维码图片 */}
          {qrUrl ? (
            <div className="relative size-48 overflow-hidden rounded-lg border-2 border-brand-dark bg-white p-2">
              <Image
                src={qrUrl}
                alt={`${paymentMethod === 'wechat' ? '微信' : '支付宝'}支付二维码`}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex size-48 items-center justify-center rounded-lg border-2 border-dashed border-muted bg-muted/50">
              <span className="text-sm text-muted-foreground">二维码未配置</span>
            </div>
          )}

          {/* 金额 */}
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-dark">¥{price}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              扫码支付后请等待管理员确认
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>关闭</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
