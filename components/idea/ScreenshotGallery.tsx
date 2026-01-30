'use client'

// 这里使用 <img> 支持任意外链截图 URL（避免 next/image 需要配置 remotePatterns）。
/* eslint-disable @next/next/no-img-element */

import * as React from 'react'
import { X } from 'lucide-react'

type ScreenshotGalleryProps = {
  screenshots: string[]
  title: string
}

export default function ScreenshotGallery({
  screenshots,
  title,
}: ScreenshotGalleryProps) {
  const items = screenshots.map((url) => url.trim()).filter(Boolean)
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

  const activeUrl = activeIndex === null ? null : items[activeIndex] ?? null

  const closeButtonRef = React.useRef<HTMLButtonElement | null>(null)
  const previouslyFocusedRef = React.useRef<Element | null>(null)

  React.useEffect(() => {
    if (activeIndex === null) return

    previouslyFocusedRef.current = document.activeElement
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveIndex(null)
    }

    document.addEventListener('keydown', onKeyDown)
    const raf = requestAnimationFrame(() => closeButtonRef.current?.focus())

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''

      const previous = previouslyFocusedRef.current
      if (previous instanceof HTMLElement) {
        previous.focus()
      }
    }
  }, [activeIndex])

  if (items.length === 0) return null

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((url, index) => (
          <button
            key={`${url}-${index}`}
            type="button"
            className="group relative overflow-hidden rounded-xl border-2 border-brand-dark bg-muted shadow-solid-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-solid motion-reduce:transition-none"
            onClick={() => setActiveIndex(index)}
          >
            <img
              src={url}
              alt={`${title} 截图 ${index + 1}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="h-48 w-full object-cover"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-brand-primary/0 transition-colors duration-200 group-hover:bg-brand-primary/10 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </button>
        ))}
      </div>

      {activeUrl ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="截图预览"
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveIndex(null)
          }}
        >
          <div className="relative w-full max-w-5xl">
            <button
              ref={closeButtonRef}
              type="button"
              className="absolute right-2 top-2 inline-flex size-10 items-center justify-center rounded-full border-2 border-brand-dark bg-surface shadow-solid-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-solid motion-reduce:transition-none"
              onClick={() => setActiveIndex(null)}
              aria-label="关闭预览"
            >
              <X className="size-5" aria-hidden="true" />
            </button>

            <img
              src={activeUrl}
              alt={`${title} 放大预览`}
              referrerPolicy="no-referrer"
              className="max-h-[80vh] w-full rounded-xl border-2 border-brand-dark bg-surface object-contain shadow-solid-lg"
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
