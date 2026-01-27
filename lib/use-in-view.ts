'use client'

import * as React from 'react'

type Options = IntersectionObserverInit

export function useInView<T extends Element>(ref: React.RefObject<T>, options: Options = {}): boolean {
  const [inView, setInView] = React.useState(false)
  const { root, rootMargin, threshold } = options

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    // Jest/jsdom doesn't ship this by default. Assume visible to avoid disabling UX in tests.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      root,
      rootMargin,
      threshold,
    })
    observer.observe(el)

    return () => observer.disconnect()
  }, [ref, root, rootMargin, threshold])

  return inView
}
