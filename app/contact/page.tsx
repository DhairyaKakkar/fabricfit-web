import type { Metadata } from 'next';
import Navbar from '@/components/nav/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Contact Us — TrialRoomStudio',
  description: 'Get in touch with the TrialRoomStudio team.',
};

const CONTACTS = [
  {
    icon: '💬',
    label: 'WhatsApp',
    value: '+91 98847 44296',
    href: 'https://wa.me/919884744296?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20TrialRoomStudio',
    cta: 'Message us',
  },
  {
    icon: '✉️',
    label: 'Email',
    value: 'hello@trialroomstudio.com',
    href: 'mailto:hello@trialroomstudio.com',
    cta: 'Send email',
  },
  {
    icon: '📍',
    label: 'Based in',
    value: 'Singapore & India',
    href: null,
    cta: null,
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-28 pb-24 px-6">
        <div style={{ maxWidth: 640, margin: '0 auto' }}>

          {/* Header */}
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.14em' }}>
              Get in touch
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
              We&apos;d love to hear from you.
            </h1>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto" style={{ fontFamily: 'var(--font-inter)', lineHeight: 1.7 }}>
              Whether you have a question, want a demo, or need a custom plan — reach out and we&apos;ll get back to you fast.
            </p>
          </div>

          {/* Contact cards */}
          <div className="flex flex-col gap-4 mb-14">
            {CONTACTS.map((c) => (
              <div
                key={c.label}
                className="flex items-center justify-between p-6 rounded-2xl border border-zinc-200 bg-white"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-0.5" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.1em' }}>
                      {c.label}
                    </p>
                    <p className="text-sm font-medium text-zinc-900" style={{ fontFamily: 'var(--font-inter)' }}>
                      {c.value}
                    </p>
                  </div>
                </div>
                {c.href && c.cta && (
                  <a
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-xs font-semibold px-4 py-2 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {c.cta} →
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Book demo CTA */}
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: 'linear-gradient(135deg, #09090b, #18181b)' }}
          >
            <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
              Want to see it live?
            </h2>
            <p className="text-sm text-zinc-400 mb-6" style={{ fontFamily: 'var(--font-inter)', lineHeight: 1.7 }}>
              Book a 10-minute WhatsApp demo and we&apos;ll run a live try-on with your own fabric photos.
            </p>
            <a
              href="https://wa.me/919884744296?text=Hi%2C%20I%27d%20like%20to%20book%20a%20demo%20of%20TrialRoomStudio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 rounded-xl text-sm font-semibold bg-white text-zinc-900 hover:bg-zinc-100 transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Book a Demo on WhatsApp
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
