import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from '@/widgets/navbar/ui/Navbar';

import { CartDrawer } from '@/features/cart/components/CartDrawer';

export const ShopLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-surface py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-subtle text-sm">
            © 2026 MusicShop. All rights reserved.
          </div>
          <div className="flex gap-8 text-muted-foreground text-sm">
            <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
