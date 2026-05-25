'use client';

import HeroSection from './hero/HeroSection';

export default function SeeItLiveSection() {
  return (
    <div id="see-it-live" style={{ position: 'relative' }}>

      {/* HeroSection fills 100vh — exactly one viewport, no overflow */}
      <HeroSection />
    </div>
  );
}
