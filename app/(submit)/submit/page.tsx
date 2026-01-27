import Link from 'next/link'
import { ArrowRight, ClipboardPenLine, LineChart, Sparkles } from 'lucide-react'

import { getSession } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import SubmitForm from './SubmitForm'

export default async function SubmitPage() {
  const session = await getSession()

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h1 className="font-heading text-4xl font-bold text-brand-dark">绘制蓝图</h1>
          <p className="mt-2 text-pretty text-lg text-gray-600">
            清晰描述 + 9 维度评估，让你的点子更容易被采纳并推进落地。
          </p>

          <div className="mt-10 space-y-4">
            {[
              {
                icon: ClipboardPenLine,
                title: '点子信息',
                desc: '填写标题、描述与标签（50 / 1000 字限制）',
              },
              {
                icon: LineChart,
                title: '创意评估',
                desc: '对目标用户、渠道、市场、技术等维度打分',
              },
              {
                icon: Sparkles,
                title: '结果展示',
                desc: '生成雷达图与反馈建议，达标后提交入库',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-xl border-2 border-brand-dark bg-white p-5 shadow-solid-sm"
              >
                <div className="flex size-12 items-center justify-center rounded-xl border-2 border-brand-dark bg-brand-bg shadow-solid-sm">
                  <item.icon size={22} className="text-brand-primary" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="font-heading text-lg font-bold text-brand-dark">{item.title}</div>
                  <div className="mt-1 text-sm text-gray-600">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {!session ? (
            <div className="mt-10 rounded-xl border-2 border-brand-dark bg-brand-bg p-5 shadow-solid-sm">
              <p className="text-sm font-bold text-brand-dark">提示</p>
              <p className="mt-2 text-pretty text-sm text-gray-600">
                你需要先登录，才能提交点子并在「我的空间」追踪进度。
              </p>
              <div className="mt-4">
                <Button asChild>
                  <Link href="/login?callbackUrl=/submit">
                    去登录
                    <ArrowRight size={18} className="ml-2" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-7">
          {session ? (
            <SubmitForm />
          ) : (
            <div className="rounded-2xl border-2 border-brand-dark bg-white p-8 shadow-solid-lg">
              <h2 className="font-heading text-2xl font-bold text-brand-dark">登录后即可提交点子</h2>
              <p className="mt-2 text-pretty text-gray-600">提交后可在「我的空间」查看进度与评估结果。</p>
              <div className="mt-8">
                <Button asChild size="lg" className="w-full">
                  <Link href="/login?callbackUrl=/submit">立即登录</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

