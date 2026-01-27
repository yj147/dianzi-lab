import Link from 'next/link'
import { ArrowRight, ScrollText, ShieldCheck, Zap } from 'lucide-react'
import { unstable_cache } from 'next/cache'

import Hero from '@/components/Hero'
import HomeMarquee from '@/components/HomeMarquee'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'

const COMPLETED_IDEAS_CACHE_TAG = 'completed-ideas'

async function getCompletedIdeas() {
  return prisma.idea.findMany({
    where: {
      status: 'COMPLETED',
      isDeleted: false,
    },
    orderBy: { updatedAt: 'desc' },
    take: 12,
    select: {
      id: true,
      title: true,
      description: true,
      tags: true,
      user: { select: { email: true } },
    },
  })
}

const getCompletedIdeasCached = unstable_cache(
  getCompletedIdeas,
  [COMPLETED_IDEAS_CACHE_TAG],
  { revalidate: 60, tags: [COMPLETED_IDEAS_CACHE_TAG] },
)

export default async function Home() {
  const completedIdeas =
    process.env.NODE_ENV === 'test' ? await getCompletedIdeas() : await getCompletedIdeasCached()

  const shipments = completedIdeas.slice(0, 8)

  return (
    <div className="overflow-x-hidden">
      <Hero />

      {shipments.length > 0 ? (
        <section className="relative overflow-hidden border-b-4 border-brand-dark bg-brand-dark py-16">
          <div className="absolute left-0 top-0 z-10 bg-brand-accent px-4 py-1 font-mono text-xs font-bold text-brand-dark">
            RECENT SHIPMENTS // 最新交付
          </div>

          <div className="pt-6">
            <HomeMarquee items={shipments} />
          </div>
        </section>
      ) : null}

      <section id="capabilities" className="relative z-10 bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="font-heading text-4xl font-bold md:text-5xl">为什么选择我们？</h2>
            <p className="mt-4 font-mono text-gray-600">在混乱的外包市场中，提供标准化的工程可靠性。</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: '价格透明无套路',
                icon: ScrollText,
                desc: '拒绝按工时计费的无底洞。我们根据功能范围提供一口价报价，预算可控。',
              },
              {
                title: '极速落地',
                icon: Zap,
                desc: '使用我们预制的成熟技术栈，从零到一只需要数周，而不是数月。',
              },
              {
                title: '掌握核心产权',
                icon: ShieldCheck,
                desc: '这不仅仅是外包，更是您的资产构建。源代码、设计稿、数据库所有权完全归您。',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border-2 border-brand-dark bg-brand-bg p-8 shadow-solid transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-solid-lg motion-reduce:transition-none"
              >
                <div className="mb-6 flex size-14 items-center justify-center border-2 border-brand-dark bg-white shadow-solid-sm">
                  <item.icon size={28} className="text-brand-primary" aria-hidden="true" />
                </div>
                <h3 className="mb-3 font-heading text-xl font-bold">{item.title}</h3>
                <p className="text-pretty font-sans leading-relaxed text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y-4 border-brand-dark bg-brand-primary py-24 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" aria-hidden="true" />
        <div className="container mx-auto relative z-10 px-4">
          <div className="flex flex-col items-center gap-12 md:flex-row">
            <div className="md:w-1/3">
              <div className="border-l-4 border-brand-accent pl-6">
                <span className="mb-2 block font-mono text-sm font-bold uppercase tracking-widest text-brand-accent">
                  The Protocol
                </span>
                <h2 className="mb-6 font-heading text-5xl font-bold">交付流水线</h2>
                <p className="mb-8 text-lg leading-relaxed text-white/80">
                  我们将软件开发生命周期优化为线性的、可预测的流程。没有黑盒，只有透明的进度。
                </p>
                <Button asChild variant="secondary">
                  <Link href="/submit">查看详细流程 →</Link>
                </Button>
              </div>
            </div>

            <div className="w-full md:w-2/3">
              <div className="space-y-4">
                {[
                  { step: '01', title: '需求确立', desc: '您提交项目简报与核心功能清单。', status: '甲方输入' },
                  { step: '02', title: '可行性评估', desc: '我们评估技术风险、报价与工期。', status: '乙方评估' },
                  { step: '03', title: '生产开发', desc: 'Sprint 迭代、代码审查、预发布环境测试。', status: '进行中' },
                  { step: '04', title: '验收交付', desc: '源代码移交、服务器部署与文档交付。', status: '已交付' },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="group flex flex-col items-center gap-6 border-2 border-white/20 bg-brand-dark p-6 transition-colors duration-200 hover:border-brand-accent motion-reduce:transition-none md:flex-row"
                  >
                    <div className="font-mono text-3xl font-bold text-brand-accent opacity-50 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:transition-none">
                      {item.step}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-heading text-xl font-bold">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                    <div className="rounded border border-white/20 bg-white/10 px-3 py-1 font-mono text-xs">
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="showcase" className="bg-brand-bg py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-end justify-between border-b-2 border-brand-dark pb-4">
            <h2 className="font-heading text-4xl font-bold">客户案例库</h2>
            <div className="font-mono text-sm">PROUDLY BUILT BY 点子 LAB</div>
          </div>

          {completedIdeas.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {completedIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="group cursor-pointer border-2 border-brand-dark bg-white shadow-solid transition-[transform] duration-200 hover:-translate-y-1 motion-reduce:transition-none"
                >
                  <div className="relative flex h-48 items-center justify-center overflow-hidden border-b-2 border-brand-dark bg-gray-100">
                    <div className="h-3/4 w-3/4 rounded border-2 border-gray-200 bg-white shadow-sm transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none" />
                    <div className="absolute inset-0 bg-brand-primary/0 transition-colors duration-200 group-hover:bg-brand-primary/10 motion-reduce:transition-none" />
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <h3 className="font-heading text-xl font-bold">{idea.title}</h3>
                      <ArrowRight
                        className="text-brand-dark transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="mb-4 line-clamp-2 font-mono text-xs text-gray-500">{idea.description}</p>
                    <span className="inline-block border border-brand-dark/20 bg-brand-accent/20 px-2 py-1 text-xs font-bold uppercase text-brand-dark">
                      已交付
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center shadow-solid-sm">
              <h3 className="font-heading text-2xl font-bold text-brand-dark">暂无已交付案例</h3>
              <p className="mt-2 text-pretty text-gray-600">成为第一个提交需求的人。</p>
              <div className="mt-8">
                <Button asChild size="lg">
                  <Link href="/submit">加入等待名单</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="border-t-4 border-brand-dark bg-white py-24">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-8 font-heading text-5xl font-bold">服务正在筹备中</h2>
          <p className="mb-10 text-xl text-gray-600">为了呈现最完美的交付体验，我们正在打磨最后的细节。</p>
          <Button
            asChild
            size="lg"
            className="h-20 w-full px-12 text-2xl shadow-solid-lg hover:shadow-solid md:w-auto"
          >
            <Link href="/submit">预约首批名额</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
