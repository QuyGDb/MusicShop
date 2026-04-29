import React from 'react';
import { useProductDetail } from '../../hooks/useProductDetail';
import { useAuthStore } from '@/store/useAuthStore';
import { ReleaseFormat } from '../../types';
import { Button, Badge, Card, CardContent } from '@/shared/components';
import {
  ArrowLeft,
  ShoppingCart,
  Disc3,
  Music2,
  Radio,
  Star,
  Clock,
  Package,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface ProductDetailProps {
  slug: string;
}

function FormatIcon({ format }: { format: ReleaseFormat }) {
  switch (format) {
    case ReleaseFormat.Vinyl:
      return <Disc3 className="h-5 w-5" />;
    case ReleaseFormat.CD:
      return <Music2 className="h-5 w-5" />;
    case ReleaseFormat.Cassette:
      return <Radio className="h-5 w-5" />;
    default:
      return <Music2 className="h-5 w-5" />;
  }
}

export function ProductDetail({ slug }: ProductDetailProps) {
  const user = useAuthStore((state) => state.user);
  const { product, isLoading, error, handleBack, handleAddToCart, isAddingToCart } = useProductDetail({ slug });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-12 w-12 text-red-400" />
          <h2 className="text-2xl font-bold text-foreground">Product not found</h2>
          <p className="text-muted-foreground">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={handleBack} variant="outline" className="mt-4 rounded-xl">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const inStock = product.stockQty > 0 && product.isAvailable;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Cover Image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted border border-border shadow-xl">
            <img
              src={product.coverUrl || '/images/placeholder-album.png'}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isLimited && (
                <Badge className="bg-primary text-primary-foreground font-bold border-none shadow-lg">
                  <Star className="h-3 w-3 mr-1" />
                  Limited Edition
                </Badge>
              )}
              {product.isPreorder && (
                <Badge className="bg-foreground text-background border-none shadow-lg">
                  <Clock className="h-3 w-3 mr-1" />
                  Pre-order
                </Badge>
              )}
              {product.isSigned && (
                <Badge className="bg-amber-500 text-white border-none shadow-lg">
                  Signed
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Format & Artist */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FormatIcon format={product.format} />
                <span className="font-medium">{product.format}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                {product.name}
              </h1>
              <p className="text-xl text-muted-foreground font-medium">
                {product.artist?.name}
              </p>
            </div>

            {/* Price & Stock */}
            <div className="flex items-end gap-4">
              <span className="text-4xl font-black text-foreground">
                ${product.price.toFixed(2)}
              </span>
              {inStock ? (
                <span className="text-sm font-bold text-emerald-500 mb-1">
                  <Package className="h-4 w-4 inline mr-1" />
                  In Stock ({product.stockQty})
                </span>
              ) : (
                <span className="text-sm font-bold text-red-400 mb-1 uppercase tracking-wider">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Add to Cart */}
            {user?.role?.toLowerCase() !== 'admin' && (
              <Button
                onClick={handleAddToCart}
                disabled={!inStock || isAddingToCart}
                className="w-full sm:w-auto h-14 px-10 text-lg rounded-2xl bg-primary text-primary-foreground hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <ShoppingCart className="h-5 w-5 mr-2" />
                )}
                {inStock ? (isAddingToCart ? 'Adding...' : 'Add to Cart') : 'Sold Out'}
              </Button>
            )}

            {/* Description */}
            {product.description && (
              <div className="border-t border-border pt-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-subtle mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Variant Attributes */}
            {product.vinylAttributes && (
              <Card className="bg-surface border-border">
                <CardContent className="p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-subtle mb-4 flex items-center gap-2">
                    <Disc3 className="h-4 w-4 text-primary" />
                    Vinyl Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {product.vinylAttributes.discColor && (
                      <div>
                        <span className="text-subtle block text-xs font-bold uppercase tracking-wider">Disc Color</span>
                        <span className="text-foreground font-medium capitalize">{product.vinylAttributes.discColor}</span>
                      </div>
                    )}
                    {product.vinylAttributes.weightGrams && (
                      <div>
                        <span className="text-subtle block text-xs font-bold uppercase tracking-wider">Weight</span>
                        <span className="text-foreground font-medium">{product.vinylAttributes.weightGrams}g</span>
                      </div>
                    )}
                    {product.vinylAttributes.speedRpm && (
                      <div>
                        <span className="text-subtle block text-xs font-bold uppercase tracking-wider">Speed</span>
                        <span className="text-foreground font-medium">{product.vinylAttributes.speedRpm} RPM</span>
                      </div>
                    )}
                    {product.vinylAttributes.discCount && (
                      <div>
                        <span className="text-subtle block text-xs font-bold uppercase tracking-wider">Disc Count</span>
                        <span className="text-foreground font-medium uppercase">{product.vinylAttributes.discCount}</span>
                      </div>
                    )}
                    {product.vinylAttributes.sleeveType && (
                      <div>
                        <span className="text-subtle block text-xs font-bold uppercase tracking-wider">Sleeve</span>
                        <span className="text-foreground font-medium capitalize">{product.vinylAttributes.sleeveType}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {product.cdAttributes && (
              <Card className="bg-surface border-border">
                <CardContent className="p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-subtle mb-4 flex items-center gap-2">
                    <Music2 className="h-4 w-4 text-primary" />
                    CD Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {product.cdAttributes.edition && (
                      <div>
                        <span className="text-subtle block text-xs font-bold uppercase tracking-wider">Edition</span>
                        <span className="text-foreground font-medium capitalize">{product.cdAttributes.edition}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-subtle block text-xs font-bold uppercase tracking-wider">Japan Edition</span>
                      <span className="text-foreground font-medium">{product.cdAttributes.isJapanEdition ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {product.cassetteAttributes && (
              <Card className="bg-surface border-border">
                <CardContent className="p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-subtle mb-4 flex items-center gap-2">
                    <Radio className="h-4 w-4 text-primary" />
                    Cassette Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {product.cassetteAttributes.tapeColor && (
                      <div>
                        <span className="text-subtle block text-xs font-bold uppercase tracking-wider">Tape Color</span>
                        <span className="text-foreground font-medium capitalize">{product.cassetteAttributes.tapeColor}</span>
                      </div>
                    )}
                    {product.cassetteAttributes.edition && (
                      <div>
                        <span className="text-subtle block text-xs font-bold uppercase tracking-wider">Edition</span>
                        <span className="text-foreground font-medium capitalize">{product.cassetteAttributes.edition}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Limited Info */}
            {product.isLimited && product.limitedQty && (
              <p className="text-sm text-amber-500 font-bold">
                <Star className="h-4 w-4 inline mr-1" />
                Limited to {product.limitedQty} copies
              </p>
            )}

            {/* Pre-order Date */}
            {product.isPreorder && product.preorderReleaseDate && (
              <p className="text-sm text-muted-foreground font-medium">
                <Clock className="h-4 w-4 inline mr-1" />
                Expected release: {new Date(product.preorderReleaseDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
