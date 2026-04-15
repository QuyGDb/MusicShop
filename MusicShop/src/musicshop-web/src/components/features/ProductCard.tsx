'use client';

import React from 'react';
import { ProductListItem, ReleaseFormat } from '@/types/product';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Disc, Music } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: ProductListItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formatIcon = product.format === ReleaseFormat.Vinyl ? <Disc className="h-4 w-4" /> : <Music className="h-4 w-4" />;
  const formatName = ReleaseFormat[product.format];

  return (
    <Card className="group relative overflow-hidden border-neutral-800 bg-neutral-900/40 backdrop-blur-md transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] flex flex-col h-full">
      {/* Badge Section */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isLimited && (
          <Badge className="bg-amber-500/90 text-black font-bold border-none">Limited</Badge>
        )}
        {product.isPreorder && (
          <Badge className="bg-blue-500/90 text-white border-none">Pre-order</Badge>
        )}
      </div>

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-neutral-800">
        <Image
          src={product.coverUrl || '/images/placeholder-album.png'}
          alt={`${product.artistName} - ${product.name}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
           {/* Quick Action Button */}
           <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
             <ShoppingCart className="h-4 w-4 mr-2" />
             Add to Cart
           </Button>
        </div>
      </div>

      <CardContent className="p-4 flex-grow">
        <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
          {formatIcon}
          <span>{formatName}</span>
        </div>
        <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-neutral-400 text-sm line-clamp-1">{product.artistName}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-neutral-800/50 mt-auto">
        <div className="flex flex-col">
          <span className="text-xs text-neutral-500 font-medium">Price</span>
          <span className="text-xl font-black text-white">
            ${product.minPrice.toFixed(2)}
          </span>
        </div>
        {!product.inStock && (
          <span className="text-[10px] uppercase font-black text-red-500 tracking-wider">Out of Stock</span>
        )}
      </CardFooter>
    </Card>
  );
};
