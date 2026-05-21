import Navbar from '@/components/nav/Navbar';
import HeroSection from '@/components/hero/HeroSection';
import VideoSection from '@/components/VideoSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import FeaturesSection from '@/components/features/FeaturesSection';
import TractionSection from '@/components/TractionSection';
import CtaSection from '@/components/CtaSection';

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <VideoSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TractionSection />
      <CtaSection />
    </>
  );
}
