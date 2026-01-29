'use client'

import type { IdeaStatus } from '@prisma/client'
import { User } from 'lucide-react'

import StatusBadge from '@/components/StatusBadge'
import { cn } from '@/lib/utils'

type IdeaCardProps = {
  idea: {
    id: string
    title: string
    description: string
    tags: string[]
    status: IdeaStatus
    authorName: string
  }
  className?: string
}

export default function IdeaCard({ idea, className }: IdeaCardProps) {
  return (
    <div
      className={cn(
        'group relative flex h-full flex-col rounded-xl border-2 border-brand-dark bg-surface p-5 shadow-solid-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-1.5 hover:shadow-solid motion-reduce:transition-none',
        className
      )}
    >
      <div className="mb-3 flex items-start justify-between">
        <StatusBadge status={idea.status} size="sm" />
        <span className="font-mono text-xs text-muted-foreground">
          #{idea.id}
        </span>
      </div>

      <h3 className="mb-2 font-heading text-xl font-bold leading-tight text-brand-dark transition-colors group-hover:text-primary">
        {idea.title}
      </h3>

      <p className="mb-4 flex-grow text-sm text-muted-foreground line-clamp-3">
        {idea.description}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
        <div className="flex gap-2">
          {idea.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <User size={12} aria-hidden="true" />
          {idea.authorName}
        </div>
      </div>
    </div>
  )
}
