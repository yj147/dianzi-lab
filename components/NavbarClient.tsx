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
import { User, Menu, X, LayoutDashboard, LogOut, Sparkles } from 'lucide-react';

interface NavbarClientProps {
  isLoggedIn: boolean;
  userEmail?: string;
}

export default function NavbarClient({ isLoggedIn, userEmail }: NavbarClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  const navLinks = [
    { name: '首页', href: '/' },
    { name: '提交点子', href: '/submit' },
  ];

  const mobileMenuId = 'mobile-menu';

  return (
    <nav
      className={cn(
        'relative z-50 px-8 py-6 transition-colors',
        isScrolled ? 'bg-white/60 backdrop-blur-lg shadow-sm' : ''
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-lavender-200 blob-shape flex items-center justify-center text-coral-400 shadow-inner transition-transform group-hover:scale-105">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="font-script text-3xl text-slate-800">点子 Lab</span>
        </Link>

        {/* Desktop Navigation Pills */}
        <div className="hidden md:flex items-center bg-white/50 backdrop-blur-md rounded-full px-8 py-3 gap-10 border border-white/50">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'font-medium transition-colors hover:text-blue-600',
                  isActive ? 'text-blue-600' : 'text-slate-700'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600 truncate max-w-[240px]">
                {userEmail}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="用户菜单"
                    className="flex items-center justify-center h-10 w-10 rounded-full bg-lavender-100 text-lavender-300 transition-all hover:bg-lavender-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400"
                  >
                    <User className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">我的账户</p>
                    <p className="text-xs leading-none text-slate-500">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer w-full flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>仪表板</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-coral-400 focus:text-coral-500 cursor-pointer"
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
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-600 hover:text-coral-400 font-semibold px-4 transition-colors"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="bg-coral-400 text-white font-bold px-7 py-3 rounded-full hover:bg-coral-500 transition-all shadow-lg shadow-coral-400/20 transform hover:scale-105 active:scale-95"
              >
                开启梦境
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-full p-2 text-slate-600 hover:bg-white/50 focus:outline-none"
            aria-label={isOpen ? '关闭主菜单' : '打开主菜单'}
            aria-controls={mobileMenuId}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id={mobileMenuId}
        hidden={!isOpen}
        className="md:hidden mt-4 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg overflow-hidden"
      >
        <div className="space-y-1 px-4 py-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block rounded-2xl px-4 py-3 text-base font-medium transition-colors',
                  isActive
                    ? 'bg-lavender-50 text-blue-600'
                    : 'text-slate-700 hover:bg-lavender-50/50'
                )}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="border-t border-lavender-100 my-3" />

          {isLoggedIn ? (
            <>
              <div className="px-4 py-2 text-sm text-slate-600 truncate">{userEmail}</div>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full text-left rounded-2xl px-4 py-3 text-base font-medium text-coral-400 hover:bg-coral-50"
              >
                退出
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              <Link
                href="/login"
                className="block text-center rounded-full px-4 py-3 text-base font-semibold text-slate-600 border-2 border-dashed border-lavender-200 hover:border-lavender-300"
                onClick={() => setIsOpen(false)}
              >
                登录
              </Link>
              <Link
                href="/register"
                className="block text-center rounded-full px-4 py-3 text-base font-bold text-white bg-coral-400 hover:bg-coral-500 shadow-lg shadow-coral-400/20"
                onClick={() => setIsOpen(false)}
              >
                开启梦境
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
