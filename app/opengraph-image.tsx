import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'TrialRoomStudio — Virtual Try-On for Fabric Showrooms';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #FEF9F0 0%, #F3D29A 100%)',
          position: 'relative',
        }}
      >
        {/* gold accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 10,
            background: 'linear-gradient(90deg, #92400E, #D9A046, #F0D080, #D9A046, #92400E)',
          }}
        />
        <div
          style={{
            fontSize: 26,
            letterSpacing: 8,
            textTransform: 'uppercase',
            color: '#92400E',
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          AI Virtual Trial Room
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: '#1C1206',
            lineHeight: 1.02,
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          See it before
          <br />
          you stitch it.
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 30,
            color: '#57341a',
            maxWidth: 820,
          }}
        >
          AI-powered try-on for fabric &amp; garment showrooms.
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 70,
            left: 80,
            fontSize: 30,
            fontWeight: 700,
            color: '#92400E',
          }}
        >
          trialroomstudio.com
        </div>
      </div>
    ),
    { ...size },
  );
}
