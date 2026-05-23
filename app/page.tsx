import Navbar from '@/components/nav/Navbar';
import HeroSection from '@/components/hero/HeroSection';
import VideoSection from '@/components/VideoSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import FeaturesSection from '@/components/features/FeaturesSection';
import TractionSection from '@/components/TractionSection';
import CtaSection from '@/components/CtaSection';
import ScrollSnapper from '@/components/ScrollSnapper';

export default function Home() {
  return (
    <>
      <ScrollSnapper />
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
