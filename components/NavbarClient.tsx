'use client';

import { useState } from 'react';
import Link from 'next/link';
import { logout } from '@/lib/auth-actions';

interface NavbarClientProps {
  isLoggedIn: boolean;
  userEmail?: string;
}

export default function NavbarClient({ isLoggedIn, userEmail }: NavbarClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    await logout();
  };

  const handleMobileLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    await logout();
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md dark:bg-black/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              点子实验室
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                首页
              </Link>
              <Link
                href="/submit"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                提交点子
              </Link>
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{userEmail}</span>
                  <form onSubmit={handleLogout}>
                    <button
                      type="submit"
                      className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      退出
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  登录
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-800"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">打开主菜单</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        hidden={!isOpen}
        className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white dark:bg-black`}
      >
        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
          <Link
            href="/"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={() => setIsOpen(false)}
          >
            首页
          </Link>
          <Link
            href="/submit"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={() => setIsOpen(false)}
          >
            提交点子
          </Link>
          {isLoggedIn ? (
            <div className="px-3 py-2">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{userEmail}</div>
              <form onSubmit={handleMobileLogout}>
                <button
                  type="submit"
                  className="w-full text-left block rounded-md bg-gray-200 px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  退出
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="block rounded-md bg-blue-600 px-3 py-2 text-base font-medium text-white hover:bg-blue-700"
              onClick={() => setIsOpen(false)}
            >
              登录
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
