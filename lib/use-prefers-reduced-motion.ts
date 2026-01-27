'use client'

import * as React from 'react'

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      setReduced(false)
      return
    }

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mediaAny = media as unknown as {
      addEventListener?: (type: string, listener: () => void) => void
      removeEventListener?: (type: string, listener: () => void) => void
      addListener?: (listener: () => void) => void
      removeListener?: (listener: () => void) => void
    }
    const update = () => setReduced(media.matches)
    update()

    // Prefer modern API; keep a tiny fallback for older Safari.
    if (typeof mediaAny.addEventListener === 'function') {
      mediaAny.addEventListener('change', update)
      return () => mediaAny.removeEventListener?.('change', update)
    }

    if (typeof mediaAny.addListener === 'function') {
      mediaAny.addListener(update)
      return () => mediaAny.removeListener?.(update)
    }
  }, [])

  return reduced
}
