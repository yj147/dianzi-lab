import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            控制面板
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            欢迎回来，<span className="font-medium text-indigo-600">{session.email}</span>
          </p>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-8">
          <div className="rounded-lg bg-indigo-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-indigo-800">当前角色</span>
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800 uppercase">
                {session.role}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          这是您的个人仪表盘占位页
        </div>
      </div>
    </div>
  )
}
