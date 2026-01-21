import { format } from 'date-fns'

import { getUsers } from './_queries'

function formatRole(role: string): string {
  if (role === 'ADMIN') return '管理员'
  if (role === 'USER') return '用户'
  return role
}

export default async function AdminUsersPage() {
  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">用户管理</h1>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600 dark:bg-gray-800 dark:text-gray-200">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">
                  邮箱
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  角色
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  注册时间
                </th>
                <th scope="col" className="px-6 py-4 text-right font-medium">
                  提交点子数
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {formatRole(user.role)}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {format(user.createdAt, 'yyyy-MM-dd')}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-gray-100">
                    {user._count.ideas}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    暂无用户
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

