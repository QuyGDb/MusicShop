import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { buttonVariants } from '@/shared/components';
import { ShoppingBag } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { FeaturedCollections } from '@/features/curation/components/storefront/FeaturedCollections';

export default function HomePage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = !!accessToken;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden py-32 bg-surface">
        {/* Warm abstract decorations */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-foreground">
            Where Your Soul <br />
            Meets the <span className="text-primary italic">Melody</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {isAuthenticated
              ? `Welcome back, ${user?.fullName || 'Music Lover'}! Are you ready to explore our latest collection?`
              : "Explore thousands of high-quality vinyl records and CDs. Sign up now to start your musical journey."
            }
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/products"
              className={cn(buttonVariants({ size: 'lg' }), "w-full sm:w-auto px-10 h-16 text-lg bg-primary text-primary-foreground hover:bg-primary-dark inline-flex items-center justify-center rounded-2xl shadow-xl shadow-primary/20")}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Explore Shop
            </Link>

            {!isAuthenticated && (
              <Link
                to="/register"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  "w-full sm:w-auto px-10 h-16 text-lg border-border text-foreground hover:bg-muted inline-flex items-center justify-center rounded-2xl"
                )}
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Featured Collections Section */}
      <div className="container mx-auto px-4 pb-32">
        <FeaturedCollections />
      </div>
    </div>
  );
}
