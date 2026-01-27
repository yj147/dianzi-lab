'use client'

import * as React from 'react'

type Options = IntersectionObserverInit

export function useInView<T extends Element>(
  options: Options = {}
): { ref: (node: T | null) => void; inView: boolean } {
  const [inView, setInView] = React.useState(false)
  const [node, setNode] = React.useState<T | null>(null)
  const { root, rootMargin, threshold } = options

  const ref = React.useCallback((next: T | null) => {
    setNode(next)
  }, [])

  React.useEffect(() => {
    if (!node) {
      setInView(false)
      return
    }

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
    observer.observe(node)

    return () => observer.disconnect()
  }, [node, root, rootMargin, threshold])

  return { ref, inView }
}
