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

export const metadata: Metadata = {
  title: 'TrialRoomStudio — Virtual Try-On for Fabric Showrooms',
  description:
    'Let your customers see exactly how your fabric looks on them — before stitching. AI-powered virtual try-on built for Indian fabric showrooms.',
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
