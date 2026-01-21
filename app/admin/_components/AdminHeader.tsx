'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  userEmail: string;
}

export default function AdminHeader({ userEmail }: AdminHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
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
