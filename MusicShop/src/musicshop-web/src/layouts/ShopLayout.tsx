import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from '@/widgets/navbar/ui/Navbar';

export const ShopLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-neutral-800 bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-neutral-500 text-sm">
            © 2026 MusicShop. All rights reserved.
          </div>
          <div className="flex gap-8 text-neutral-400 text-sm">
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

