'use client'

import * as React from 'react'
import Link from 'next/link'
import { HardHat, ScrollText } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

import PulseDot from '@/components/PulseDot'
import { Button } from '@/components/ui/button'
import { useInView } from '@/lib/use-in-view'

const floatAnimation = {
  y: [0, -16, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
}

const floatSlowAnimation = {
  y: [0, -14, 0],
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
}

export default function Hero() {
  const reducedMotion = useReducedMotion()
  const { ref: sectionRef, inView } = useInView<HTMLElement>({ rootMargin: '200px 0px' })
  const shouldAnimate = !reducedMotion && inView

  return (
    <section
      ref={sectionRef}
      className="relative z-10 flex flex-col justify-center border-b-2 border-border bg-background/90 pb-20 pt-24 backdrop-blur-sm md:min-h-dvh"
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="animate-fade-in-left motion-reduce:animate-none">
            <div className="mb-8 inline-flex items-center gap-2 bg-foreground px-4 py-1.5 font-mono text-sm font-bold text-background shadow-solid-sm">
              <PulseDot className="bg-yellow-400" paused={!shouldAnimate} />
              筹备中 // COMING SOON
            </div>

            <h1 className="mb-8 font-heading text-6xl font-bold leading-[0.95] tracking-tight text-foreground md:text-7xl">
              您的专属 <br />
              <span className="bg-brand-accent/20 px-2 text-brand-primary lg:-ml-2">技术合伙人</span> <br />
              (As A Service)
            </h1>

            <p className="mb-10 max-w-lg border-l-4 border-brand-primary py-2 pl-6 text-pretty text-xl font-medium leading-relaxed text-foreground/80 md:text-2xl">
              您提供商业愿景，我们提供成建制的工程团队、技术路线图和交付代码。无需出让任何股权。
            </p>

            <div className="flex flex-col gap-5 sm:flex-row">
              <Button
                asChild
                className="group h-16 bg-brand-primary px-8 text-xl uppercase tracking-wider hover:-translate-y-1 hover:bg-brand-accent hover:text-foreground dark:hover:text-background active:bg-brand-accent/90 active:text-foreground"
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
            <motion.div
              className="absolute right-10 top-0 z-20"
              animate={shouldAnimate ? floatAnimation : undefined}
            >
              <div className="rotate-2">
                <div className="w-80 border-4 border-foreground bg-surface p-8 shadow-solid-lg dark:border-border">
                  <div className="mb-6 flex items-center justify-between border-b-4 border-foreground pb-4 dark:border-border">
                    <span className="font-heading text-2xl font-bold text-foreground">技术服务协议</span>
                  </div>

                  <div className="space-y-4 font-mono text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">甲方:</span>
                      <span className="bg-brand-accent px-1 font-bold text-foreground dark:text-background">您</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">乙方:</span>
                      <span className="font-bold text-foreground">Bambi Lab Idea</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">交付物:</span>
                      <span className="font-bold text-foreground">MVP v1.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">知识产权:</span>
                      <span className="font-bold text-foreground">100% 归您所有</span>
                    </div>
                  </div>

                  <div className="mt-8 border-t-2 border-dashed border-border pt-4">
                    <div className="-rotate-6 font-heading text-3xl font-bold text-brand-primary opacity-80">
                      协议已签署
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-10 left-0 z-10"
              animate={shouldAnimate ? floatSlowAnimation : undefined}
            >
              <div className="-rotate-3">
                <div className="w-64 border-4 border-foreground bg-brand-primary p-6 text-white shadow-solid dark:border-border">
                  <HardHat size={48} className="mb-4 text-brand-accent" aria-hidden="true" />
                  <div className="mb-2 font-heading text-2xl font-bold leading-none">脏活累活我们干</div>
                  <p className="font-mono text-xs opacity-80">
                    我们处理架构、安全、部署和扩展性问题，您只需专注于业务增长。
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
