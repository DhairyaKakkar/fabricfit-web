import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import ScrollRestorationControl from '@/components/ScrollRestorationControl';

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
const SITE_TITLE = 'TrialRoomStudio — Virtual Try-On for Fabric Showrooms';
const SITE_DESC =
  'Let your customers see exactly how your fabric looks on them — before stitching. AI-powered virtual try-on built for Indian fabric showrooms.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESC,
  keywords: [
    'virtual try-on', 'fabric showroom', 'AI fashion', 'garment visualization',
    'TrialRoomStudio', 'kurta try-on', 'saree try-on', 'Indian fabric retail',
  ],
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'TrialRoomStudio',
    title: SITE_TITLE,
    description: SITE_DESC,
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
      <body className="bg-[#fef9f0] text-gray-900 antialiased" suppressHydrationWarning>
        <ScrollRestorationControl />
        {children}
      </body>
    </html>
  );
}
