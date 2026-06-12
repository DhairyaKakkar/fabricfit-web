import Navbar from '@/components/nav/Navbar';
import VideoSection from '@/components/VideoSection';
import SocialProofStrip from '@/components/SocialProofStrip';
import MarqueeDivider from '@/components/MarqueeDivider';
import HowItWorksSection from '@/components/HowItWorksSection';
import DemoVideoSection from '@/components/DemoVideoSection';
import ProductsPageClient from '@/components/products/ProductsPageClient';
import TestimonialsSection from '@/components/TestimonialsSection';
import PricingTeaserSection from '@/components/PricingTeaserSection';
import ComparisonSection from '@/components/ComparisonSection';
import FAQSection from '@/components/FAQSection';
import CtaSection from '@/components/CtaSection';
import Footer from '@/components/Footer';
import { FaqJsonLd } from '@/components/seo/JsonLd';

// Conversion funnel: hook (hero) → credibility (proof strip) → education
// (features + demo video) → activation (interactive try-on demo) → trust
// (testimonials) → price anxiety removal (pricing teaser + comparison) →
// objection handling (FAQ) → final ask (CTA).
export default function Home() {
  return (
    <>
      <FaqJsonLd />
      <Navbar />
      <VideoSection />
      <SocialProofStrip />
      <MarqueeDivider />
      <HowItWorksSection />
      <DemoVideoSection />
      <div id="try-demo">
        <ProductsPageClient />
      </div>
      <TestimonialsSection />
      <PricingTeaserSection />
      <ComparisonSection />
      <FAQSection />
      <CtaSection />
      <Footer />
    </>
  );
}
