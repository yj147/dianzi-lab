import Link from 'next/link'
import { ArrowLeft, Settings } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="rounded-xl border-2 border-brand-dark bg-brand-surface p-10 text-center shadow-solid-sm">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-brand-primary text-white shadow-solid-sm">
          <Settings className="size-6" aria-hidden="true" />
        </div>
        <h1 className="text-balance font-heading text-3xl font-bold text-brand-dark md:text-4xl">账号设置</h1>
        <p className="text-pretty mx-auto mt-3 max-w-md text-sm text-gray-600">
          账号偏好与安全设置正在建设中。
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild variant="secondary">
            <Link href="/dashboard" className="inline-flex items-center gap-2">
              <ArrowLeft className="size-4" aria-hidden="true" />
              返回我的点子
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
