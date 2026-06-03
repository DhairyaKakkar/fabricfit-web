import Navbar from '@/components/nav/Navbar';
import VideoSection from '@/components/VideoSection';
import MarqueeDivider from '@/components/MarqueeDivider';
import ProductsPageClient from '@/components/products/ProductsPageClient';
import HowItWorksSection from '@/components/HowItWorksSection';
import CtaSection from '@/components/CtaSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <VideoSection />
      <MarqueeDivider />
      <HowItWorksSection />
      <ProductsPageClient />
      <CtaSection />
      <Footer />
    </>
  );
}
