import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import { buttonVariants } from '@/shared/components';
import { ShoppingBag } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export default function HomePage() {
  const { user, accessToken } = useAuth();
  const isAuthenticated = !!accessToken;

  return (
    <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden py-24">
      {/* Abstract background decorations */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-3xl space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">
          Where Your Soul <br /> 
          Meets the Melody
        </h1>
        
        <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          {isAuthenticated 
            ? `Welcome back, ${user?.fullName}! Are you ready to explore our latest collection?`
            : "Explore thousands of high-quality vinyl records and CDs. Sign up now to start your musical journey."
          }
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            to="/products" 
            className={cn(buttonVariants({ size: 'lg' }), "w-full sm:w-auto px-8 h-14 text-lg bg-white text-black hover:bg-neutral-200 inline-flex items-center justify-center")}
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Explore Shop
          </Link>
          
          {!isAuthenticated && (
            <Link 
              to="/register" 
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }), 
                "w-full sm:w-auto px-8 h-14 text-lg border-neutral-700 hover:bg-neutral-900 inline-flex items-center justify-center"
              )}
            >
              Create Account
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}



