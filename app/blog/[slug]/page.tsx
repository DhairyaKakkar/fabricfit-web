import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/nav/Navbar';
import Footer from '@/components/Footer';
import { POSTS, getPost } from '@/content/posts';

const SITE_URL = 'https://trialroomstudio.com';

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      url: `${SITE_URL}/blog/${post.slug}`,
      title: post.metaTitle,
      description: post.metaDescription,
      publishedTime: post.date,
    },
  };
}

const bodyCss = `
  .post-body p { font-family: var(--font-inter); font-size: 16px; color: rgba(0,0,0,0.7); line-height: 1.85; margin: 0 0 1.25em; }
  .post-body h3 { font-family: var(--font-playfair); font-size: 1.35rem; font-weight: 700; color: #09090b; margin: 1.8em 0 0.6em; letter-spacing: -0.01em; }
  .post-body ul, .post-body ol { font-family: var(--font-inter); font-size: 16px; color: rgba(0,0,0,0.7); line-height: 1.85; padding-left: 1.4em; margin: 0 0 1.25em; }
  .post-body li { margin-bottom: 0.5em; }
  .post-body a { color: #09090b; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
  .post-body strong { color: #09090b; }
  .post-body em { font-style: italic; }
`;

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'TrialRoomStudio', url: SITE_URL },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  };

  const faqLd = post.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faq.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}
      <style dangerouslySetInnerHTML={{ __html: bodyCss }} />

      <Navbar />
      <main style={{ background: '#ffffff' }}>
        <article style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(8rem, 14vw, 11rem) 24px clamp(4rem, 8vw, 6rem)' }}>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'rgba(0,0,0,0.4)', marginBottom: '1.5rem' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            {' / '}
            <Link href="/blog" style={{ color: 'inherit', textDecoration: 'none' }}>Blog</Link>
            {' / '}
            <span style={{ color: 'rgba(0,0,0,0.6)' }}>{post.category}</span>
          </nav>

          <h1 style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
            fontWeight: 700, color: '#09090b',
            lineHeight: 1.12, letterSpacing: '-0.02em',
            margin: '0 0 1rem',
          }}>
            {post.title}
          </h1>

          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12.5, color: 'rgba(0,0,0,0.4)', margin: '0 0 2.5rem', letterSpacing: '0.04em' }}>
            {new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            {' · '}{post.category}
          </p>

          {/* Intro */}
          <div className="post-body" dangerouslySetInnerHTML={{ __html: post.intro }} />

          {/* Sections */}
          {post.sections.map((section) => (
            <section key={section.h2}>
              <h2 style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 700, color: '#09090b',
                lineHeight: 1.2, letterSpacing: '-0.01em',
                margin: '2.6rem 0 1rem',
              }}>
                {section.h2}
              </h2>
              <div className="post-body" dangerouslySetInnerHTML={{ __html: section.html }} />
            </section>
          ))}

          {/* FAQ */}
          {post.faq && post.faq.length > 0 && (
            <section>
              <h2 style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 700, color: '#09090b',
                lineHeight: 1.2, margin: '2.6rem 0 1.25rem',
              }}>
                Frequently asked questions
              </h2>
              {post.faq.map(({ q, a }) => (
                <div key={q} style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', padding: '1.1rem 0' }}>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 600, color: '#09090b', margin: '0 0 0.4rem', lineHeight: 1.5 }}>
                    {q}
                  </p>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: 'rgba(0,0,0,0.55)', lineHeight: 1.75, margin: 0 }}>
                    {a}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* Contextual CTA */}
          <aside style={{
            marginTop: '3.5rem',
            background: '#09090b', borderRadius: 20,
            padding: 'clamp(2rem, 5vw, 3rem)',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 700,
              color: '#ffffff', lineHeight: 1.25, margin: '0 0 0.6rem',
            }}>
              See your own fabric, stitched and draped — in 15 seconds.
            </p>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13.5, color: 'rgba(255,255,255,0.5)', margin: '0 0 1.5rem', lineHeight: 1.7 }}>
              Run a real try-on with your own fabric photo — free account, free credits, no credit card.
            </p>
            <Link href="/demo" style={{
              display: 'inline-block',
              fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 700,
              color: '#09090b', background: '#ffffff', textDecoration: 'none',
              borderRadius: 8, padding: '13px 32px',
            }}>
              Try the Live Demo →
            </Link>
          </aside>

          {/* Related posts */}
          <nav aria-label="Related articles" style={{ marginTop: '3rem' }}>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', margin: '0 0 1rem' }}>
              Keep reading
            </p>
            {POSTS.filter((p) => p.slug !== post.slug).slice(0, 3).map((p) => (
              <p key={p.slug} style={{ margin: '0 0 0.6rem' }}>
                <Link href={`/blog/${p.slug}`} style={{ fontFamily: 'var(--font-inter)', fontSize: 14.5, fontWeight: 600, color: '#09090b', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  {p.title}
                </Link>
              </p>
            ))}
          </nav>
        </article>
      </main>
      <Footer />
    </>
  );
}
