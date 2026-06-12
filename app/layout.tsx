import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import ScrollRestorationControl from '@/components/ScrollRestorationControl';
import { SiteJsonLd } from '@/components/seo/JsonLd';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-playfair',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
});

const SITE_URL = 'https://trialroomstudio.com';
const SITE_TITLE = 'Virtual Try-On for Fabric Showrooms — See It Before You Stitch It | TrialRoomStudio';
const SITE_DESC =
  'Let your customers see exactly how your fabric looks on them — in 15 seconds, before stitching. AI-powered virtual try-on built for Indian fabric showrooms. ₹25 per try-on, free credits to start.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | TrialRoomStudio',
  },
  description: SITE_DESC,
  keywords: [
    'virtual try-on', 'virtual try-on for retailers', 'fabric showroom software',
    'AI virtual dressing room', 'garment visualization software', 'saree try-on app',
    'kurta try-on', 'lehenga virtual try-on', 'AI fashion', 'Indian fabric retail',
    'clothing store conversion', 'fabric showroom India', 'TrialRoomStudio',
  ],
  alternates: {
    canonical: '/',
    languages: { 'en-IN': '/', en: '/' },
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'TrialRoomStudio',
    title: SITE_TITLE,
    description: SITE_DESC,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESC,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-white text-gray-900 antialiased" suppressHydrationWarning>
        <ScrollRestorationControl />
        <SiteJsonLd />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
