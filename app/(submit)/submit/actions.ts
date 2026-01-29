'use server'

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { submitIdeaSchema, TAGS } from './schema'

export type ActionResult =
  | { success: true; ideaId: string }
  | { success: false; error: string; field?: string }

function readFormString(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value : ''
}

export async function submitIdea(formData: FormData): Promise<ActionResult> {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const title = readFormString(formData, 'title')
  const description = readFormString(formData, 'description')
  const tagsRaw = formData.getAll('tags')

  const tags = tagsRaw
    .filter((t): t is string => typeof t === 'string')
    .filter((t): t is (typeof TAGS)[number] =>
      TAGS.includes(t as (typeof TAGS)[number])
    )

  const parsed = submitIdeaSchema.safeParse({ title, description, tags })
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return {
      success: false,
      error: firstError.message,
      field:
        firstError.path[0] === undefined
          ? undefined
          : String(firstError.path[0]),
    }
  }

  const idea = await prisma.idea.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      tags: parsed.data.tags,
      userId: session.sub,
      status: 'PENDING',
    },
  })

  return { success: true, ideaId: idea.id }
}
