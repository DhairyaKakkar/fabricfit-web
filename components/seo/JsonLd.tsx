import { FAQS } from '@/content/faqs';

const SITE_URL = 'https://trialroomstudio.com';

// Structured data for rich results. Rendered once in the root layout
// (Organization + WebSite + SoftwareApplication) and on the homepage (FAQPage).
// Test with https://search.google.com/test/rich-results after deploy.

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'TrialRoomStudio',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    'AI-powered virtual try-on for fabric showrooms. Customers see exactly how a fabric looks on them — before stitching.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: '+91-98847-44296',
    email: 'hello@trialroomstudio.com',
    areaServed: ['IN', 'SG', 'AE'],
    availableLanguage: ['en'],
  },
};

const webSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'TrialRoomStudio',
  publisher: { '@id': `${SITE_URL}/#organization` },
};

const softwareApplication = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'TrialRoomStudio',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Android, Web',
  url: SITE_URL,
  description:
    'Virtual try-on software for fabric and garment showrooms. Upload a fabric photo and see it stitched and draped on a model in 15–20 seconds.',
  offers: {
    '@type': 'Offer',
    price: '25',
    priceCurrency: 'INR',
    description: 'Pay As You Go — ₹25 per try-on. Free demo try-on included on signup.',
  },
  publisher: { '@id': `${SITE_URL}/#organization` },
};

function Script({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function SiteJsonLd() {
  return (
    <>
      <Script data={organization} />
      <Script data={webSite} />
      <Script data={softwareApplication} />
    </>
  );
}

export function FaqJsonLd() {
  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  return <Script data={faqPage} />;
}
