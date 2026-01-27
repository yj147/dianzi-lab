import Link from 'next/link'
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Code,
  Lightbulb,
  Trash2,
  Trophy,
  Users,
} from 'lucide-react'

import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

async function getStats() {
  const [total, pending, approved, inProgress, completed, users] = await prisma.$transaction([
    prisma.idea.count({ where: { isDeleted: false } }),
    prisma.idea.count({ where: { status: 'PENDING', isDeleted: false } }),
    prisma.idea.count({ where: { status: 'APPROVED', isDeleted: false } }),
    prisma.idea.count({ where: { status: 'IN_PROGRESS', isDeleted: false } }),
    prisma.idea.count({ where: { status: 'COMPLETED', isDeleted: false } }),
    prisma.user.count(),
  ])

  return { total, pending, approved, inProgress, completed, users }
}

const STAT_CARDS = [
  { key: 'total', label: '总点子数', icon: Lightbulb },
  { key: 'pending', label: '待审核', icon: Clock },
  { key: 'approved', label: '已采纳', icon: CheckCircle2 },
  { key: 'inProgress', label: '开发中', icon: Code },
  { key: 'completed', label: '已完成', icon: Trophy },
  { key: 'users', label: '总用户数', icon: Users },
] as const

const QUICK_ACTIONS = [
  { href: '/admin/ideas', label: '梦境管理', icon: Lightbulb, description: '审核和管理用户提交的奇思妙想' },
  { href: '/admin/users', label: '用户管理', icon: Users, description: '查看和管理平台用户' },
  { href: '/admin/trash', label: '回收站', icon: Trash2, description: '查看已删除的内容' },
] as const

export default async function AdminDashboardPage() {
  const [stats, session] = await Promise.all([getStats(), getSession()])

  const emailValue = session?.email?.trim()
  const email = emailValue || '管理员'
  const initial = emailValue ? emailValue.slice(0, 1).toUpperCase() : 'A'

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-balance font-heading text-3xl font-bold text-brand-dark sm:text-4xl">仪表板</h1>
        <p className="text-pretty mt-2 text-gray-600">系统数据概览与快捷操作。</p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {STAT_CARDS.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className="rounded-xl border-2 border-brand-dark bg-brand-surface p-6 shadow-solid-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-gray-600">{label}</p>
                <p className="mt-1 tabular-nums font-heading text-4xl font-bold text-brand-dark">
                  {stats[key]}
                </p>
              </div>
              <div className="flex size-12 items-center justify-center rounded-full bg-brand-primary text-white shadow-solid-sm">
                <Icon className="size-6" aria-hidden="true" />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-xl border-2 border-brand-dark bg-brand-surface p-8 shadow-solid-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-brand-dark">快捷操作</h2>
            <p className="text-pretty mt-1 text-sm text-gray-600">常用入口，一步到位。</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-brand-dark text-sm font-heading font-bold text-white">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-brand-dark">{email}</p>
              <p className="font-mono text-xs text-gray-400">ADMIN</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {QUICK_ACTIONS.map(({ href, label, icon: Icon, description }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-xl border-2 border-brand-dark bg-white p-5 shadow-solid-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-brand-primary text-white shadow-solid-sm">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-base font-bold text-brand-dark">{label}</span>
                    <ArrowUpRight
                      className="size-4 text-gray-400 transition-colors group-hover:text-brand-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-pretty mt-1 text-sm text-gray-600">{description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
