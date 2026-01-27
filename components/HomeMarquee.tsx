'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { useInView } from '@/lib/use-in-view'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

type Shipment = {
  id: string
  title: string
  tags: string[]
}

function getTypeLabel(tags: string[]): string {
  const value = tags[0]?.trim()
  return value ? value : 'WEB APP'
}

function ShipmentCard({ idea }: { idea: Shipment }) {
  const name = '匿名客户'
  const typeLabel = getTypeLabel(idea.tags)

  return (
    <div className="group relative mx-4 flex h-80 w-72 shrink-0 cursor-pointer flex-col border-2 border-transparent bg-white transition-transform duration-200 hover:-translate-y-1 motion-reduce:transition-none">
      <div className="relative z-10 flex items-center gap-3 border-b-2 border-gray-100 bg-white p-5">
        <div className="flex size-10 items-center justify-center rounded-full bg-brand-dark font-heading font-bold text-white">
          {name.slice(0, 1)}
        </div>
        <div className="min-w-0">
          <div className="truncate font-bold text-brand-dark">{name}</div>
          <div className="text-xs text-gray-400">需求方</div>
        </div>
      </div>

      <div className="relative flex flex-1 overflow-hidden bg-gray-50 transition-colors duration-200 group-hover:bg-blue-50/30 motion-reduce:transition-none">
        <div className="flex h-full w-full items-end gap-1 p-4">
          <div className="h-10 w-1/4 rounded-t bg-brand-primary/20 transition-all duration-300 group-hover:h-14 motion-reduce:transition-none" aria-hidden="true" />
          <div className="h-20 w-1/4 rounded-t bg-brand-primary/40 transition-all duration-300 group-hover:h-24 motion-reduce:transition-none" aria-hidden="true" />
          <div className="h-14 w-1/4 rounded-t bg-brand-primary/60 transition-all duration-300 group-hover:h-18 motion-reduce:transition-none" aria-hidden="true" />
          <div className="h-24 w-1/4 rounded-t bg-brand-primary transition-all duration-300 group-hover:h-28 motion-reduce:transition-none" aria-hidden="true" />
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="inline-block rounded border border-gray-200 bg-white px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-gray-500">
            {typeLabel}
          </div>
          <div className="mt-1 line-clamp-2 font-heading text-lg font-bold text-brand-dark">{idea.title}</div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 border-2 border-brand-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:transition-none" />
    </div>
  )
}

export default function HomeMarquee({ items, reverse = false }: { items: Shipment[]; reverse?: boolean }) {
  const reducedMotion = usePrefersReducedMotion()
  const { ref: containerRef, inView } = useInView<HTMLDivElement>({ rootMargin: '200px 0px' })
  const [isHovered, setIsHovered] = React.useState(false)

  const isPaused = reducedMotion || !inView || isHovered

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex w-full border-y-2 border-brand-dark bg-brand-dark py-4',
        reducedMotion ? 'overflow-x-auto overflow-y-hidden scrollbar-hide' : 'overflow-hidden'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          'flex gap-8 whitespace-nowrap motion-reduce:animate-none',
          reducedMotion ? 'w-max' : 'min-w-full',
          reducedMotion ? '' : reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        )}
        style={reducedMotion ? undefined : { animationPlayState: isPaused ? 'paused' : 'running' }}
      >
        {items.map((idea) => (
          <ShipmentCard key={`a-${idea.id}`} idea={idea} />
        ))}
        {!reducedMotion
          ? items.map((idea) => <ShipmentCard key={`b-${idea.id}`} idea={idea} />)
          : null}
      </div>
    </div>
  )
}
