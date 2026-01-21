import { format } from 'date-fns'
import { UsersIcon } from 'lucide-react'

import { getUsers } from './_queries'

function RoleBadge({ role }: { role: string }) {
  if (role === 'ADMIN') {
    return (
      <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
        管理员
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-400">
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
    <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-900">
      <div className="mb-2 flex items-start justify-between gap-3">
        <p className="font-medium text-gray-900 dark:text-gray-100">{user.email}</p>
        <RoleBadge role={user.role} />
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>注册于 {format(user.createdAt, 'yyyy-MM-dd')}</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {user._count.ideas} 个点子
        </span>
      </div>
    </div>
  )
}

export default async function AdminUsersPage() {
  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">用户管理</h1>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-gray-900">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
              <UsersIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">暂无用户</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              等待用户注册
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table view */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium">
                      邮箱
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      角色
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      注册时间
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-medium">
                      提交点子数
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                        {user.email}
                      </td>
                      <td className="px-4 py-3">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {format(user.createdAt, 'yyyy-MM-dd')}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
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
