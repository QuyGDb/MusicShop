import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from '@/widgets/navbar/ui/Navbar';
import { Mail, Phone } from 'lucide-react';

import { CartDrawer } from '@/features/cart/components/CartDrawer';

export const ShopLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-surface py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            {/* Logo & Purpose */}
            <div className="space-y-4">
              <h3 className="text-xl font-black tracking-tighter text-foreground uppercase">CAT MUSIC SHOP</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                This is a pet project developed for learning purposes.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-subtle">Contact Information</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Mail className="h-4 w-4" />
                  trinhxuanquy2k3@gmail.com
                </p>
                <p className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Phone className="h-4 w-4" />
                  08226010505
                </p>
              </div>
            </div>

            {/* Copyright */}
            <div className="md:text-right space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-subtle">Legal</h4>
              <p className="text-sm text-muted-foreground">
                © 2026 CAT MUSIC SHOP. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
