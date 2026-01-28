import { UsersIcon } from 'lucide-react'

import { prisma } from '@/lib/db'
import AdminHeader from '@/app/admin/_components/AdminHeader'
import { cn } from '@/lib/utils'
import { getUsers } from './_queries'

function getDisplayName(email: string): string {
  const trimmed = email.trim()
  if (!trimmed) return '用户'
  const local = trimmed.split('@')[0]?.trim()
  return local ? local : trimmed
}

function RolePill({ role }: { role: string }) {
  const isAdmin = role === 'ADMIN'
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        isAdmin ? 'bg-brand-primary/10 text-brand-primary' : 'bg-muted text-foreground'
      )}
    >
      {role}
    </span>
  )
}

export default async function AdminUsersPage() {
  const [users, trashCount] = await Promise.all([
    getUsers(),
    prisma.idea.count({ where: { isDeleted: true } }),
  ])

  return (
    <div>
      <AdminHeader activeTab="USERS" trashCount={trashCount} />

      <div className="overflow-hidden rounded-xl border-2 border-brand-dark bg-surface shadow-solid">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-brand-primary text-white shadow-solid-sm">
              <UsersIcon className="size-6" aria-hidden="true" />
            </div>
            <p className="text-balance font-heading text-xl font-bold text-brand-dark">暂无用户</p>
            <p className="text-pretty mt-3 text-sm text-muted-foreground">等待用户注册。</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted border-b-2 border-brand-dark text-xs uppercase text-muted-foreground font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">用户</th>
                  <th className="px-6 py-4">角色</th>
                  <th className="px-6 py-4">状态</th>
                  <th className="px-6 py-4 text-right">管理</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => {
                  const displayName = getDisplayName(user.email)
                  const initial = displayName.slice(0, 1).toUpperCase()
                  return (
                    <tr key={user.id} className="hover:bg-muted transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-dark text-background flex items-center justify-center font-heading font-bold">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate font-bold text-brand-dark">{displayName}</div>
                            <div className="truncate text-xs text-muted-foreground font-mono">
                              ID: {user.id} · {user._count.ideas} 个项目
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <RolePill role={user.role} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm text-brand-success font-bold">
                          <span className="w-2 h-2 rounded-full bg-brand-success" aria-hidden="true" />
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-bold text-muted-foreground">暂无操作</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
