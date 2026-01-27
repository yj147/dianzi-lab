import Link from 'next/link'

import { cn } from '@/lib/utils'

type AdminTab = 'IDEAS' | 'USERS' | 'TRASH'

const TAB_CONFIG: Record<
  AdminTab,
  { label: string; href: string; description: string }
> = {
  IDEAS: {
    label: '项目管理',
    href: '/admin/ideas',
    description: '筛选有价值的项目，推动开发落地。',
  },
  USERS: {
    label: '用户管理',
    href: '/admin/users',
    description: '管理实验室成员及其权限。',
  },
  TRASH: {
    label: '回收站',
    href: '/admin/trash',
    description: '查看或恢复已删除的项目。',
  },
}

export default function AdminHeader({
  activeTab,
  trashCount = 0,
}: {
  activeTab: AdminTab
  trashCount?: number
}) {
  const description = TAB_CONFIG[activeTab].description

  return (
    <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="mb-2 font-heading text-3xl font-bold text-brand-dark md:text-4xl">主控制台</h1>
        <p className="text-lg text-gray-500">{description}</p>
      </div>

      <div className="flex rounded-lg border border-brand-dark/10 bg-white p-1 shadow-sm">
        {(
          [
            { key: 'IDEAS', ...TAB_CONFIG.IDEAS },
            { key: 'USERS', ...TAB_CONFIG.USERS },
            { key: 'TRASH', ...TAB_CONFIG.TRASH },
          ] as const
        ).map((tab) => {
          const active = tab.key === activeTab
          const showTrashCount = tab.key === 'TRASH' && trashCount > 0
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={cn(
                'rounded-md px-4 py-2 text-sm font-bold transition-all',
                active ? 'bg-brand-dark text-white' : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {tab.label}
              {showTrashCount ? (
                <span className="ml-2 rounded bg-red-100 px-1.5 text-xs text-red-600">
                  {trashCount}
                </span>
              ) : null}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
