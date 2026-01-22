import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import {
  CheckCircle,
  Clock,
  Code,
  Lightbulb,
  Trophy,
  Users,
  ArrowRight,
  Trash2
} from 'lucide-react';

async function getStats() {
  const [total, pending, approved, inProgress, completed, users] = await prisma.$transaction([
    prisma.idea.count({ where: { isDeleted: false } }),
    prisma.idea.count({ where: { status: 'PENDING', isDeleted: false } }),
    prisma.idea.count({ where: { status: 'APPROVED', isDeleted: false } }),
    prisma.idea.count({ where: { status: 'IN_PROGRESS', isDeleted: false } }),
    prisma.idea.count({ where: { status: 'COMPLETED', isDeleted: false } }),
    prisma.user.count(),
  ]);

  return { total, pending, approved, inProgress, completed, users };
}

const STAT_CARDS = [
  {
    key: 'total',
    label: '总点子数',
    gradient: 'from-blue-500 to-blue-600',
    shadowColor: 'shadow-blue-500/25',
    icon: Lightbulb
  },
  {
    key: 'pending',
    label: '待审核',
    gradient: 'from-amber-500 to-orange-500',
    shadowColor: 'shadow-amber-500/25',
    icon: Clock
  },
  {
    key: 'approved',
    label: '已采纳',
    gradient: 'from-cyan-500 to-blue-500',
    shadowColor: 'shadow-cyan-500/25',
    icon: CheckCircle
  },
  {
    key: 'inProgress',
    label: '开发中',
    gradient: 'from-orange-500 to-red-500',
    shadowColor: 'shadow-orange-500/25',
    icon: Code
  },
  {
    key: 'completed',
    label: '已完成',
    gradient: 'from-emerald-500 to-green-600',
    shadowColor: 'shadow-emerald-500/25',
    icon: Trophy
  },
  {
    key: 'users',
    label: '总用户数',
    gradient: 'from-violet-500 to-purple-600',
    shadowColor: 'shadow-violet-500/25',
    icon: Users
  },
] as const;

const QUICK_ACTIONS = [
  { href: '/admin/ideas', label: '点子管理', icon: Lightbulb, description: '审核和管理用户提交的点子' },
  { href: '/admin/users', label: '用户管理', icon: Users, description: '查看和管理平台用户' },
  { href: '/admin/trash', label: '回收站', icon: Trash2, description: '查看已删除的内容' },
];

export default async function AdminDashboardPage() {
  const [stats, session] = await Promise.all([
    getStats(),
    getSession()
  ]);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            仪表板
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            系统数据概览与快捷操作
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {STAT_CARDS.map(({ key, label, gradient, shadowColor, icon: Icon }) => (
          <div
            key={key}
            className="group relative rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl p-6
                       shadow-sm transition-all duration-300 ease-out
                       hover:-translate-y-1 hover:shadow-lg hover:border-white/60 hover:bg-white/60"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {label}
                </p>
                <p className="text-4xl font-bold tracking-tight text-foreground">
                  {stats[key]}
                </p>
              </div>
              <div
                className={`rounded-2xl bg-gradient-to-br ${gradient} p-3.5
                           shadow-md ${shadowColor} transition-transform duration-300
                           group-hover:scale-110 group-hover:rotate-3`}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Welcome Card with Quick Actions */}
      <div className="rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl shadow-sm transition-all hover:shadow-md">
        <div className="border-b border-gray-100/50 px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full
                          bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 ring-2 ring-white">
              <span className="text-lg font-bold text-white">
                {session?.email?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-foreground">
                欢迎回来
              </h2>
              <p className="text-sm text-muted-foreground truncate">
                {session?.email || '管理员'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <h3 className="mb-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
            快捷操作
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {QUICK_ACTIONS.map(({ href, label, icon: Icon, description }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-start gap-4 rounded-2xl border border-white/60
                         bg-white/50 p-5 transition-all duration-200
                         hover:border-primary/30 hover:bg-white/80 hover:shadow-md
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <div className="rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-gray-100 transition-colors group-hover:bg-blue-50 group-hover:text-primary">
                  <Icon className="h-5 w-5 text-gray-500 transition-colors group-hover:text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-foreground">
                      {label}
                    </span>
                    <ArrowRight className="h-4 w-4 text-gray-400 transition-all
                                         group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground truncate leading-relaxed">
                    {description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
