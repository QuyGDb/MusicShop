import React from 'react';
import { ProductCard } from '@/features/product';
import { FilterBar } from '@/features/product';
import { Loader2, Music2 } from 'lucide-react';
import { useProducts } from '@/features/product';
import { useProductFilters } from '@/features/product';

export default function ProductListPage() {
  const {
    products,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage
  } = useProducts();

  const { setPage, searchParams } = useProductFilters();

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
            <span>Showing {products.length} of {totalItems} items</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <FilterBar />
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                <p className="text-neutral-400">Loading products...</p>
              </div>
            ) : error ? (
              <div className="bg-red-900/10 border border-red-900/50 p-6 rounded-2xl text-center">
                <p className="text-red-400">{error}</p>
              </div>
            ) : (
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
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      const newParams = new URLSearchParams(searchParams.toString());
                      newParams.set('page', pageNum.toString());

                      return (
                        <button
                          key={i}
                          onClick={() => setPage(pageNum)}
                          className={`px-4 py-2 rounded-lg border transition-all ${currentPage === pageNum
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-neutral-800 hover:border-neutral-600 text-neutral-400'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}


