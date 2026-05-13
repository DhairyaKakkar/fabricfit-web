'use client';

import { useRef } from 'react';
import FeatureChapterLine from './FeatureChapterLine';
import InStoreSlide from './InStoreSlide';
import WebEmbedSlide from './WebEmbedSlide';
import CatalogSlide from './CatalogSlide';

export default function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} id="features">
      <FeatureChapterLine containerRef={containerRef} />
      <InStoreSlide />
      <WebEmbedSlide />
      <CatalogSlide />
    </div>
  );
}
