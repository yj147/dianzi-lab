import Link from 'next/link'
import { Eye, ScrollText } from 'lucide-react'

import { Button } from '@/components/ui/button'

const PAIN_POINTS = [
  {
    title: '技术门槛',
    description: '不懂编程，配置环境就劝退，服务器维护更是噩梦。',
  },
  {
    title: '设计苦手',
    description: '脑子里画面很美，做出来却像上个世纪的软件。',
  },
  {
    title: '时间碎片化',
    description: '全职工作之余，根本没有整块时间推进项目。',
  },
] as const

const PROCESS_STEPS = [
  {
    step: '01',
    title: '提交点子',
    description: '不需要长篇大论的商业计划书。只需要清晰描述你的痛点和解决方案。',
  },
  {
    step: '02',
    title: '可行性评估',
    description: '社区投票筛选，管理员评估技术实现难度和潜在价值。',
  },
  {
    step: '03',
    title: '设计与开发',
    description: '实验室的工程师和设计师接手项目。你只需要参与核心决策。',
  },
  {
    step: '04',
    title: '发布上线',
    description: '部署到生产环境，发布到 Product Hunt，让世界看到你的创意。',
  },
] as const

export default function Hero() {
  return (
    <div className="relative z-10">
      <section className="pb-20 pt-24 md:pt-28">
        <div className="container mx-auto max-w-7xl px-4">
          <p className="font-mono text-sm text-gray-500">99% 的点子死于“没时间做”</p>

          <h1 className="mt-6 text-balance font-heading text-6xl font-bold leading-[0.95] text-brand-dark md:text-7xl">
            让好点子 <span className="text-brand-primary">不再只是想法</span>
          </h1>

          <p className="mt-6 max-w-2xl border-l-4 border-brand-primary py-2 pl-6 text-pretty text-lg font-medium leading-relaxed text-gray-700 md:text-xl">
            点子 Lab 是一个创意孵化器。你负责提供灵感，我们提供
            <br className="hidden sm:block" />
            设计、代码和运营，把它们变成真实可用的产品。
          </p>

          <div className="mt-10 flex flex-col gap-5 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/submit">
                <ScrollText size={18} className="mr-3" aria-hidden="true" />
                提交我的点子
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/#tools">
                <Eye size={18} className="mr-3" aria-hidden="true" />
                看看大家的作品
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t-2 border-brand-dark/10 py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-balance font-heading text-3xl font-bold text-brand-dark md:text-4xl">
            为什么你的想法总是无法落地？
          </h2>
          <p className="mt-3 text-pretty text-lg text-gray-600">因为创造一个产品比想象中难得多。</p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PAIN_POINTS.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border-2 border-brand-dark bg-white p-6 shadow-solid-sm"
              >
                <h3 className="font-heading text-xl font-bold text-brand-dark">{item.title}</h3>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t-2 border-brand-dark/10 py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <p className="font-mono text-xs text-gray-500">PROCESS</p>
          <h2 className="mt-3 text-balance font-heading text-3xl font-bold text-brand-dark md:text-4xl">
            孵化四部曲
          </h2>
          <p className="mt-3 text-pretty text-lg text-gray-600">从想法到产品，只需要简单的四步</p>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-xl border-2 border-brand-dark bg-white p-6 shadow-solid-sm"
              >
                <p className="font-mono text-xl font-bold text-brand-primary tabular-nums">{item.step}</p>
                <h3 className="mt-3 font-heading text-xl font-bold text-brand-dark">{item.title}</h3>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 font-mono text-xs text-gray-500">滚动查看更多流程</p>
        </div>
      </section>
    </div>
  )
}

