import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { buttonVariants } from '@/shared/components';
import { ShoppingBag } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { FeaturedCollections } from '@/features/curation/components/storefront/FeaturedCollections';
import { MusicHeroScene } from '@/widgets/home/ui/MusicHeroScene';

export default function HomePage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = !!accessToken;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Immersive 3D Hero Section */}
      <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <MusicHeroScene />
      </div>

      {/* Featured Collections Section */}
      <div className="container mx-auto px-4 pb-32">
        <FeaturedCollections />
      </div>
    </div>
  );
}
