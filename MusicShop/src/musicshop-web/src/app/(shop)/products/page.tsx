import React, { Suspense } from 'react';
import { productService } from '@/services/productService';
import { ProductFilters, ReleaseFormat } from '@/types/product';
import { ProductCard } from '@/components/features/ProductCard';
import { FilterBar } from '@/components/features/FilterBar';
import { Loader2, Music2 } from 'lucide-react';
import Link from 'next/link';

interface ProductsPageProps {
  searchParams: {
    format?: string;
    genre?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    q?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Parse filters from searchParams
  const filters: ProductFilters = {
    format: searchParams.format ? parseInt(searchParams.format) as ReleaseFormat : undefined,
    genre: searchParams.genre,
    minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: 12, // Items per page
    searchQuery: searchParams.q
  };

  // Fetch data in Server Component
  const result = await productService.getProducts(filters);
  const products = result.data || [];
  const meta = result.meta;

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Area */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
             <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
               Explore Collection
             </h1>
             <p className="text-neutral-400 max-w-xl">
               Discover high-quality vinyl records and CDs from your favorite artists.
             </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-neutral-500 font-medium">
             <span>Showing {products.length} of {meta?.total || 0} items</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <Suspense fallback={<div className="h-64 bg-neutral-900 animate-pulse rounded-2xl" />}>
              <FilterBar />
            </Suspense>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {result.success ? (
              <>
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <Music2 className="h-12 w-12 text-neutral-700 mb-4" />
                    <h3 className="text-xl font-bold mb-2">No products found</h3>
                    <p className="text-neutral-500">Try adjusting your filters or search query.</p>
                  </div>
                )}

                {/* Pagination */}
                {meta && meta.total > filters.limit! && (
                  <div className="mt-12 flex justify-center gap-2">
                    {/* Simplified Pagination logic */}
                    {Array.from({ length: Math.ceil(meta.total / filters.limit!) }).map((_, i) => (
                      <Link 
                        key={i}
                        href={{
                          pathname: '/products',
                          query: { ...searchParams, page: i + 1 }
                        }}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          (filters.page || 1) === i + 1 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'border-neutral-800 hover:border-neutral-600'
                        }`}
                      >
                        {i + 1}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-red-900/10 border border-red-900/50 p-6 rounded-2xl text-center">
                <p className="text-red-400">{result.error?.message || 'Failed to load products.'}</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
