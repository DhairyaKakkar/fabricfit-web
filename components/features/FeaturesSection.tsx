'use client';

import InStoreSlide from './InStoreSlide';
import WebEmbedSlide from './WebEmbedSlide';
import CatalogSlide from './CatalogSlide';

export default function FeaturesSection() {
  return (
    <div id="features">
      <InStoreSlide />
      <WebEmbedSlide />
      <CatalogSlide />
    </div>
  );
}
