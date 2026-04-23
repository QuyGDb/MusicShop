import React from 'react';
import { Product, ReleaseFormat } from '../types';
import { Card, CardContent, CardFooter, Badge, Button } from '@/shared/components';
import { ShoppingCart, Disc, Music } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatIcon = product.format === ReleaseFormat.Vinyl ? <Disc className="h-4 w-4" /> : <Music className="h-4 w-4" />;
  const formatName = ReleaseFormat[product.format];

  return (
    <Card className="group relative overflow-hidden border-border bg-surface shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/40 flex flex-col h-full">
      {/* Badge Section */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isLimited && (
          <Badge className="bg-primary text-primary-foreground font-bold border-none">Limited</Badge>
        )}
        {product.isPreorder && (
          <Badge className="bg-foreground text-background border-none">Pre-order</Badge>
        )}
      </div>

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.coverUrl || '/images/placeholder-album.png'}
          alt={`${product.artistName} - ${product.name}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <Button className="w-full bg-primary hover:bg-primary-dark text-primary-foreground rounded-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>

      <CardContent className="p-4 flex-grow">
        <div className="flex items-center gap-1.5 text-xs text-subtle mb-1">
          {formatIcon}
          <span>{formatName}</span>
        </div>
        <h3 className="font-bold text-lg leading-tight line-clamp-1 text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-1">{product.artistName}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-border mt-auto">
        <div className="flex flex-col">
          <span className="text-xs text-subtle font-medium">Price</span>
          <span className="text-xl font-black text-foreground">
            ${product.minPrice.toFixed(2)}
          </span>
        </div>
        {!product.inStock && (
          <span className="text-[10px] uppercase font-black text-red-400 tracking-wider">Out of Stock</span>
        )}
      </CardFooter>
    </Card>
  );
}
