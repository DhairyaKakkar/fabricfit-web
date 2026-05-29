import Navbar from '@/components/nav/Navbar';
import VideoSection from '@/components/VideoSection';
import MarqueeDivider from '@/components/MarqueeDivider';
import ProductsPageClient from '@/components/products/ProductsPageClient';
import HowItWorksSection from '@/components/HowItWorksSection';
import TractionSection from '@/components/TractionSection';
import CtaSection from '@/components/CtaSection';
import ScrollSnapper from '@/components/ScrollSnapper';
import SmoothScroll from '@/components/SmoothScroll';

export default function Home() {
  return (
    <>
      <ScrollSnapper />
      <SmoothScroll />
      <Navbar />
      <VideoSection />
      <MarqueeDivider />
      <HowItWorksSection />
      <ProductsPageClient />
      <CtaSection />
    </>
  );
}
