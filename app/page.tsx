import Navbar from '@/components/nav/Navbar';
import VideoSection from '@/components/VideoSection';
import MarqueeDivider from '@/components/MarqueeDivider';
import HowItWorksSection from '@/components/HowItWorksSection';
import DemoVideoSection from '@/components/DemoVideoSection';
import FAQSection from '@/components/FAQSection';
import ProductsPageClient from '@/components/products/ProductsPageClient';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <VideoSection />
      <MarqueeDivider />
      <HowItWorksSection />
      <DemoVideoSection />
      <FAQSection />
      <ProductsPageClient />
      <Footer />
    </>
  );
}
