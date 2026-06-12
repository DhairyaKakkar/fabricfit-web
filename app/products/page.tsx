import ProductsPageClient from '@/components/products/ProductsPageClient';

export const metadata = {
  title: 'Live Try-On Demo — Drape Any Garment Instantly',
  description: 'Try TrialRoomStudio in your browser: pick a saree, kurta, lehenga or blazer and see it draped on a model instantly. No signup needed.',
};

export default function ProductsPage() {
  return <ProductsPageClient />;
}
