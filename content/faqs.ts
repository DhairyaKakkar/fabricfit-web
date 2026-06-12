// Homepage FAQ content. Plain data module (no 'use client') so it can be
// imported by both the FAQSection client component and the server-rendered
// FAQPage JSON-LD — keeping the rich-snippet markup in sync with the UI.
export const FAQS = [
  {
    q: 'Does it work with all fabric types?',
    a: 'Yes — sarees, salwar suits, kurtas, lehengas, sherwanis, blazers, and more. If you can photograph the fabric, TRS can drape it on a virtual model.',
  },
  {
    q: 'Does my customer need to download anything?',
    a: 'No. The try-on runs on the TrialRoomStudio mobile app that your staff use in-store. Your customer simply watches — no app, no account, no friction.',
  },
  {
    q: 'How long does each try-on take?',
    a: 'About 15–20 seconds from uploading the fabric photo to seeing the draped result on-screen. Most showrooms run 10–15 try-ons in a single customer visit.',
  },
  {
    q: 'Are my fabric images safe?',
    a: 'Yes. Your images are stored securely in your own account and are never shared with other showrooms or third parties. You can delete them at any time.',
  },
  {
    q: 'Do I need a tech team to set this up?',
    a: 'No. You upload fabric photos directly from your phone. Most showrooms are live within 20 minutes of signing up — no IT, no agency, no configuration.',
  },
  {
    q: 'What happens when my free credits run out?',
    a: 'You can upgrade to any paid plan or top up with a one-time credit pack. There is no lock-in on the Pay As You Go plan — you only pay for what you use.',
  },
];
