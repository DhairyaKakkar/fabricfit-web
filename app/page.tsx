import Navbar from '@/components/nav/Navbar';
import VideoSection from '@/components/VideoSection';
import MarqueeDivider from '@/components/MarqueeDivider';
import SeeItLiveSection from '@/components/SeeItLiveSection';
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
      <VideoSection />
      <MarqueeDivider />
      <SeeItLiveSection />
      <HowItWorksSection />
      <MarqueeDivider />
      <FeaturesSection />
      <TractionSection />
      <CtaSection />
    </>
  );
}
