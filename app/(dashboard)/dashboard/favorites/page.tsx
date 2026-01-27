import Link from 'next/link'
import { ArrowLeft, Heart } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-xl border-2 border-brand-dark bg-brand-surface p-10 text-center shadow-solid-sm">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-brand-primary text-white shadow-solid-sm">
          <Heart className="size-6" aria-hidden="true" />
        </div>
        <h1 className="text-balance font-heading text-3xl font-bold text-brand-dark md:text-4xl">灵感收藏</h1>
        <p className="text-pretty mx-auto mt-3 max-w-md text-sm text-gray-600">
          这里会收纳你珍藏的灵感碎片。现在还在编织中。
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild variant="secondary">
            <Link href="/dashboard" className="inline-flex items-center gap-2">
              <ArrowLeft className="size-4" aria-hidden="true" />
              返回我的工坊
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
