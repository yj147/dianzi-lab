'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Lightbulb, 
  Users, 
  Trash2, 
  LogOut 
} from 'lucide-react';
import { logout } from '@/lib/auth-actions';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/admin', label: '仪表板', icon: LayoutDashboard, exact: true },
  { href: '/admin/ideas', label: '点子管理', icon: Lightbulb },
  { href: '/admin/users', label: '用户管理', icon: Users },
  { href: '/admin/trash', label: '垃圾箱', icon: Trash2 }
];

interface AdminSidebarProps {
  userEmail: string;
  className?: string;
  onItemClick?: () => void;
}

export default function AdminSidebar({ userEmail, className, onItemClick }: AdminSidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className={cn("flex h-full w-60 flex-col border-r bg-white dark:bg-gray-900", className)}>
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
          点子 Lab 后台
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="md:hidden border-t p-4">
        <div className="mb-4 px-3">
          <p className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">登录账号</p>
          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{userEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <LogOut className="mr-3 h-5 w-5" />
          退出登录
        </button>
      </div>

      <div className="py-4 text-center text-xs text-gray-400 dark:text-gray-500">
        © 2026 点子 Lab
      </div>
    </aside>
  );
}
