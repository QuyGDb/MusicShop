import { useParams } from 'react-router-dom';
import { ProductAdminDetails } from '@/features/products';

export default function ProductAdminDetailsPage() {
  const { id } = useParams<{ id: string }>();
  
  if (!id) return null;
  
  return <ProductAdminDetails productId={id} />;
}
