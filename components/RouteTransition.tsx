'use client'

import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { usePathname } from 'next/navigation'

export default function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const reducedMotion = useReducedMotion()

  if (reducedMotion) return <>{children}</>

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        data-route-transition=""
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
