"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, Search, UserCircle, LogOut, Shield } from 'lucide-react';
import { api } from '@/lib/api';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Profiles', href: '/profiles', icon: Users },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Account', href: '/account', icon: UserCircle },
];

export function Navbar() {
  const pathname = usePathname();

  // Don't show navbar on login page
  if (pathname === '/') return null;

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', {});
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed', err);
      window.location.href = '/';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-50 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
          <Shield size={20} />
        </div>
        <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:inline-block">Insighta Labs+</span>
      </div>

      <div className="flex items-center gap-1 sm:gap-4 h-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md transition-all text-sm font-medium",
                isActive 
                  ? "text-indigo-600 bg-indigo-50" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <Icon size={18} />
              <span className="hidden md:inline-block">{item.name}</span>
            </Link>
          );
        })}
        
        <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block"></div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-md transition-all text-sm font-medium text-red-500 hover:bg-red-50"
        >
          <LogOut size={18} />
          <span className="hidden md:inline-block">Logout</span>
        </button>
      </div>
    </nav>
  );
}
