'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/lib/auth-actions';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';

interface NavbarClientProps {
  isLoggedIn: boolean;
  userEmail?: string;
}

export default function NavbarClient({ isLoggedIn, userEmail }: NavbarClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  const handleLogout = async () => {
    await logout();
  };

  const navLinks = [
    { name: '首页', href: '/' },
    { name: '提交点子', href: '/submit' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-200 ease-out',
        isScrolled
          ? 'bg-white/80 backdrop-blur-lg dark:bg-black/80 border-b border-gray-200/50 dark:border-gray-800/50'
          : 'bg-transparent'
      )}
    >
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
            <div className="ml-10 flex items-center space-x-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg',
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400',
                      // Hover underline effect
                      'after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100',
                      isActive && 'after:scale-x-100'
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="ml-4 flex items-center space-x-2 rounded-full bg-gray-100/50 p-1 transition-colors hover:bg-gray-200/50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900">
                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="sr-only">用户菜单</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">我的账户</p>
                        <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                          {userEmail}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex w-full items-center cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>仪表板</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400 cursor-pointer"
                      onSelect={(e) => {
                        e.preventDefault();
                        handleLogout();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>退出</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href="/login"
                  className="ml-4 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-95"
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
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">打开主菜单</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        hidden={!isOpen}
        className={cn(
          'md:hidden bg-white dark:bg-black border-t dark:border-gray-800 transition-all duration-200 ease-in-out',
          isOpen ? 'block' : 'hidden'
        )}
      >
        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block rounded-md px-3 py-2 text-base font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}

          {isLoggedIn ? (
            <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-2">
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  我的账户
                </p>
                <div className="text-sm text-gray-900 dark:text-gray-100 mb-4 truncate">{userEmail}</div>
                <Link
                  href="/dashboard"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 mb-1"
                  onClick={() => setIsOpen(false)}
                >
                  仪表板
                </Link>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    handleLogout();
                  }}
                >
                  <button
                    type="submit"
                    className="w-full text-left block rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                  >
                    退出
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="block rounded-md bg-blue-600 px-3 py-2 text-base font-medium text-white hover:bg-blue-700 transition-colors text-center mt-4"
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