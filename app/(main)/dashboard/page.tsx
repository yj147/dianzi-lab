import Link from 'next/link'
import { redirect } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import LogoutButton from '@/components/LogoutButton'
import StatusBadge from '@/components/StatusBadge'
import EmptyState from '@/components/EmptyState'
import { Lightbulb } from 'lucide-react'

async function getMyIdeas(userId: string) {
  return prisma.idea.findMany({
    where: { userId, isDeleted: false },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, description: true, status: true, createdAt: true },
  })
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const ideas = await getMyIdeas(session.sub)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <header className="container mx-auto flex items-center justify-between px-4 py-6">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          ← 返回首页
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{session.email}</span>
          <LogoutButton />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">我的点子</h1>

        {ideas.length > 0 ? (
          <div className="space-y-4">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">{idea.title}</h3>
                    <p className="mb-3 text-gray-600">
                      {idea.description.length > 150
                        ? idea.description.slice(0, 150) + '...'
                        : idea.description}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatDistanceToNow(idea.createdAt, { addSuffix: true, locale: zhCN })}
                    </p>
                  </div>
                  <StatusBadge status={idea.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Lightbulb className="h-12 w-12" />}
            message="还没有提交过点子"
          />
        )}

        {ideas.length === 0 && (
          <div className="mt-4 text-center">
            <Link
              href="/submit"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              提交第一个点子
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
