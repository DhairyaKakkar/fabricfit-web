import Link from 'next/link';
import Navbar from '@/components/nav/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background: 'linear-gradient(160deg, #FEF9F0 0%, #F7ECD9 100%)' }}
      >
        <p
          className="text-xs font-semibold uppercase mb-5"
          style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.22em', color: '#92400E' }}
        >
          404 — Page not found
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 700,
            color: '#1C1206',
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            maxWidth: 720,
          }}
        >
          This page wandered
          <br />
          off the rack.
        </h1>
        <p
          className="mt-5 mb-9"
          style={{ fontFamily: 'var(--font-inter)', fontSize: 16, color: '#57534E', maxWidth: 460, lineHeight: 1.7 }}
        >
          The link you followed doesn&apos;t exist or has moved. Let&apos;s get you back to the showroom.
        </p>
        <Link
          href="/"
          className="inline-block rounded-full px-8 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
          style={{ fontFamily: 'var(--font-inter)', background: '#09090b', color: '#fff' }}
        >
          Back to home
        </Link>
      </main>
      <Footer />
    </>
  );
}
