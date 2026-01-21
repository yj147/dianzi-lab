import { prisma } from '@/lib/db';
import { 
  CheckCircle, 
  Clock, 
  Code, 
  Lightbulb, 
  Trophy, 
  Users 
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
  { key: 'total', label: '总点子数', color: 'bg-blue-500', icon: Lightbulb },
  { key: 'pending', label: '待审核', color: 'bg-gray-500', icon: Clock },
  { key: 'approved', label: '已采纳', color: 'bg-blue-400', icon: CheckCircle },
  { key: 'inProgress', label: '开发中', color: 'bg-orange-500', icon: Code },
  { key: 'completed', label: '已完成', color: 'bg-green-500', icon: Trophy },
  { key: 'users', label: '总用户数', color: 'bg-purple-500', icon: Users },
] as const;

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">仪表板</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {STAT_CARDS.map(({ key, label, color, icon: Icon }) => (
          <div key={key} className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">{label}</div>
                <div className="mt-2 text-3xl font-bold">{stats[key]}</div>
              </div>
              <div className={`rounded-xl p-3 text-white ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-white p-12 text-center dark:bg-gray-900">
        <h2 className="text-xl font-semibold">欢迎来到管理员后台</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          请从侧边栏选择一个项目开始管理。
        </p>
      </div>
    </div>
  );
}
