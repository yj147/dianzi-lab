'use client'

import * as React from 'react'
import Link from 'next/link'
import { HardHat, ScrollText } from 'lucide-react'

import PulseDot from '@/components/PulseDot'
import { Button } from '@/components/ui/button'
import { useInView } from '@/lib/use-in-view'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

export default function Hero() {
  const reducedMotion = usePrefersReducedMotion()
  const sectionRef = React.useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { rootMargin: '200px 0px' })
  const pauseLoops = reducedMotion || !inView

  return (
    <section
      ref={sectionRef}
      className="relative z-10 flex flex-col justify-center border-b-4 border-brand-dark bg-brand-bg/90 pb-20 pt-24 backdrop-blur-sm md:min-h-dvh"
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="animate-fade-in-left motion-reduce:animate-none">
            <div className="mb-8 inline-flex items-center gap-2 bg-brand-dark px-4 py-1.5 font-mono text-sm font-bold text-white shadow-solid-sm">
              <PulseDot className="bg-yellow-400" paused={pauseLoops} />
              筹备中 // COMING SOON
            </div>

            <h1 className="mb-8 font-heading text-6xl font-bold leading-[0.95] tracking-tight text-brand-dark md:text-7xl">
              您的专属 <br />
              <span className="bg-brand-accent/20 px-2 text-brand-primary lg:-ml-2">技术合伙人</span> <br />
              (As A Service)
            </h1>

            <p className="mb-10 max-w-lg border-l-4 border-brand-primary py-2 pl-6 text-pretty text-xl font-medium leading-relaxed text-brand-dark/80 md:text-2xl">
              您提供商业愿景，我们提供成建制的工程团队、技术路线图和交付代码。无需出让任何股权。
            </p>

            <div className="flex flex-col gap-5 sm:flex-row">
              <Button
                asChild
                className="group h-16 bg-brand-primary px-8 text-xl uppercase tracking-wider hover:-translate-y-1 hover:bg-brand-primary/90"
              >
                <Link href="/submit">
                  <ScrollText
                    className="mr-3 transition-transform group-hover:rotate-12"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  加入等待名单
                </Link>
              </Button>

              <Button
                asChild
                variant="secondary"
                className="h-16 px-8 text-xl uppercase tracking-wider hover:-translate-y-1"
              >
                <Link href="/#capabilities">查看服务能力</Link>
              </Button>
            </div>
          </div>

          <div className="relative hidden h-[500px] lg:block animate-fade-in-right motion-reduce:animate-none">
            <div className="absolute right-10 top-0 z-20">
              <div
                className="animate-float motion-reduce:animate-none"
                style={pauseLoops ? { animationPlayState: 'paused' } : undefined}
              >
                <div className="w-80 rotate-2 border-4 border-brand-dark bg-white p-8 shadow-solid-lg">
                  <div className="mb-6 flex items-center justify-between border-b-4 border-brand-dark pb-4">
                    <span className="font-heading text-2xl font-bold">技术服务协议</span>
                  </div>

                  <div className="space-y-4 font-mono text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">甲方:</span>
                      <span className="bg-brand-accent px-1 font-bold">您</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">乙方:</span>
                      <span className="font-bold">点子 Lab</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">交付物:</span>
                      <span className="font-bold">MVP v1.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">知识产权:</span>
                      <span className="font-bold">100% 归您所有</span>
                    </div>
                  </div>

                  <div className="mt-8 border-t-2 border-dashed border-gray-300 pt-4">
                    <div className="-rotate-6 font-heading text-3xl font-bold text-brand-primary opacity-80">
                      协议已签署
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-10 left-0 z-10">
              <div
                className="animate-float-slow motion-reduce:animate-none"
                style={pauseLoops ? { animationPlayState: 'paused' } : undefined}
              >
                <div className="w-64 -rotate-3 border-4 border-brand-dark bg-brand-primary p-6 text-white shadow-solid">
                  <HardHat size={48} className="mb-4 text-brand-accent" aria-hidden="true" />
                  <div className="mb-2 font-heading text-2xl font-bold leading-none">脏活累活我们干</div>
                  <p className="font-mono text-xs opacity-80">
                    我们处理架构、安全、部署和扩展性问题，您只需专注于业务增长。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
