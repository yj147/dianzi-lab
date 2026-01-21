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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            仪表板
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            系统数据概览与快捷操作
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STAT_CARDS.map(({ key, label, gradient, shadowColor, icon: Icon }) => (
          <div
            key={key}
            className="group relative rounded-2xl border border-gray-200/60 bg-white p-6
                       shadow-sm transition-[transform,box-shadow,border-color] duration-300 ease-out
                       hover:scale-[1.02] hover:shadow-lg hover:border-gray-300/60
                       motion-reduce:transition-none motion-reduce:hover:scale-100
                       dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {label}
                </p>
                <p className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                  {stats[key]}
                </p>
              </div>
              <div
                className={`rounded-xl bg-gradient-to-br ${gradient} p-3
                           shadow-lg ${shadowColor} transition-transform duration-300
                           group-hover:scale-110`}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Welcome Card with Quick Actions */}
      <div className="rounded-2xl border border-gray-200/60 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-100 px-6 py-5 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full
                          bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
              <span className="text-sm font-bold text-white">
                {session?.email?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                欢迎回来
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {session?.email || '管理员'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            快捷操作
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {QUICK_ACTIONS.map(({ href, label, icon: Icon, description }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-start gap-4 rounded-xl border border-gray-200/60
                         bg-gray-50/50 p-4 transition-[border-color,background-color] duration-200
                         hover:border-blue-200 hover:bg-blue-50/50
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                         motion-reduce:transition-none
                         dark:border-gray-800 dark:bg-gray-800/50
                         dark:hover:border-blue-800 dark:hover:bg-blue-900/20
                         dark:focus-visible:ring-offset-gray-900"
              >
                <div className="rounded-lg bg-white p-2 shadow-sm ring-1 ring-gray-200/60
                              dark:bg-gray-800 dark:ring-gray-700">
                  <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-900 dark:text-gray-50">
                      {label}
                    </span>
                    <ArrowRight className="h-4 w-4 text-gray-400 transition-transform
                                         group-hover:translate-x-0.5 group-hover:text-blue-500
                                         dark:text-gray-500 dark:group-hover:text-blue-400" />
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 truncate">
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
