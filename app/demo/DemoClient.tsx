'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { track } from '@/lib/track';

// ── The real thing: a live, credit-backed try-on through the same
//    `run-tryon` edge function the mobile app uses. Requires a signed-in
//    account; signup includes one free demo try-on (2 credits). When the
//    trial credits are spent the user is routed to the dashboard. ─────────

type GarmentType =
  | 'shirt' | 'kurta' | 'nehru_coat' | 'blazer' | 'suit'
  | 'casual_dress' | 'salwar_kameez' | 'saree' | 'lehenga' | 'anarkali' | 'jumpsuit';

const MALE_GARMENTS: { id: GarmentType; label: string }[] = [
  { id: 'kurta',      label: 'Kurta' },
  { id: 'shirt',      label: 'Shirt' },
  { id: 'nehru_coat', label: 'Nehru Coat' },
  { id: 'blazer',     label: 'Blazer' },
  { id: 'suit',       label: 'Suit' },
];
const FEMALE_GARMENTS: { id: GarmentType; label: string }[] = [
  { id: 'saree',         label: 'Saree' },
  { id: 'lehenga',       label: 'Lehenga' },
  { id: 'anarkali',      label: 'Anarkali' },
  { id: 'salwar_kameez', label: 'Salwar Kameez' },
  { id: 'casual_dress',  label: 'Casual Dress' },
  { id: 'jumpsuit',      label: 'Jumpsuit' },
];

interface ModelPose {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'neutral';
  image_path: string;
  display_order: number;
}

const CREDIT_COST = 2; // 'low' quality try-on

// Compress an image file to max 1200px JPEG in the browser before upload.
async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, w, h);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Could not process image'))),
      'image/jpeg',
      0.82,
    ),
  );
}

function randomKey(len = 24): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => chars[b % chars.length]).join('');
}

// ── Shared UI bits ──────────────────────────────────────────────────────────

function StepHeading({ num, title }: { num: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <span style={{
        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
        background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 800, color: '#09090b',
      }}>
        {num}
      </span>
      <span style={{
        fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 700,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.7)',
      }}>
        {title}
      </span>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 600,
        color: active ? '#09090b' : 'rgba(255,255,255,0.78)',
        background: active ? '#ffffff' : 'rgba(255,255,255,0.07)',
        border: `1px solid ${active ? '#ffffff' : 'rgba(255,255,255,0.18)'}`,
        borderRadius: 999, padding: '11px 20px', minHeight: 44, cursor: 'pointer',
        transition: 'background 0.15s, color 0.15s, border-color 0.15s',
        whiteSpace: 'nowrap', flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

// ── Component ───────────────────────────────────────────────────────────────

type Stage = 'checking' | 'gate' | 'ready' | 'generating' | 'done';

export default function DemoClient() {
  const supabase = useRef(createClient()).current;
  const router = useRouter();

  const [stage, setStage] = useState<Stage>('checking');
  const [isMobile, setIsMobile] = useState(false);
  const [outletId, setOutletId] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);

  const [fabricFile, setFabricFile] = useState<File | null>(null);
  const [fabricPreview, setFabricPreview] = useState<string | null>(null);
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [garment, setGarment] = useState<GarmentType>('saree');
  const [poses, setPoses] = useState<ModelPose[]>([]);
  const [poseId, setPoseId] = useState<string | null>(null);

  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  // Session + account data. Users whose trial credits are already spent go
  // straight to the dashboard — the demo is a one-shot trial surface.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user) {
        setStage('gate');
        track('demo_gate_view');
        return;
      }
      const [{ data: outlet }, { data: credit }] = await Promise.all([
        supabase.from('outlets').select('id').eq('user_id', user.id).single(),
        supabase.from('credits').select('balance').eq('user_id', user.id).single(),
      ]);
      if (cancelled) return;
      const balance = credit?.balance ?? 0;
      if (balance < CREDIT_COST) {
        track('demo_credits_exhausted_redirect');
        router.replace('/dashboard');
        return;
      }
      setOutletId(outlet?.id ?? null);
      setCredits(balance);
      setStage('ready');
      track('live_demo_view');
    })();
    return () => { cancelled = true; };
  }, [supabase, router]);

  // Model poses for the selected gender
  useEffect(() => {
    if (stage !== 'ready' && stage !== 'done') return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('model_poses')
        .select('id, name, gender, image_path, display_order')
        .eq('is_active', true)
        .in('gender', [gender, 'neutral'])
        .order('display_order', { ascending: true });
      if (cancelled) return;
      const list = (data ?? []) as ModelPose[];
      setPoses(list);
      setPoseId((prev) => (list.some((p) => p.id === prev) ? prev : list[0]?.id ?? null));
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gender, stage === 'ready']);

  const poseUrl = useCallback(
    (path: string) => supabase.storage.from('model_poses').getPublicUrl(path).data.publicUrl,
    [supabase],
  );

  function onPickFabric(file: File | null) {
    setFabricFile(file);
    setError(null);
    if (fabricPreview) URL.revokeObjectURL(fabricPreview);
    setFabricPreview(file ? URL.createObjectURL(file) : null);
  }

  async function generate() {
    if (!fabricFile || !poseId || !outletId) return;
    if ((credits ?? 0) < CREDIT_COST) {
      router.push('/dashboard');
      return;
    }
    setStage('generating');
    setError(null);
    setElapsed(0);
    track('live_demo_generate_clicked', { garment, gender });
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);

    try {
      // 1. Compress + upload the fabric photo
      const blob = await compressImage(fabricFile);
      const path = `${outletId}/${Date.now()}.jpg`;
      const { error: upErr } = await supabase.storage
        .from('fabric_images')
        .upload(path, blob, { contentType: 'image/jpeg' });
      if (upErr) throw new Error(`Upload failed: ${upErr.message}`);

      // 2. Create the fabric record (same shape as the mobile app)
      const { data: fabric, error: fabErr } = await supabase
        .from('fabrics')
        .insert({
          outlet_id: outletId,
          name: `Web demo · ${new Date().toLocaleDateString('en-IN')}`,
          color_tag: null,
          fabric_type: 'other',
          image_url: path,
        })
        .select('id')
        .single();
      if (fabErr || !fabric) throw new Error(fabErr?.message ?? 'Could not save fabric');

      // 3. Run the try-on through the production edge function
      const { data, error: fnErr } = await supabase.functions.invoke('run-tryon', {
        body: {
          mode: 'fabric',
          fabricId: fabric.id,
          garmentType: garment,
          customizations: {},
          quality: 'low',
          modelPoseId: poseId,
          idempotencyKey: randomKey(),
        },
      });
      if (fnErr) throw new Error(fnErr.message ?? 'Generation failed');
      if (!data?.resultUrl) throw new Error(data?.error ?? 'Generation failed — please try again');

      setResultUrl(data.resultUrl);
      setStage('done');
      track('live_demo_generated', { garment, gender });

      // Refresh the credit balance shown
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: credit } = await supabase.from('credits').select('balance').eq('user_id', user.id).single();
        setCredits(credit?.balance ?? null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong — please try again.');
      setStage('ready');
      track('live_demo_failed');
    } finally {
      clearInterval(timer);
    }
  }

  function tryAnother() {
    if ((credits ?? 0) < CREDIT_COST) {
      router.push('/dashboard');
      return;
    }
    setStage('ready');
    setResultUrl(null);
    onPickFabric(null);
  }

  const garments = gender === 'female' ? FEMALE_GARMENTS : MALE_GARMENTS;
  const canGenerate = !!fabricFile && !!poseId && stage !== 'generating';
  const outOfCredits = credits !== null && credits < CREDIT_COST;

  const generateButton = (
    <button
      onClick={generate}
      disabled={!canGenerate}
      style={{
        fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 700,
        color: '#09090b',
        background: canGenerate ? '#ffffff' : 'rgba(255,255,255,0.4)',
        border: 'none', borderRadius: 10,
        padding: '16px 44px', minHeight: 52,
        width: isMobile ? '100%' : 'auto',
        cursor: canGenerate ? 'pointer' : 'not-allowed',
      }}
    >
      {stage === 'generating'
        ? `Draping your fabric… ${elapsed}s`
        : !fabricFile
          ? 'Upload a fabric photo to start'
          : `Generate try-on (${CREDIT_COST} credits)`}
    </button>
  );

  return (
    <main style={{
      background: 'linear-gradient(135deg, #09090b 0%, #18181b 55%, #09090b 100%)',
      minHeight: '100vh',
      padding: isMobile
        ? '92px 18px calc(env(safe-area-inset-bottom, 0px) + 120px)' // room for sticky bar
        : 'clamp(7rem, 12vw, 10rem) 24px clamp(4rem, 8vw, 6rem)',
    }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '1.75rem' : '3rem' }}>
          <span style={{
            display: 'inline-block', fontFamily: 'var(--font-inter)',
            fontSize: 10.5, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.8)', border: '1px solid rgba(201,168,76,0.2)',
            padding: '4px 14px', borderRadius: 999, marginBottom: '1rem',
          }}>
            Live demo · Real AI
          </span>
          <h1 style={{
            fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '1.9rem' : 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 700, color: '#ffffff', lineHeight: 1.12, letterSpacing: '-0.02em', margin: 0,
          }}>
            Your fabric. On a model.{' '}
            <span style={{
              fontStyle: 'italic', display: isMobile ? 'inline' : 'block',
              background: 'linear-gradient(135deg, #c9a84c, #f0d080, #c9a84c)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              In 15 seconds.
            </span>
          </h1>
          {stage !== 'gate' && stage !== 'checking' && credits !== null && !isMobile && (
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '1rem 0 0' }}>
              Credits available: <strong style={{ color: '#f0d080' }}>{credits}</strong> · this try-on uses {CREDIT_COST}
            </p>
          )}
        </div>

        {/* ── Auth gate ── */}
        {stage === 'gate' && (
          <div style={{
            maxWidth: 460, margin: '0 auto', textAlign: 'center',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 20, padding: isMobile ? '1.75rem 1.25rem' : 'clamp(2rem, 5vw, 3rem)',
          }}>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, margin: '0 0 1.75rem' }}>
              This demo runs a <strong style={{ color: '#fff' }}>real try-on</strong> with your own fabric
              photo on our production AI. Create a free account — your first
              try-on is on us, no credit card needed.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link
                href="/signup?next=/demo"
                onClick={() => track('cta_click', { cta: 'demo_gate_signup', location: 'demo_page' })}
                style={{
                  fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 700,
                  color: '#09090b', background: '#ffffff', textDecoration: 'none',
                  borderRadius: 10, padding: '15px 32px', minHeight: 48,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                Create free account →
              </Link>
              <Link
                href="/login?next=/demo"
                onClick={() => track('cta_click', { cta: 'demo_gate_login', location: 'demo_page' })}
                style={{
                  fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 600,
                  color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none',
                  borderRadius: 10, padding: '14px 32px', minHeight: 48,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                I already have an account
              </Link>
            </div>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11.5, color: 'rgba(255,255,255,0.35)', margin: '1.25rem 0 0', letterSpacing: '0.03em' }}>
              Free demo try-on · No credit card · 2-minute setup
            </p>
          </div>
        )}

        {stage === 'checking' && (
          <p style={{ textAlign: 'center', fontFamily: 'var(--font-inter)', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            Loading…
          </p>
        )}

        {/* ── Demo workspace ── */}
        {(stage === 'ready' || stage === 'generating') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1.75rem' : '2.25rem' }}>

            {/* Step 1 — fabric */}
            <div>
              <StepHeading num="1" title="Your fabric photo" />
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 10, cursor: stage === 'generating' ? 'default' : 'pointer',
                background: 'rgba(255,255,255,0.04)',
                border: `1.5px dashed ${fabricPreview ? 'rgba(240,208,128,0.45)' : 'rgba(255,255,255,0.25)'}`,
                borderRadius: 16,
                padding: fabricPreview ? 12 : (isMobile ? '36px 18px' : '40px 20px'),
                minHeight: isMobile ? 110 : 120,
              }}>
                <input
                  type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={(e) => onPickFabric(e.target.files?.[0] ?? null)}
                  disabled={stage === 'generating'}
                />
                {fabricPreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={fabricPreview} alt="Your fabric" style={{ maxHeight: isMobile ? 180 : 200, maxWidth: '100%', borderRadius: 10, display: 'block' }} />
                    {stage !== 'generating' && (
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 600, color: 'rgba(240,208,128,0.9)' }}>
                        Tap to change photo
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 26, lineHeight: 1 }} aria-hidden>📷</span>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.85)', textAlign: 'center' }}>
                      Tap to upload a fabric photo
                    </span>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12.5, color: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 1.6 }}>
                      A phone picture of the bolt or swatch is enough
                    </span>
                  </>
                )}
              </label>
            </div>

            {/* Step 2 — garment */}
            <div>
              <StepHeading num="2" title="Garment" />
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <Chip active={gender === 'female'} onClick={() => { setGender('female'); setGarment('saree'); }}>Womenswear</Chip>
                <Chip active={gender === 'male'} onClick={() => { setGender('male'); setGarment('kurta'); }}>Menswear</Chip>
              </div>
              <div style={{
                display: 'flex', gap: 8,
                flexWrap: isMobile ? 'nowrap' : 'wrap',
                overflowX: isMobile ? 'auto' : 'visible',
                margin: isMobile ? '0 -18px' : 0,
                padding: isMobile ? '0 18px 6px' : 0,
                WebkitOverflowScrolling: 'touch',
              }}>
                {garments.map((g) => (
                  <Chip key={g.id} active={garment === g.id} onClick={() => setGarment(g.id)}>{g.label}</Chip>
                ))}
              </div>
            </div>

            {/* Step 3 — model */}
            <div>
              <StepHeading num="3" title="Model" />
              {poses.length === 0 ? (
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Loading models…</p>
              ) : (
                <div style={{
                  display: 'flex', gap: 10, overflowX: 'auto',
                  margin: isMobile ? '0 -18px' : 0,
                  padding: isMobile ? '0 18px 8px' : '0 0 6px',
                  scrollSnapType: 'x proximity',
                  WebkitOverflowScrolling: 'touch',
                }}>
                  {poses.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPoseId(p.id)}
                      aria-label={`Model: ${p.name}`}
                      style={{
                        flexShrink: 0,
                        width: isMobile ? 112 : 104,
                        height: isMobile ? 150 : 140,
                        borderRadius: 14, overflow: 'hidden',
                        border: `2.5px solid ${poseId === p.id ? '#f0d080' : 'rgba(255,255,255,0.12)'}`,
                        padding: 0, cursor: 'pointer', background: 'rgba(255,255,255,0.04)',
                        scrollSnapAlign: 'start',
                        boxShadow: poseId === p.id ? '0 6px 24px rgba(240,208,128,0.18)' : 'none',
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={poseUrl(p.image_path)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Generate — inline on desktop, sticky bar on mobile */}
            {!isMobile && (
              <div style={{ textAlign: 'center' }}>
                {error && (
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#f87171', margin: '0 0 1rem' }}>{error}</p>
                )}
                {generateButton}
                {stage === 'generating' && (
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '0.9rem 0 0' }}>
                    The AI is stitching and draping — usually 15–30 seconds.
                  </p>
                )}
              </div>
            )}
            {isMobile && error && (
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#f87171', margin: 0, textAlign: 'center' }}>{error}</p>
            )}
          </div>
        )}

        {/* Result */}
        {stage === 'done' && resultUrl && (
          <div style={{ textAlign: 'center' }}>
            <span style={{
              fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 14,
            }}>
              Your result
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resultUrl}
              alt="Your fabric draped on a model"
              style={{ maxWidth: '100%', maxHeight: isMobile ? 440 : 560, borderRadius: 16, boxShadow: '0 18px 60px rgba(0,0,0,0.5)' }}
            />
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '1.1rem 0 0', lineHeight: 1.7 }}>
              {outOfCredits
                ? 'That was your free demo try-on. Head to your dashboard to keep going.'
                : `Credits left: ${credits}`}
            </p>
            <div style={{
              display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap',
              flexDirection: isMobile ? 'column' : 'row', marginTop: '1.4rem',
            }}>
              <Link
                href="/dashboard"
                onClick={() => track('cta_click', { cta: 'demo_result_dashboard', location: 'demo_page' })}
                style={{
                  fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 700,
                  color: '#09090b', background: '#ffffff', textDecoration: 'none',
                  borderRadius: 10, padding: '14px 30px', minHeight: 48,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                Go to my dashboard →
              </Link>
              <button
                onClick={tryAnother}
                style={{
                  fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 600,
                  color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10,
                  padding: '14px 30px', minHeight: 48, cursor: 'pointer',
                }}
              >
                {outOfCredits ? 'Request more credits' : 'Try another fabric'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile sticky generate bar */}
      {isMobile && (stage === 'ready' || stage === 'generating') && (
        <div style={{
          position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 40,
          padding: '12px 18px calc(env(safe-area-inset-bottom, 0px) + 14px)',
          background: 'rgba(9,9,11,0.92)',
          backdropFilter: 'blur(14px)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}>
          {credits !== null && (
            <p style={{
              fontFamily: 'var(--font-inter)', fontSize: 11.5,
              color: 'rgba(255,255,255,0.5)', margin: '0 0 8px', textAlign: 'center',
            }}>
              Credits: <strong style={{ color: '#f0d080' }}>{credits}</strong> · this try-on uses {CREDIT_COST}
              {stage === 'generating' && ' · stitching & draping…'}
            </p>
          )}
          {generateButton}
        </div>
      )}
    </main>
  );
}
