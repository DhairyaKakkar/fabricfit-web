import Navbar from '@/components/nav/Navbar';
import HeroSection from '@/components/hero/HeroSection';
import VideoSection from '@/components/VideoSection';
import FeaturesSection from '@/components/features/FeaturesSection';
import TractionSection from '@/components/TractionSection';
import CtaSection from '@/components/CtaSection';
import CustomCursor from '@/components/CustomCursor';

export default function Home() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <HeroSection />
      <VideoSection />
      <FeaturesSection />
      <TractionSection />
      <CtaSection />
    </>
  );
}
