'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button, buttonVariants } from '@/components/ui/button';
import { Music, LogOut, User as UserIcon, ShoppingBag, Search } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    clearAuth();
    router.refresh();
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/products' },
    { name: 'Artists', href: '/artists' },
  ];

  return (
    <header className="border-b border-neutral-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Music className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold tracking-tight">MusicShop</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-400",
                  pathname === link.href ? "text-blue-500" : "text-neutral-400"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center relative mr-2">
            <Search className="h-4 w-4 absolute left-3 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search albums..." 
              className="bg-neutral-900 border border-neutral-800 rounded-full py-1.5 pl-9 pr-4 text-xs w-48 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {isAuthenticated ? (
            <>
              <Link href="/profile" className={cn(
                "text-sm font-medium hover:text-blue-400 transition-colors flex items-center gap-1",
                pathname === '/profile' ? "text-blue-500" : "text-neutral-400"
              )}>
                <UserIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{user?.fullName}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-neutral-400 hover:text-white">
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Link 
              href="/login" 
              className={cn(buttonVariants({ variant: 'default' }), "bg-blue-600 hover:bg-blue-700")}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
