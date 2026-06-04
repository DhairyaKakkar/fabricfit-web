import Navbar from '@/components/nav/Navbar';
import VideoSection from '@/components/VideoSection';
import SocialProofStrip from '@/components/SocialProofStrip';
import MarqueeDivider from '@/components/MarqueeDivider';
import HowItWorksSection from '@/components/HowItWorksSection';
import DemoVideoSection from '@/components/DemoVideoSection';
import ProductsPageClient from '@/components/products/ProductsPageClient';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import CtaSection from '@/components/CtaSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <VideoSection />
      <SocialProofStrip />
      <MarqueeDivider />
      <HowItWorksSection />
      <DemoVideoSection />
      <ProductsPageClient />
      <TestimonialsSection />
      <FAQSection />
      <CtaSection />
      <Footer />
    </>
  );
}
