import { format } from 'date-fns'
import { UsersIcon } from 'lucide-react'

import { getUsers } from './_queries'

function RoleBadge({ role }: { role: string }) {
  if (role === 'ADMIN') {
    return (
      <span className="inline-flex items-center rounded-full border-2 border-brand-dark bg-brand-dark px-2.5 py-0.5 text-xs font-bold text-white">
        管理员
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-full border-2 border-brand-dark bg-white px-2.5 py-0.5 text-xs font-bold text-brand-dark">
      用户
    </span>
  )
}

// Mobile card component
function UserCard({ user }: {
  user: {
    id: string
    email: string
    role: string
    createdAt: Date
    _count: { ideas: number }
  }
}) {
  return (
    <div className="rounded-xl border-2 border-brand-dark bg-brand-surface p-4 shadow-solid-sm">
      <div className="mb-2 flex items-start justify-between gap-3">
        <p className="truncate font-bold text-brand-dark">{user.email}</p>
        <RoleBadge role={user.role} />
      </div>
      <div className="flex items-center justify-between text-sm tabular-nums text-gray-600">
        <span className="font-mono text-xs text-gray-500">注册于 {format(user.createdAt, 'yyyy-MM-dd')}</span>
        <span className="font-heading font-bold text-brand-dark">{user._count.ideas} 个点子</span>
      </div>
    </div>
  )
}

export default async function AdminUsersPage() {
  const users = await getUsers()

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-balance font-heading text-3xl font-bold text-brand-dark sm:text-4xl">用户管理</h1>
        <p className="text-pretty mt-2 text-gray-600">查看用户信息与点子提交数量。</p>
      </header>

      <div className="overflow-hidden rounded-xl border-2 border-brand-dark bg-brand-surface shadow-solid-sm">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-brand-primary text-white shadow-solid-sm">
              <UsersIcon className="size-6" aria-hidden="true" />
            </div>
            <p className="text-balance font-heading text-xl font-bold text-brand-dark">暂无用户</p>
            <p className="text-pretty mt-3 text-sm text-gray-600">等待用户注册。</p>
          </div>
        ) : (
          <>
            {/* Desktop table view */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs font-bold text-gray-600">
                  <tr className="border-b-2 border-brand-dark">
                    <th scope="col" className="px-6 py-4">
                      邮箱
                    </th>
                    <th scope="col" className="px-6 py-4">
                      角色
                    </th>
                    <th scope="col" className="px-6 py-4">
                      注册时间
                    </th>
                    <th scope="col" className="px-6 py-4 text-right">
                      提交点子数
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-dark/10 text-gray-700">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-gray-50/60"
                    >
                      <td className="px-6 py-5 font-bold text-brand-dark">
                        {user.email}
                      </td>
                      <td className="px-6 py-5">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-6 py-5 font-mono text-xs text-gray-600">
                        {format(user.createdAt, 'yyyy-MM-dd')}
                      </td>
                      <td className="px-6 py-5 text-right font-heading font-bold tabular-nums text-brand-dark">
                        {user._count.ideas}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="grid gap-3 p-4 md:hidden">
              {users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
