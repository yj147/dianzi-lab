'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { useInView } from '@/lib/use-in-view'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

type PulseDotProps = React.ComponentPropsWithoutRef<'span'> & {
  paused?: boolean
}

export default function PulseDot({
  className,
  paused,
  style,
  ...props
}: PulseDotProps) {
  const reducedMotion = usePrefersReducedMotion()
  const { ref: dotRef, inView } = useInView<HTMLSpanElement>({
    rootMargin: '200px 0px',
  })

  const shouldPause = Boolean(paused) || reducedMotion || !inView

  return (
    <span
      ref={dotRef}
      className={cn(
        'inline-block size-2 rounded-full animate-pulse motion-reduce:animate-none',
        className
      )}
      style={{
        ...style,
        ...(reducedMotion
          ? null
          : { animationPlayState: shouldPause ? 'paused' : 'running' }),
      }}
      aria-hidden="true"
      {...props}
    />
  )
}
