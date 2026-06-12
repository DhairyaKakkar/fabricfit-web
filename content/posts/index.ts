import type { Post } from './types';

import virtualTryOnSoftware from './virtual-try-on-software-for-fabric-showrooms';
import increasesShowroomSales from './how-virtual-try-on-increases-showroom-sales';
import vsPhotoshoot from './virtual-try-on-vs-photoshoot-cost-comparison';
import bestApps from './best-virtual-try-on-apps-india-2026';
import shopifyIntegration from './shopify-virtual-try-on-integration';
import whatsappCatalogue from './whatsapp-catalogue-for-fabric-shops';
import reduceReturns from './reduce-fabric-returns-and-restitching';
import aiCataloguePhotos from './ai-catalogue-photos-without-photoshoot';
import sareeTryOn from './saree-virtual-try-on';
import lehengaTryOn from './lehenga-virtual-try-on-bridal-showrooms';
import mensEthnicWear from './mens-ethnic-wear-virtual-try-on';
import showroomTechnology from './fabric-showroom-technology-guide';
import howItWorks from './how-does-ai-virtual-try-on-work';
import futureOfRetail from './future-of-fabric-retail-india';
import whyCustomersLeave from './why-customers-leave-without-buying-fabric';
import marketingIdeas from './fabric-shop-marketing-ideas-india';
import photographFabric from './how-to-photograph-fabric-for-your-catalogue';
import sellFabricOnline from './sell-fabric-online-india-guide';
import tryOnCost from './virtual-try-on-cost-india';
import customerExperience from './fabric-showroom-customer-experience';

export type { Post } from './types';

export const POSTS: Post[] = [
  virtualTryOnSoftware,
  increasesShowroomSales,
  vsPhotoshoot,
  bestApps,
  shopifyIntegration,
  whatsappCatalogue,
  reduceReturns,
  aiCataloguePhotos,
  sareeTryOn,
  lehengaTryOn,
  mensEthnicWear,
  showroomTechnology,
  howItWorks,
  futureOfRetail,
  whyCustomersLeave,
  marketingIdeas,
  photographFabric,
  sellFabricOnline,
  tryOnCost,
  customerExperience,
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
