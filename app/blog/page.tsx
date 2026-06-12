import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/nav/Navbar';
import Footer from '@/components/Footer';
import { POSTS } from '@/content/posts';

export const metadata: Metadata = {
  title: 'Blog — Virtual Try-On & Fabric Retail Insights',
  description:
    'Guides on virtual try-on, AI catalogues, WhatsApp selling, and growing a fabric showroom in India — from the team at TrialRoomStudio.',
  alternates: { canonical: '/blog' },
};

const FUNNEL_LABEL: Record<string, string> = {
  bottom: 'Buyer Guide',
  middle: 'Playbook',
  top: 'Insights',
};

export default function BlogIndexPage() {
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <Navbar />
      <main style={{ background: '#fafafa', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(8rem, 14vw, 11rem) 24px 3rem' }}>
          <span style={{
            display: 'inline-block',
            fontFamily: 'var(--font-inter)',
            fontSize: 11, fontWeight: 600,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(0,0,0,0.1)',
            padding: '4px 16px', borderRadius: 999,
            marginBottom: '1.25rem',
          }}>
            The TrialRoomStudio Blog
          </span>
          <h1 style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 700, color: '#09090b',
            lineHeight: 1.08, letterSpacing: '-0.02em', margin: 0,
          }}>
            Selling fabric,<br />smarter.
          </h1>
          <p style={{
            fontFamily: 'var(--font-inter)', fontSize: 15,
            color: 'rgba(0,0,0,0.5)', lineHeight: 1.7,
            maxWidth: 520, margin: '1.25rem 0 0',
          }}>
            Practical guides on virtual try-on, AI catalogues, WhatsApp selling,
            and growing a fabric showroom in India.
          </p>
        </div>

        {/* Post grid */}
        <div style={{
          maxWidth: 1100, margin: '0 auto', padding: '0 24px clamp(5rem, 10vw, 8rem)',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20,
        }}>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{
                display: 'flex', flexDirection: 'column', gap: 14,
                background: '#ffffff', borderRadius: 20,
                border: '1px solid rgba(0,0,0,0.06)',
                padding: '28px 26px', textDecoration: 'none',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-inter)', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'rgba(0,0,0,0.35)',
              }}>
                {FUNNEL_LABEL[post.funnel]} · {post.category}
              </span>
              <h2 style={{
                fontFamily: 'var(--font-playfair)', fontSize: 21, fontWeight: 700,
                color: '#09090b', lineHeight: 1.25, letterSpacing: '-0.01em', margin: 0,
              }}>
                {post.title}
              </h2>
              <p style={{
                fontFamily: 'var(--font-inter)', fontSize: 13.5,
                color: 'rgba(0,0,0,0.5)', lineHeight: 1.65, margin: 0, flex: 1,
              }}>
                {post.excerpt}
              </p>
              <span style={{
                fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 600,
                color: '#09090b', letterSpacing: '0.02em',
              }}>
                Read article →
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
