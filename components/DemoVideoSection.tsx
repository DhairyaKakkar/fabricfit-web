import Image from 'next/image';

// "How TrialRoomStudio Works" banner — replaces the old demo-video block.
// The banner artwork carries its own heading + 5-step walkthrough.
export default function DemoVideoSection() {
  return (
    <section style={{ background: '#ffffff', padding: 'clamp(4rem, 8vw, 7rem) 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div
          style={{
            borderRadius: 20,
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 24px 64px rgba(28,18,6,0.10)',
          }}
        >
          <Image
            src="/how-it-works-banner.webp"
            alt="How TrialRoomStudio works — start a try-on, choose fabric, review photo, generate preview, and explore more looks"
            width={1672}
            height={941}
            loading="lazy"
            className="w-full h-auto"
            style={{ display: 'block' }}
          />
        </div>
      </div>
    </section>
  );
}
