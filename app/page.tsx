import Navbar from '@/components/nav/Navbar';
import HeroSection from '@/components/hero/HeroSection';
import VideoSection from '@/components/VideoSection';
import FeaturesSection from '@/components/features/FeaturesSection';

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <VideoSection />
      <FeaturesSection />
    </>
  );
}
