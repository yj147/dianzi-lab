'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { cn } from '@/lib/utils';
import { logout } from '@/lib/auth-actions';

interface AdminHeaderProps {
  userEmail: string;
}

const breadcrumbMap: Record<string, string> = {
  '/admin': '仪表板',
  '/admin/ideas': '点子管理',
  '/admin/users': '用户管理',
  '/admin/trash': '垃圾箱',
};

export default function AdminHeader({ userEmail }: AdminHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-30 hidden h-16 items-center justify-between border-b bg-white/80 px-8 backdrop-blur-md dark:bg-gray-900/80 md:flex">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>后台管理</span>
          <span>/</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {breadcrumbMap[pathname] || '仪表板'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">{userEmail}</span>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="退出登录"
          >
            <LogOut className="h-4 w-4" />
            <span>退出登录</span>
          </button>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/80 px-4 backdrop-blur-md dark:bg-gray-900/80 md:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-bold text-blue-600 dark:text-blue-400">点子 Lab 后台</span>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
          data-testid="sidebar-overlay"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-60 transform bg-white transition-transform duration-300 ease-in-out md:hidden dark:bg-gray-900",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-6">
          <span className="font-bold text-blue-600 dark:text-blue-400">管理菜单</span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <AdminSidebar 
          userEmail={userEmail} 
          className="border-r-0" 
          onItemClick={() => setIsMobileMenuOpen(false)} 
        />
      </div>
    </>
  );
}
