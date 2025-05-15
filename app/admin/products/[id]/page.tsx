import ProductForm from '@/components/admin/product-form';
import { getProductById } from '@/lib/actions/product.action';
import { requireAdmin } from '@/lib/auth-guard';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Update Product',
};

const AdminProductUpdatePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  await requireAdmin();
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return notFound();
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">Update Product</h1>

      <ProductForm type="Update" product={product} productId={product.id} />
    </div>
  );
};

export default AdminProductUpdatePage;
