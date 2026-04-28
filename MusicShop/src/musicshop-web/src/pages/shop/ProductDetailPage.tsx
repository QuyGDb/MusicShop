import { useParams } from 'react-router-dom';
import { ProductDetail } from '@/features/products/components/storefront/ProductDetail';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) return null;

  return <ProductDetail slug={slug} />;
}
