import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { getSession } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import SubmitForm from './SubmitForm'

export default async function SubmitPage() {
  const session = await getSession()

  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8">
      {session ? (
        <SubmitForm />
      ) : (
        <div className="rounded-2xl border-2 border-brand-dark bg-surface p-8 shadow-solid-lg">
          <h2 className="font-heading text-2xl font-bold text-brand-dark">登录后即可提交点子</h2>
          <p className="mt-2 text-pretty text-muted-foreground">提交后可在「我的点子」查看进度与评估结果。</p>
          <div className="mt-8">
            <Button asChild size="lg" className="w-full">
              <Link href="/login?callbackUrl=/submit">
                立即登录
                <ArrowRight size={18} className="ml-2" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
